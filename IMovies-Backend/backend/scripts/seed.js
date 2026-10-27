import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

const movieData = [
  { title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', rating: 8.8, durationMinutes: 166, language: 'English', releaseYear: 2024, category: 'Trending', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
  { title: 'Interstellar', genre: 'Sci-Fi / Drama', rating: 8.7, durationMinutes: 169, language: 'English', releaseYear: 2014, category: 'Fan favourites', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', description: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.' },
  { title: 'The Batman', genre: 'Action / Crime', rating: 7.8, durationMinutes: 176, language: 'English', releaseYear: 2022, category: 'Trending', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', description: 'Batman ventures into Gotham City’s underworld when a killer leaves a trail of cryptic clues.' },
  { title: 'Spider-Man: No Way Home', genre: 'Action / Fantasy', rating: 8.2, durationMinutes: 148, language: 'English', releaseYear: 2021, category: 'Fan favourites', posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', description: 'Peter asks Doctor Strange for help after his identity is revealed, but a spell goes wrong.' },
  { title: 'La La Land', genre: 'Romance / Musical', rating: 8.0, durationMinutes: 128, language: 'English', releaseYear: 2016, category: 'Feel-good', posterUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', description: 'A jazz musician and an aspiring actress fall in love while chasing their dreams in Los Angeles.' },
  { title: 'Oppenheimer', genre: 'Biography / Drama', rating: 8.3, durationMinutes: 180, language: 'English', releaseYear: 2023, category: 'Trending', posterUrl: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
  { title: 'Inside Out 2', genre: 'Animation / Family', rating: 7.6, durationMinutes: 96, language: 'English', releaseYear: 2024, category: 'Feel-good', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', description: 'Riley enters a new chapter of life, and headquarters faces the arrival of new emotions.' },
  { title: 'Jawan', genre: 'Action / Thriller', rating: 7.0, durationMinutes: 169, language: 'Hindi', releaseYear: 2023, category: 'Trending', posterUrl: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg', description: 'A man driven by a personal vendetta sets out to correct the wrongs in society.' }
];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Create backend/.env first.');
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    const movieIds = [];
    for (const data of movieData) {
      const movie = await Movie.findOneAndUpdate({ title: data.title }, { $set: data }, { upsert: true, new: true, setDefaultsOnInsert: true });
      movieIds.push(movie);
    }
    const start = new Date();
    start.setHours(19, 30, 0, 0);
    for (const movie of movieIds) {
      const exists = await Show.exists({ movie: movie._id, cinemaName: 'CineMax Bhopal', startsAt: start });
      if (!exists) {
        await Show.create({ movie: movie._id, cinemaName: 'CineMax Bhopal', city: 'Bhopal', startsAt: start, screenName: 'Screen 1', seatCount: 48, pricePerSeat: 220 });
      }
    }
    console.log(`Seeded ${movieIds.length} movies and sample shows.`);
  } finally {
    await mongoose.disconnect();
  }
}
seed().catch(error => { console.error(error.message); process.exit(1); });
