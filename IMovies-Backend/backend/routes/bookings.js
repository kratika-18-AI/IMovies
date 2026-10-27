import { Router } from 'express';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', async (req, res, next) => {
  const { showId, seats } = req.body;
  if (!mongoose.isValidObjectId(showId) || !Array.isArray(seats) || seats.length < 1 || seats.length > 8) {
    return res.status(400).json({ message: 'A valid showId and between 1 and 8 seats are required.' });
  }
  if (new Set(seats).size !== seats.length || seats.some(seat => typeof seat !== 'string' || !/^[A-F][1-8]$/.test(seat))) {
    return res.status(400).json({ message: 'Seat list contains duplicates or invalid seat IDs.' });
  }

  let show;
  try {
    // Atomic conditional update prevents two requests from reserving the same seat.
    show = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats } },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );
    if (!show) return res.status(409).json({ message: 'One or more seats are no longer available. Refresh the seat map and try again.' });

    const ticketPrice = show.pricePerSeat * seats.length;
    const convenienceFee = 20;
    const booking = await Booking.create({
      bookingCode: `IMV-${randomBytes(4).toString('hex').toUpperCase()}`,
      user: req.user.id,
      show: show._id,
      seats,
      ticketPrice,
      convenienceFee,
      totalPrice: ticketPrice + convenienceFee
    });
    const populated = await Booking.findById(booking._id).populate({ path: 'show', populate: { path: 'movie', select: 'title posterUrl' } }).lean();
    res.status(201).json(populated);
  } catch (error) {
    // If booking creation fails after reserving seats, release them to avoid orphaned reservations.
    if (show?._id) await Show.updateOne({ _id: show._id }, { $pullAll: { bookedSeats: seats } }).catch(() => {});
    next(error);
  }
});

router.get('/mine', async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({ path: 'show', populate: { path: 'movie', select: 'title posterUrl' } })
      .sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (error) { next(error); }
});

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id, status: 'confirmed' });
    if (!booking) return res.status(404).json({ message: 'Confirmed booking not found.' });
    const show = await Show.findById(booking.show);
    if (show) await Show.updateOne({ _id: show._id }, { $pullAll: { bookedSeats: booking.seats } });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled.', bookingId: booking.id });
  } catch (error) { next(error); }
});

export default router;
