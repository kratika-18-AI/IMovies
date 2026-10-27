# IMovies Frontend

A responsive React + Vite frontend for the SkillWallet “IMovies – Movie ticket booking made simple” project.

## Features in this frontend demo
- Responsive movie discovery page with search and category filters
- Movie detail view
- Date and showtime selection
- Interactive seat map with sample unavailable seats
- Booking summary and demo confirmation
- Demo sign-in modal
- My Bookings view
- Responsive layout for desktop and mobile

## Run locally
Requirements: Node.js 18+ (Node.js 20+ recommended).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Production build
```bash
npm run build
npm run preview
```

## Important limitations
This is a **frontend prototype**, not a production booking system. Movie details and unavailable seats are sample data. Sign-in is simulated in browser state; no account or password is sent to a server. Bookings are kept in React state and will reset when the page is refreshed. No real payment is processed.

For the complete MERN project, connect the UI to an Express API and MongoDB, implement server-side JWT authentication, and enforce atomic seat reservations on the backend. Do not treat frontend seat states as secure availability checks.
