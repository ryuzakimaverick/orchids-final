# Orchids Final

A full-stack starter that pairs a Next.js API (custom Node server), Vite + React frontend served by Nginx, and Postgres. Everything is containerized for Docker Desktop on macOS (including Apple Silicon) and deploys cleanly to Railway.

## Project layout

```
├── .dockerignore
├── .env / .env.example
├── Dockerfile.api          # Next.js backend
├── Dockerfile.frontend     # Vite + Nginx frontend
├── docker-compose.yml
├── server.js               # Custom Next.js entrypoint (PORT=8080)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/                    # Backend utilities (auth, Stripe, Prisma)
├── pages/api/              # Next.js API routes
├── src/                    # Vite React client
├── vite.config.ts
└── README.md
```

## Environment variables

Copy `.env.example` to `.env` and adjust the values as needed. At minimum:

- `PORT` - Next.js server port (default `8080`).
- `DATABASE_URL` - Prisma/Postgres connection string (defaults to `postgresql://postgres:postgres@orchids-db:5432/railway`).
- `NEXT_PUBLIC_API_URL` / `VITE_API_URL` - Public URL the browser uses to reach the API (defaults to `http://localhost:8080`).
- `NEXTAUTH_SECRET` - Secret for NextAuth or any auth utilities.
- `STRIPE_*` - Stripe keys used in `lib/stripe.ts` (replace with your own credentials).

## Running locally with Docker

1. Ensure Docker Desktop is running.
2. Build and start services:
   ```bash
   docker compose build
   docker compose up -d
   ```
3. Access the stack:
   - Frontend: http://localhost
   - API: http://localhost:8080/api/posts
   - Postgres: localhost:5433 (user `postgres`, password `postgres`, database `railway`)
4. Tail logs (optional):
   ```bash
   docker compose logs -f
   ```

All services include `restart: always` and healthchecks. The frontend waits for the API, which waits for the database to be healthy before booting.

## Prisma workflow

Run commands inside the `orchids-api` container or locally with Node installed:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

The seed script populates the `Post` table so `/api/posts` returns data out of the box.

## Railway deployment

1. Push this repository to Git.
2. Create a new Railway project and add **PostgreSQL** and **Service** plugins.
3. Deploy the API service from `Dockerfile.api` and the frontend from `Dockerfile.frontend`, or use Compose support.
4. Set the environment variables from `.env.example` in Railway (remember to point `NEXT_PUBLIC_API_URL` to your Railway domain).
5. Provision a Postgres database and copy its connection string into `DATABASE_URL`.
6. Run migrations and seed (e.g., `railway run npm run prisma:migrate -- --name init` followed by `railway run npm run prisma:seed`).

## Custom server

`server.js` boots Next.js on port `8080` and logs `Server running at port 8080` when healthy. The API route at `/api/posts` queries Prisma and falls back to dummy JSON if the database is unavailable, keeping the service resilient during cold starts.
