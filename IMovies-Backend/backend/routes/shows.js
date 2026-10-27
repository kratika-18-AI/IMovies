import { Router } from 'express';
import mongoose from 'mongoose';
import Show from '../models/Show.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.movieId) {
      if (!mongoose.isValidObjectId(req.query.movieId)) return res.status(400).json({ message: 'Invalid movieId.' });
      filter.movie = req.query.movieId;
    }
    if (req.query.city) filter.city = String(req.query.city);
    if (req.query.from) filter.startsAt = { $gte: new Date(String(req.query.from)) };
    const shows = await Show.find(filter).populate('movie', 'title posterUrl durationMinutes language').sort({ startsAt: 1 }).lean();
    res.json(shows.map(show => ({ ...show, availableSeatCount: show.seatCount - show.bookedSeats.length })));
  } catch (error) { next(error); }
});

router.get('/:id/seats', async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie', 'title posterUrl').lean();
    if (!show) return res.status(404).json({ message: 'Show not found.' });
    const booked = new Set(show.bookedSeats);
    const allSeats = Array.from({ length: show.seatCount }, (_, i) => {
      const row = String.fromCharCode(65 + Math.floor(i / 8));
      const number = (i % 8) + 1;
      const code = `${row}${number}`;
      return { code, status: booked.has(code) ? 'booked' : 'available' };
    });
    res.json({ showId: show._id, movie: show.movie, cinemaName: show.cinemaName, city: show.city, startsAt: show.startsAt, pricePerSeat: show.pricePerSeat, seats: allSeats });
  } catch (error) { next(error); }
});

export default router;
