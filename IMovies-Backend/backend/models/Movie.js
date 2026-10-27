import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, default: '' },
  genre: { type: String, default: 'Drama' },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  durationMinutes: { type: Number, min: 1, required: true },
  language: { type: String, default: 'English' },
  releaseYear: { type: Number },
  posterUrl: { type: String, default: '' },
  category: { type: String, default: 'Trending' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
