# Kingdom of Chess — Frontend

A modern Next.js App Router frontend for the supplied NestJS API. Uses TanStack Query for API state, Socket.IO for live chess updates, and `chess.js` for local move previews/board interactions.

## Run locally

1. Start the NestJS backend and PostgreSQL database using your existing backend setup. The API defaults to `http://localhost:3001`.
2. Copy `.env.example` to `.env.local` (change `NEXT_PUBLIC_API_URL` if needed).
3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Included screens

- Landing page
- Register (backend currently registers new accounts as `student`)
- Login and cookie-based session check/logout
- Role-aware student and coach dashboards
- Coach tournament creation and status updates
- Student tournament browser, join, and find-opponent queue
- Live chess board with authenticated Socket.IO events, move sync, PGN, and game-over state
- Profile screen
- API-backed loading, empty and error states

## API contract used

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login` (sets HttpOnly `access_token` cookie)
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/tournaments`
- `GET /api/v1/tournaments/:id`
- `POST /api/v1/tournaments` (coach)
- `PATCH /api/v1/tournaments/:id/status` (coach)
- `POST /api/v1/tournaments/:id/join` (student)
- `POST /api/v1/tournaments/:id/find-opponent` (student)
- Socket.IO events: `join_match`, `match_state`, `make_move`, `move_made`, `game_over`

## Important backend gaps

The supplied API source does not expose endpoints for match history, leaderboard/statistics, resignation, draw offers/acceptance, or clock/timeout results. The UI avoids pretending those are API-backed: leaderboard/history links show a clear API-not-yet-available notice, and live game controls are limited to events supported by the current gateway. The current socket gateway does not send a server clock. These features need backend endpoints/events before they can be completed end-to-end.

## Notes

- API requests use `credentials: 'include'`; the frontend never reads the HttpOnly token.
- The socket connection uses browser cookies for authentication, matching the backend gateway.
- Your backend CORS and Socket.IO origin currently allow `http://localhost:3000`.
- No demo credentials are assumed; create a student via Register. Coach access requires a coach account created/seeded by your backend.
