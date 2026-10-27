import { Router } from 'express';
import Movie from '../models/Movie.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({ title: 1 }).lean();
    res.json(movies);
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (error) { next(error); }
});

export default router;
