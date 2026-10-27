import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  cinemaName: { type: String, required: true, trim: true },
  city: { type: String, required: true, default: 'Bhopal' },
  startsAt: { type: Date, required: true, index: true },
  screenName: { type: String, default: 'Screen 1' },
  seatCount: { type: Number, default: 48, min: 1 },
  pricePerSeat: { type: Number, required: true, min: 0 },
  // Seat IDs are stored on the show so a seat is reserved for this show only.
  bookedSeats: { type: [String], default: [] }
}, { timestamps: true });

showSchema.index({ movie: 1, startsAt: 1, cinemaName: 1 });

export default mongoose.model('Show', showSchema);
