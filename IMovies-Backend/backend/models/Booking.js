import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  seats: { type: [String], required: true },
  ticketPrice: { type: Number, required: true },
  convenienceFee: { type: Number, default: 20 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
