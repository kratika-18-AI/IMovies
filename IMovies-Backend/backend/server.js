import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import movieRoutes from './routes/movies.js';
import showRoutes from './routes/shows.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'IMovies API' });
});

app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing. Create backend/.env from backend/.env.example.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    app.listen(PORT, () => console.log(`IMovies API running at http://localhost:${PORT}`));
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}
start();
