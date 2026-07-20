# Vision Giants / DevInt — Setup Guide

Full-stack app: React customer site (`frontend`), React + TypeScript admin panel (`admin-panel`), and an Express/Prisma backend (`backend`), all run together via Docker.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Node.js (only needed if you want to run individual apps outside Docker for development)
- Git

## First-time setup

1. **Clone the repo and pull the latest changes**
   ```powershell
   git pull
   ```

2. **Get `backend/.env` from a teammate**
   This file is not committed to git (it contains secrets). Ask a teammate to share it with you directly — do not post it in a public channel. It should contain:
   - `DATABASE_URL` / `DIRECT_URL` (Supabase Postgres connection strings)
   - `JWT_SECRET` / `JWT_REFRESH_SECRET`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
   - `CORS_ORIGINS=http://localhost,http://localhost:8080`

   Place it at `backend/.env`.

3. **Check for port conflicts**
   If you have XAMPP, WAMP, IIS, or anything else already using port 80, our site runs on **8080** instead (see `docker-compose.yml`) to avoid clashing. No action needed unless port 8080 or 5000 are also already in use on your machine — if so, change the `ports:` mapping in `docker-compose.yml` and update the URLs below accordingly.

## Running everything

From the repo root:

```powershell
npm run up
```

This starts the backend and the combined frontend+admin site, shows their status, and prints:

- **Site:** http://localhost:8080
- **Admin:** http://localhost:8080/admin
- **API:** http://localhost:5000/api/v1

To stop everything:

```powershell
npm run down
```

## Useful commands

| Command | What it does |
|---|---|
| `npm run up` | Start backend + site (Docker) and print URLs |
| `npm run down` | Stop all containers |
| `docker compose ps` | Check container status |
| `docker compose logs -f` | Follow logs from all containers live |
| `docker compose logs backend --tail 50` | Recent backend logs only |
| `docker compose restart backend` | Restart just the backend (e.g. after an `.env` change) |
| `docker compose up -d --build` | Rebuild images and restart (needed after **code** changes) |

## Important: rebuilding after changes

Docker containers run a **built** copy of the code, not live files. Editing source files won't update the running containers automatically.

- **Backend code changed** → `docker compose up -d --build backend`
- **Frontend or admin-panel code changed** → `docker compose up -d --build web`
- **`.env` changed** (no code changes) → `docker compose restart backend` is enough

If you're actively developing the admin panel or frontend day-to-day and want hot reload, run them locally instead of through Docker:

```powershell
npm run dev:site    # frontend, local dev server
npm run dev:admin   # admin panel, local dev server
```

(Only use Docker for the backend in that case, or run `npm run up` occasionally to sanity-check the full production-style build.)

## Troubleshooting

**"Not Found" / Apache page instead of the site**
You're hitting port 80, which something else (like XAMPP) is using. Use `http://localhost:8080` instead.

**Admin login fails with a network error**
Usually a CORS mismatch. Confirm `backend/.env` has `CORS_ORIGINS=http://localhost,http://localhost:8080`, then `docker compose restart backend`.

**Backend keeps restarting / crash-looping**
Check the logs for the real error:
```powershell
docker compose logs backend --tail 50
```
Common causes: a typo'd import path with wrong file casing (Windows ignores case, Linux containers don't), a paused Supabase database, or a missing `.env` value.

**`getaddrinfo EAI_AGAIN` / DNS errors reaching the database**
Docker Desktop's DNS forwarding can occasionally fail on Windows. This is already worked around via explicit `dns:` entries in `docker-compose.yml`. If it recurs:
```powershell
docker compose down
docker compose up -d
```

**Database connection errors mentioning the Supabase pooler**
Check the [Supabase dashboard](https://supabase.com/dashboard) — free-tier projects auto-pause after inactivity. Resume it there if paused.

## Project structure

```
softwarefrontend/
├── package.json           # root-level scripts (npm run up / down)
├── docker-compose.yml
├── frontend.Dockerfile     # builds frontend + admin-panel together
├── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── .env                # not committed — get from a teammate
│   └── ...
├── frontend/                # customer-facing site (Vite + React)
├── admin-panel/               # admin dashboard (Vite + React + TS), builds into frontend/dist/admin
└── shared/
```