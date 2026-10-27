import React, { useEffect, useMemo, useState } from 'react';
import {
  Clapperboard, Search, MapPin, ChevronDown, Menu, X, Play, Star,
  CalendarDays, Clock3, Ticket, UserRound, ArrowRight, Check, Plus,
  Minus, Armchair, Film, Sparkles, Heart, Popcorn, ShieldCheck, RotateCcw
} from 'lucide-react';

const movies = [
  { id: 1, title: 'Dune: Part Two', genre: 'Sci-Fi / Adventure', rating: '8.8', duration: '2h 46m', language: 'English', year: '2024', category: 'Trending', color: 'dune', poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },
  { id: 2, title: 'Interstellar', genre: 'Sci-Fi / Drama', rating: '8.7', duration: '2h 49m', language: 'English', year: '2014', category: 'Fan favourites', color: 'interstellar', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', description: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.' },
  { id: 3, title: 'The Batman', genre: 'Action / Crime', rating: '7.8', duration: '2h 56m', language: 'English', year: '2022', category: 'Trending', color: 'batman', poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', description: 'Batman ventures into Gotham City’s underworld when a sadistic killer leaves behind a trail of cryptic clues.' },
  { id: 4, title: 'Spider-Man: No Way Home', genre: 'Action / Fantasy', rating: '8.2', duration: '2h 28m', language: 'English', year: '2021', category: 'Fan favourites', color: 'spider', poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', description: 'With his identity revealed, Peter asks Doctor Strange for help, but a spell goes wrong and brings unexpected visitors.' },
  { id: 5, title: 'La La Land', genre: 'Romance / Musical', rating: '8.0', duration: '2h 08m', language: 'English', year: '2016', category: 'Feel-good', color: 'lala', poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', description: 'A jazz musician and an aspiring actress fall in love while chasing their dreams in Los Angeles.' },
  { id: 6, title: 'Oppenheimer', genre: 'Biography / Drama', rating: '8.3', duration: '3h 00m', language: 'English', year: '2023', category: 'Trending', color: 'oppenheimer', poster: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.' },
  { id: 7, title: 'Inside Out 2', genre: 'Animation / Family', rating: '7.6', duration: '1h 36m', language: 'English', year: '2024', category: 'Feel-good', color: 'insideout', poster: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', description: 'Riley enters a new chapter of life, and headquarters faces the arrival of surprising new emotions.' },
  { id: 8, title: 'Jawan', genre: 'Action / Thriller', rating: '7.0', duration: '2h 49m', language: 'Hindi', year: '2023', category: 'Trending', color: 'jawan', poster: 'https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg', description: 'A man driven by a personal vendetta sets out to correct the wrongs in society.' },
];

const showDates = [
  { label: 'TODAY', date: '26', month: 'OCT' },
  { label: 'TUE', date: '27', month: 'OCT' },
  { label: 'WED', date: '28', month: 'OCT' },
  { label: 'THU', date: '29', month: 'OCT' },
];

function App() {
  const [page, setPage] = useState('home');
    const [apiMovies, setApiMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected movie API response');
        }

        const formattedMovies = data.map((movie) => ({
          id: movie._id || movie.id,
          title: movie.title,
          genre: movie.genre || '',
          rating: String(movie.rating ?? 'N/A'),
          duration: movie.durationMinutes
            ? `${Math.floor(movie.durationMinutes / 60)}h ${String(
                movie.durationMinutes % 60
              ).padStart(2, '0')}m`
            : movie.duration || '',
          language: movie.language || 'English',
          year: String(movie.releaseYear || movie.year || ''),
          category: movie.category || 'Trending',
          color: 'default',
          poster: movie.posterUrl || movie.poster || '',
          description: movie.description || '',
        }));

        setApiMovies(formattedMovies);
        setMoviesError('');
      } catch (error) {
        console.error('Movie API error:', error);
        setMoviesError('Unable to load movies from the server.');
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchMovies();
  }, []);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All movies');
  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [availableShows, setAvailableShows] = useState([]);
const [showsLoading, setShowsLoading] = useState(false);
const [showsError, setShowsError] = useState('');
useEffect(() => {
  const fetchShows = async () => {
    setShowsLoading(true);
    setShowsError('');

    try {
      const response = await fetch('http://localhost:5000/api/shows');

      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }

      const data = await response.json();
      setAvailableShows(data);
    } catch (error) {
      console.error('Shows API error:', error);
      setShowsError('Unable to load shows from the server.');
    } finally {
      setShowsLoading(false);
    }
  };

  fetchShows();
}, []);
  const [selectedDate, setSelectedDate] = useState(showDates[0]);
  const [selectedTime, setSelectedTime] = useState('7:30 PM');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);



  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
  if (!user) {
    setBookings([]);
    return;
  }

  const token = localStorage.getItem('imovies_token');
  if (!token) return;

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();

      const formattedBookings = data.map((booking) => ({
        id: booking.bookingCode,
        bookingId: booking._id,
        movie: booking.show?.movie?.title || 'Movie',
        poster: booking.show?.movie?.posterUrl || '',
        date: booking.show?.startsAt
          ? new Date(booking.show.startsAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '',
        time: booking.show?.startsAt
          ? new Date(booking.show.startsAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '',
        seats: booking.seats || [],
        total: booking.totalPrice || 0,
        status: booking.status || 'Confirmed',
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error('Fetch bookings error:', error);
    }
  };

  fetchBookings();
}, [user]);
  useEffect(() => {
const token = localStorage.getItem('imovies_token');

if (!token) return;

fetch('http://localhost:5000/api/auth/me', {
headers: {
Authorization: `Bearer ${token}`,
},
})
.then(async (response) => {
if (!response.ok) {
localStorage.removeItem('imovies_token');
return null;
}
return response.json();
})
.then((data) => {
  if (data?.id && data?.name) {
    setUser(data);
  }
})
.catch((error) => {
console.error('Session restore failed:', error);
});
}, []);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [location, setLocation] = useState('Bhopal');

  const moviesToDisplay = apiMovies.length > 0 ? apiMovies : movies;

const filteredMovies = useMemo(() => moviesToDisplay.filter(movie => {
  const matchesSearch = `${movie.title} ${movie.genre} ${movie.language}`
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    activeCategory === 'All movies' || movie.category === activeCategory;

  return matchesSearch && matchesCategory;
}), [moviesToDisplay, search, activeCategory]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const go = (nextPage) => {
    setPage(nextPage);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 
const openMovie = (movie) => {
  setSelectedMovie(movie);
  setSelectedSeats([]);

  const movieId = movie.id || movie._id;
  const matchingShow = availableShows.find(
    (show) => String(show.movie?._id || show.movie) === String(movieId)
  );

  setSelectedShow(matchingShow || null);

  setPage('details');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  const toggleSeat = (seat) => {
    if (seat.startsWith('X')) return;
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : prev.length >= 8 ? (notify('You can select up to 8 seats.'), prev) : [...prev, seat]);
  };

 
const confirmBooking = async () => {
  if (!user) {
    setShowLogin(true);
    notify('Sign in to confirm your booking.');
    return;
  }

  if (!selectedSeats.length) {
    notify('Please choose at least one seat.');
    return;
  }

  if (!selectedShow?._id) {
    notify('No valid show selected. Please choose a showtime again.');
    return;
  }

  const token = localStorage.getItem('imovies_token');

  if (!token) {
    notify('Your session has expired. Please sign in again.');
    setShowLogin(true);
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        showId: selectedShow._id,
        seats: selectedSeats,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      notify(data.message || 'Booking failed. Please try again.');
      return;
    }

    const booking = {
      id: data.bookingCode,
      bookingId: data._id,
      movie: data.show?.movie?.title || selectedMovie.title,
      poster: data.show?.movie?.posterUrl || selectedMovie.poster,
      date: new Date(data.show?.startsAt || selectedShow.startsAt)
        .toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      time: new Date(data.show?.startsAt || selectedShow.startsAt)
        .toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      seats: [...data.seats],
      total: data.totalPrice,
      status: data.status === 'confirmed' ? 'Confirmed' : data.status,
    };

    setBookings((prev) => [booking, ...prev]);
    setSelectedSeats([]);
    setPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify('Booking confirmed successfully!');
  } catch (error) {
    console.error('Booking API error:', error);
    notify('Unable to connect to the server. Please try again.');
  }
};


  const handleLogin = async (event) => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const email = form.get('email')?.toString().trim();
  const password = form.get('password')?.toString();

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      notify(data.message || 'Login failed. Please try again.');
      return;
    }

    localStorage.setItem('imovies_token', data.token);
    setUser(data.user);
    setShowLogin(false);
    notify(`Welcome, ${data.user.name}!`);
  } catch (error) {
    console.error('Login error:', error);
    notify('Unable to connect to the server.');
  }
};


const handleSignup = async ({ name, email, password }) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      notify(data.message || 'Account creation failed.');
      return;
    }

    localStorage.setItem('imovies_token', data.token);
    setUser(data.user);
    setShowLogin(false);
    notify(`Account created successfully! Welcome, ${data.user.name}.`);
  } catch (error) {
    console.error('Signup error:', error);
    notify('Unable to connect to the server.');
  }
};



  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="IMovies home">
          <span className="brand-mark"><Clapperboard size={22} strokeWidth={2.5} /></span>
          <span className="brand-name">i<span>movies</span><small>YOUR MOVIE NIGHT, MADE EASY</small></span>
        </button>
        <nav className={`nav-links ${mobileMenu ? 'nav-open' : ''}`}>
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => go('home')}>Explore</button>
          <button className={page === 'bookings' ? 'nav-link active' : 'nav-link'} onClick={() => go('bookings')}>My bookings</button>
          <button className="nav-link" onClick={() => { setActiveCategory('Feel-good'); go('home'); }}>Feel-good picks</button>
        </nav>
        <div className="header-actions">
          <button className="location-pill" onClick={() => setLocation(location === 'Bhopal' ? 'Indore' : 'Bhopal')}><MapPin size={15} /> {location} <ChevronDown size={14} /></button>
          {user ? ( <div className="profile-wrapper"> <button className="profile-button" onClick={() => setShowProfileMenu(!showProfileMenu)} > <span className="avatar">{user.name[0]}</span> <span className="profile-name">{user.name.split(' ')[0]}</span> </button> {showProfileMenu && ( <div className="profile-dropdown"> <button onClick={() => { go('bookings'); setShowProfileMenu(false); }} > My Bookings </button> <button onClick={() => { localStorage.removeItem('imovies_token'); setUser(null); setShowProfileMenu(false); notify('You have been logged out.'); }} > Logout </button> </div> )} </div> ) : ( <button className="sign-in" onClick={() => setShowLogin(true)}> Sign in <ArrowRight size={15} /> </button> )}
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        {page === 'home' && <HomePage
          search={search} setSearch={setSearch} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          movies={filteredMovies} onMovie={openMovie} onExplore={() => document.getElementById('movie-list')?.scrollIntoView({ behavior: 'smooth' })}
        />}
        {page === 'details' && <DetailsPage movie={selectedMovie} onBack={() => go('home')} onContinue={() => go('seats')} />}
         
       {page === 'seats' && (
  <SeatPage
    movie={selectedMovie}
    availableShows={availableShows}
    selectedShow={selectedShow}
    setSelectedShow={setSelectedShow}
    showsLoading={showsLoading}
    showsError={showsError}
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    selectedTime={selectedTime}
    setSelectedTime={setSelectedTime}
    selectedSeats={selectedSeats}
    toggleSeat={toggleSeat}
    onBack={() => go('details')}
    onContinue={confirmBooking}
  />
)}

        {page === 'confirmation' && <ConfirmationPage booking={bookings[0]} onHome={() => go('home')} onBookings={() => go('bookings')} />}
        {page === 'bookings' && <BookingsPage bookings={bookings} user={user} onSignIn={() => setShowLogin(true)} onExplore={() => go('home')} />}
      </main>

      <Footer onHome={() => go('home')} /> {showLogin && ( <LoginModal onClose={() => setShowLogin(false)} onSubmit={handleLogin} onSignup={handleSignup} /> )} {toast && ( <div className="toast"> <Check size={17} /> {toast} </div> )}
    </div>
  );
}

function HomePage({ search, setSearch, activeCategory, setActiveCategory, movies, onMovie, onExplore }) {
  const categories = ['All movies', 'Trending', 'Fan favourites', 'Feel-good'];
  return <>
    <section className="hero">
      <div className="hero-backdrop"></div>
      <div className="hero-content">
        <div className="eyebrow"><span className="eyebrow-dot"></span> YOUR SEAT TO SOMETHING AMAZING</div>
        <h1>Make tonight<br />a <span>movie night.</span></h1>
        <p>Big stories. Comfy seats. Zero hassle.<br className="desktop-break" /> Find your next favourite and book it in a few clicks.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={onExplore}>Explore movies <ArrowRight size={17} /></button>
          <button className="btn-ghost" onClick={() => onMovie(movies[0] || { id: 1, title: 'Dune: Part Two', poster: '', genre: 'Sci-Fi', rating: '8.8', duration: '2h 46m', language: 'English', description: 'A cinematic adventure.' })}><Play size={16} /> How it works</button>
        </div>
        <div className="hero-proof"><div className="proof-avatars"><span>R</span><span>A</span><span>M</span><span>+</span></div><div><strong>Loved by movie people</strong><small>Easy booking. Better weekends.</small></div><div className="proof-rating"><Star size={14} fill="currentColor" /> 4.9</div></div>
      </div>
      <div className="hero-feature-card">
        <div className="feature-image"><img src={movies[0]?.poster} alt="Dune: Part Two movie poster" onError={e => e.currentTarget.style.display='none'} /><span className="feature-tag"><Sparkles size={12} /> EDITOR'S PICK</span></div>
        <div className="feature-info"><div><span className="muted-label">THIS WEEK'S PICK</span><h3>Dune: Part Two</h3><p><Star size={14} fill="currentColor" /> 8.8 <span>·</span> Sci-Fi <span>·</span> 2h 46m</p></div><button className="round-arrow" onClick={() => onMovie(movies[0])}><ArrowRight size={18} /></button></div>
      </div>
      <div className="hero-decoration deco-one"></div><div className="hero-decoration deco-two"></div>
    </section>

    <section className="benefit-strip">
      <div><span className="benefit-icon"><Ticket size={18}/></span><div><strong>Easy booking</strong><small>Your tickets in a few taps</small></div></div>
      <div><span className="benefit-icon"><Armchair size={18}/></span><div><strong>Pick your seat</strong><small>Your spot, your choice</small></div></div>
      <div><span className="benefit-icon"><ShieldCheck size={18}/></span><div><strong>Stress-free plans</strong><small>Clear details, no surprises</small></div></div>
    </section>

    <section className="movie-section" id="movie-list">
      <div className="section-heading"><div><span className="section-kicker">THE BIG SCREEN EDIT</span><h2>Find your <span>next favourite.</span></h2><p>A little something for every kind of movie mood.</p></div><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movies, genres..." aria-label="Search movies"/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15}/></button>}</div></div>
      <div className="category-row">{categories.map(category => <button key={category} className={`category-chip ${activeCategory === category ? 'selected' : ''}`} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
      <div className="movie-grid">
        {movies.map(movie => <MovieCard key={movie.id} movie={movie} onClick={() => onMovie(movie)} />)}
      </div>
      {movies.length === 0 && <div className="empty-state"><Film size={32}/><h3>No movies found</h3><p>Try a different title or category.</p></div>}
      <div className="section-bottom"><span>Showing {movies.length} movies picked for you</span><button className="text-button" onClick={() => { setSearch(''); setActiveCategory('All movies'); }}>Reset filters <RotateCcw size={14}/></button></div>
    </section>

    <section className="cta-banner"><div className="cta-icon"><Popcorn size={27}/></div><div><span className="section-kicker">THE PERFECT PLAN</span><h2>Good films. Great company.</h2><p>Your next favourite memory might just be a movie away.</p></div><button className="btn-light" onClick={onExplore}>Find a movie <ArrowRight size={16}/></button><div className="cta-orb"></div></section>
  </>;
}

function MovieCard({ movie, onClick }) {
  return <article className="movie-card">
    <button className={`poster-wrap poster-${movie.color}`} onClick={onClick} aria-label={`View ${movie.title}`}>
      <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" onError={e => { e.currentTarget.style.display='none'; e.currentTarget.parentElement.classList.add('poster-fallback'); }} />
      <span className="poster-overlay"></span><span className="poster-rating"><Star size={12} fill="currentColor"/> {movie.rating}</span><span className="poster-book">View movie <ArrowRight size={14}/></span>
    </button>
    <div className="movie-card-info"><div className="movie-title-line"><h3>{movie.title}</h3><button className="heart-button" onClick={e => { e.stopPropagation(); e.currentTarget.classList.toggle('hearted'); }} aria-label="Add to favourites"><Heart size={17}/></button></div><p>{movie.genre}</p><div className="movie-meta"><span><Clock3 size={13}/> {movie.duration}</span><span className="language-tag">{movie.language}</span></div><button className="book-small" onClick={onClick}>Book tickets <ArrowRight size={14}/></button></div>
  </article>;
}

function DetailsPage({ movie, onBack, onContinue }) {
  return <section className="details-page">
    <button className="back-link" onClick={onBack}>← Back to movies</button>
    <div className="details-hero">
      <div className={`details-poster poster-${movie.color}`}><img src={movie.poster} alt={`${movie.title} poster`} onError={e => e.currentTarget.style.display='none'}/></div>
      <div className="details-copy"><span className="section-kicker">MOVIE SPOTLIGHT</span><h1>{movie.title}</h1><div className="details-rating"><span><Star size={16} fill="currentColor"/> {movie.rating}/10</span><i></i><span>{movie.year}</span><i></i><span>{movie.duration}</span></div><div className="details-tags"><span>{movie.genre}</span><span>{movie.language}</span><span>2D</span></div><p>{movie.description}</p><div className="detail-note"><ShieldCheck size={18}/><span>Choose your show and seats. Your booking summary will be ready before confirmation.</span></div><button className="btn-primary large" onClick={onContinue}>Choose showtime <ArrowRight size={18}/></button></div>
    </div>
    <div className="details-extra"><div><CalendarDays size={19}/><span><strong>Flexible showtimes</strong><small>Pick a date and time that works for you.</small></span></div><div><Armchair size={19}/><span><strong>Your seat, your choice</strong><small>See seat availability before booking.</small></span></div><div><Ticket size={19}/><span><strong>Instant summary</strong><small>Review your booking before confirming.</small></span></div></div>
  </section>;
}


function SeatPage({
  movie,
  availableShows,
  selectedShow,
  setSelectedShow,
  showsLoading,
  showsError,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedSeats,
  toggleSeat,
  onBack,
  onContinue,
}) {


 
  const rows = ['A','B','C','D','E','F'];
  
const [realSeats, setRealSeats] = useState([]);
const [seatsLoading, setSeatsLoading] = useState(false);
const [seatsError, setSeatsError] = useState('');

useEffect(() => {
  if (!selectedShow?._id) {
    setRealSeats([]);
    return;
  }

  const fetchSeats = async () => {
    setSeatsLoading(true);
    setSeatsError('');

    try {
      const response = await fetch(
        `http://localhost:5000/api/shows/${selectedShow._id}/seats`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch seats');
      }

      const data = await response.json();
      setRealSeats(data.seats || []);
    } catch (error) {
      console.error('Seat API error:', error);
      setSeatsError('Unable to load seat availability.');
    } finally {
      setSeatsLoading(false);
    }
  };

  fetchSeats();
}, [selectedShow?._id]);

  const times = availableShows
  .filter((show) => String(show.movie?._id || show.movie) === String(movie.id || movie._id))
  .map((show) =>
    new Date(show.startsAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );
  const unavailable = realSeats
  .filter((seat) => seat.status === 'booked')
  .map((seat) => seat.code);
  const total = selectedSeats.length * (selectedShow?.pricePerSeat ?? 220);
  return <section className="seat-page">
    <button className="back-link" onClick={onBack}>← Back to movie details</button>
    <div className="booking-header"><div><span className="section-kicker">MAKE IT A MOVIE NIGHT</span><h1>Choose your <span>seats.</span></h1><p>{movie.title} <span>·</span> <MapPin size={14}/> CineMax, {selectedDate.month === 'OCT' ? 'Bhopal' : 'Bhopal'}</p></div><div className="booking-step"><span className="step-done"><Check size={13}/></span><span className="step-active">2</span><span className="step-label">Select seats</span></div></div>
    <div className="booking-layout">
      <div className="seat-main-card">
        <div className="date-select"><h3><CalendarDays size={17}/> Select a date</h3><div className="date-options">{showDates.map(date => <button key={date.date} className={`date-option ${selectedDate.date === date.date ? 'active' : ''}`} onClick={() => setSelectedDate(date)}><small>{date.label}</small><strong>{date.date}</strong><small>{date.month}</small></button>)}</div></div>
        <div className="time-select"><h3><Clock3 size={17}/> Choose a showtime</h3><div className="time-options">{times.map(time => <button key={time} className={`time-option ${selectedTime === time ? 'active' : ''}`} onClick={() => setSelectedTime(time)}>{time}</button>)}</div></div>
        <div className="seat-map-area"><div className="seat-map-heading"><h3><Armchair size={17}/> Select your seats</h3><span>Up to 8 seats per booking</span></div><div className="screen-wrap"><div className="screen-curve"></div><span>SCREEN THIS WAY</span></div>
          <div className="seat-grid">{rows.map(row => <div className="seat-row" key={row}><span className="row-label">{row}</span>{Array.from({length: 8}, (_, i) => { const seat = `${row}${i+1}`; const isUnavailable =
  seatsLoading || seatsError || unavailable.includes(seat); const isSelected = selectedSeats.includes(seat); return <React.Fragment key={seat}>{i === 4 && <span className="aisle"></span>}<button title={isUnavailable ? 'Already booked' : `Seat ${seat}`} aria-label={`Seat ${seat}${isUnavailable ? ', unavailable' : ''}`} disabled={isUnavailable} onClick={() => toggleSeat(seat)} className={`seat ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'chosen' : ''}`}>{isSelected ? <Check size={11}/> : ''}</button></React.Fragment>; })}<span className="row-label">{row}</span></div>)}</div>
          <div className="seat-legend"><span><i className="legend-seat available"></i> Available</span><span><i className="legend-seat chosen"></i> Selected</span><span><i className="legend-seat unavailable"></i> Booked</span></div>
        </div>
      </div>
      <aside className="order-summary"><span className="section-kicker">YOUR ORDER</span><h3>Booking summary</h3><div className="summary-movie"><img src={movie.poster} alt="" onError={e => e.currentTarget.style.display='none'}/><div><strong>{movie.title}</strong><span>{movie.language} · {movie.duration}</span><small><MapPin size={12}/> CineMax, Bhopal</small></div></div><div className="summary-row"><span><CalendarDays size={14}/> {selectedDate.date} {selectedDate.month} 2026</span><strong>{selectedTime}</strong></div><div className="summary-seats"><span>Selected seats</span><div>{selectedSeats.length ? selectedSeats.sort().join(', ') : 'Choose seats to continue'}</div></div><div className="summary-price"><span>Tickets ({selectedSeats.length})</span><strong>₹{selectedSeats.length * 220}</strong></div><div className="summary-price"><span>Convenience fee</span><strong>₹{selectedSeats.length ? 20 : 0}</strong></div><div className="summary-total"><span>Total amount</span><strong>₹{total + (selectedSeats.length ? 20 : 0)}</strong></div><button className="btn-primary full" onClick={onContinue}>Continue <ArrowRight size={16}/></button><p className="summary-footnote"><ShieldCheck size={13}/> Review your details before confirming.</p></aside>
    </div>
  </section>;
}

function ConfirmationPage({ booking, onHome, onBookings }) {
  if (!booking) return <div className="empty-page"><Ticket size={38}/><h2>No booking found</h2><button className="btn-primary" onClick={onHome}>Explore movies</button></div>;
  return <section className="confirmation-page"><div className="success-icon"><Check size={32}/></div><span className="section-kicker">IT'S OFFICIALLY A MOVIE NIGHT</span><h1>You're all <span>booked.</span></h1><p className="confirm-subtitle">Your movie plan is in place. Grab your popcorn!</p><div className="ticket-card"><div className="ticket-main"><img src={booking.poster} alt="" onError={e => e.currentTarget.style.display='none'}/><div className="ticket-movie-info"><span className="confirmed-label"><Check size={12}/> BOOKING CONFIRMED</span><h2>{booking.movie}</h2><p><CalendarDays size={14}/> {booking.date} <span>·</span> <Clock3 size={14}/> {booking.time}</p><p><MapPin size={14}/> CineMax, Bhopal</p></div></div><div className="ticket-divider"><span></span><span></span></div><div className="ticket-bottom"><div><small>BOOKING ID</small><strong>{booking.id}</strong></div><div><small>SEATS</small><strong>{booking.seats.join(', ')}</strong></div><div><small>TOTAL PAID (DEMO)</small><strong>₹{booking.total + 20}</strong></div></div><div className="demo-notice">Demo checkout only — no real payment was processed.</div></div><div className="confirmation-actions"><button className="btn-primary" onClick={onBookings}>View my bookings <ArrowRight size={16}/></button><button className="btn-outline" onClick={onHome}>Back to home</button></div></section>;
}

function BookingsPage({ bookings, user, onSignIn, onExplore }) {
  return <section className="bookings-page"><span className="section-kicker">YOUR MOVIE DIARY</span><h1>My <span>bookings.</span></h1><p className="bookings-intro">All your upcoming movie plans, in one place.</p>{!user ? <div className="empty-state booking-empty"><div className="empty-icon"><UserRound size={25}/></div><h3>Sign in to see your movie plans</h3><p>Your bookings will be collected here so you can find them whenever you need.</p><button className="btn-primary" onClick={onSignIn}>Sign in <ArrowRight size={16}/></button></div> : bookings.length === 0 ? <div className="empty-state booking-empty"><div className="empty-icon"><Ticket size={25}/></div><h3>Your next movie night starts here</h3><p>You haven't made a booking in this demo yet. Find a film and pick your seats.</p><button className="btn-primary" onClick={onExplore}>Explore movies <ArrowRight size={16}/></button></div> : <div className="booking-list">{bookings.map(booking => <article className="booking-list-card" key={booking.id}><img src={booking.poster} alt="" onError={e => e.currentTarget.style.display='none'}/><div className="booking-list-info"><span className="confirmed-label"><Check size={12}/> {booking.status}</span><h3>{booking.movie}</h3><p><CalendarDays size={14}/> {booking.date} <span>·</span> <Clock3 size={14}/> {booking.time}</p><p><Armchair size={14}/> Seats: {booking.seats.join(', ')}</p><small>Booking ID: {booking.id}</small></div><div className="booking-list-total"><small>TOTAL</small><strong>₹{booking.total + 20}</strong></div></article>)}</div>}</section>;
}


function LoginModal({ onClose, onSubmit, onSignup }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSignup) {
      onSignup({ name, email, password });
    } else {
      onSubmit(event);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="login-modal">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={19} />
        </button>

        <div className="modal-logo">
          <Clapperboard size={23} />
        </div>

        <span className="section-kicker">WELCOME TO IMOVIES</span>

        <h2>
          {isSignup ? 'Create your ' : "Let's get you "}
          <span>{isSignup ? 'account.' : 'in.'}</span>
        </h2>

        <p>
          {isSignup
            ? 'Create an account to save your movie plans and manage bookings.'
            : 'Sign in to save your movie plans and manage your bookings.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={
              isSignup ? 'At least 8 characters' : 'Enter your password'
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={isSignup ? 8 : 1}
            required
          />

          <button className="btn-primary full" type="submit">
            {isSignup ? 'Create account' : 'Sign in'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="demo-hint">
          <ShieldCheck size={14} />
          Your account is managed securely by IMovies.
        </div>

        <p className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}



function Footer({ onHome }) {
  return <footer className="footer"><div className="footer-top"><button className="brand footer-brand" onClick={onHome}><span className="brand-mark"><Clapperboard size={21}/></span><span className="brand-name">i<span>movies</span><small>YOUR MOVIE NIGHT, MADE EASY</small></span></button><p>Life's better with a good story.</p><div className="footer-socials"><span>in</span><span>ig</span><span>▶</span></div></div><div className="footer-bottom"><span>© 2026 IMovies. Made for movie lovers.</span><span>Frontend demo · Sample movie data</span><div><span>Made with</span> <Heart size={12} fill="currentColor"/> <span>and popcorn</span></div></div></footer>;
}

export default App;
