# Bound

A community-driven, privacy-first platform for the BDSM/kink community — profiles, posts, groups, events, direct messages, moderation, polls, karma, and notifications.

## Stack

- **Frontend**: SvelteKit (Svelte 5) — [`frontend/`](frontend)
- **Backend**: Express + Sequelize + PostgreSQL, JWT/bcrypt auth, Socket.io for realtime, web-push for notifications — [`server/`](server)

Earlier prototypes (Next.js API routes, a NestJS backend, a separate client) were consolidated into the two directories above; the dead code is kept in [`_archive/`](_archive) for reference only and isn't wired up to anything.

## Running locally

1. **Database** — start Postgres via Docker:
   ```bash
   docker compose -f docker-compose.dev.yml up -d db
   ```
   (There's no `Dockerfile` for `server/` or `frontend/` yet, so only the `db` service can be run through Compose — run the app processes natively as below.)

2. **Environment** — copy `.env.example` to `server/.env` and fill in real values (see that file for `DATABASE_URL`, `JWT_SECRET`, and VAPID keys for web push).

3. **Backend**:
   ```bash
   cd server
   npm install
   npx sequelize-cli db:migrate
   npm run dev
   ```
   Runs on `http://localhost:3000`.

4. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Runs on `http://localhost:5173`.

## Current status

The backend's database layer (migrations + models) was recently consolidated after accumulating duplicate/conflicting Sequelize migrations and a split between two model directories. All migrations now run cleanly against a fresh Postgres database, and the register/login/protected-route auth flow is verified working end-to-end. Frontend routes for groups, events, messages, and profile detail pages are still stubs pending full API wiring.
