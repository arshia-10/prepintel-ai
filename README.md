# PrepIntel AI

**Prepare for the company. Not just the interview.** PrepIntel turns campus interview experiences into company- and role-aware preparation. Historical reports are signals for practice, never guarantees about future questions. Every seeded experience and question is explicitly labeled **DEMO HISTORICAL DATA** and is fabricated for the product demo.

## Features

- Landing page and authenticated student dashboard.
- Company intelligence: college and role filters, round breakdown, topic frequency, difficulty distribution, recurring patterns, historical questions, preparation priorities, and an AI-generated recommendation.
- Searchable question bank and new AI-generated Easy/Medium/Hard variations.
- Seven-day personalized preparation plans with persisted task completion when signed in with PostgreSQL enabled.
- Adaptive mock interviews with scored answer feedback.
- Authenticated, review-pending experience submissions and an admin review queue with approve/reject actions.
- Prisma/PostgreSQL persistence with a graceful in-memory demonstration adapter when no database is configured or reachable.
- Optional OpenAI provider, Zod response validation, deterministic mock provider, and AI route rate limiting.

## Architecture

- `client/`: React, Vite, TypeScript, React Router, Recharts, Lucide icons, responsive UI.
- `server/`: Express REST API, Prisma persistence adapter, bcrypt password hashing, JWT authentication, Zod validation, rate limits, OpenAI/mock AI service abstraction.
- `prisma/schema.prisma`: PostgreSQL models for users, companies, roles, interview experiences, questions, attempts, preparation plans/tasks, and mock interviews/questions.
- `prisma/seed.ts` equivalent: `server/src/seed.ts` loads labeled demonstration data and a demo admin account.

## Requirements

Node.js 20+, npm, and PostgreSQL for durable storage. Without PostgreSQL, the app starts with an in-memory demo adapter; accounts and user activity reset when the server restarts.

## Setup

1. Create a PostgreSQL database named `prepintel` (or use your own connection string).
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, a private random `JWT_SECRET`, and `DEMO_ADMIN_PASSWORD` (at least 12 characters) before seeding. Add `OPENAI_API_KEY` only if you want the optional OpenAI provider.
3. Install and generate Prisma Client, validate the schema, migrate, and load demo records:

```powershell
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate -- --name init
npm run seed
```

4. Start the application:

```powershell
npm run dev
```

Client: `http://localhost:5173`  
API health: `http://localhost:4000/api/health`

If PostgreSQL is unavailable, `npm run dev` still starts using the demo fallback. Migrations and seeding require a reachable PostgreSQL server.

## Environment variables

- `DATABASE_URL`: PostgreSQL URL, e.g. `postgresql://postgres:password@localhost:5432/prepintel?schema=public`.
- `JWT_SECRET`: long random secret for signed sessions. Required to start the API in every environment.
- `OPENAI_API_KEY`: optional backend-only key. It is never sent to the client.
- `OPENAI_MODEL`: optional model override (defaults to `gpt-4o-mini`).
- `OPENAI_BASE_URL`: optional compatible Chat Completions endpoint override.
- `PORT`: API port, default `4000`.
- `CLIENT_ORIGIN`: comma-separated allowed browser origins; defaults to open CORS for local demo use.
- `DEMO_ADMIN_PASSWORD`: required private password for the seeded admin account; use at least 12 characters. The example file intentionally leaves it blank.

## Database and demo content

`npm run prisma:generate` creates the Prisma Client. `npm run prisma:validate` checks the schema. `npm run prisma:migrate -- --name init` creates/applies the development migration. For production, use `npm run prisma:deploy` after committing reviewed migrations. `npm run seed` idempotently refreshes generated demonstration experiences/questions without deleting community submissions and creates the demo admin account.

After seeding, the demo admin account is:

- Email: `demo@prepintel.ai`
- Password: the private value you set as `DEMO_ADMIN_PASSWORD` in your local `.env`.

The seed creates 280 question/experience records across all seven companies, all four roles, and all five colleges, with two sample patterns per company/role/college. Seed rows are marked `DEMO_HISTORICAL_DATA`, and descriptions explain they are fabricated examples. They must not be described as verified employer questions.

## AI provider

With `OPENAI_API_KEY`, the backend calls OpenAI using `OPENAI_MODEL`, a bounded request timeout, OpenAI Structured Outputs (`json_schema`), and Zod validation for all five flows: question variations, experience analysis, preparation plans, mock evaluation, and adaptive question generation. Network errors, timeouts, non-JSON responses, or schema-invalid output fall back to deterministic mock results. With no key, the same mock service is used directly. No provider key is included in client bundles or API payloads.

## Useful commands

- `npm run dev`: client and API.
- `npm run build`: TypeScript checks and production client build.
- `npm run seed`: seed labeled demo data (PostgreSQL required).
- `npm run prisma:generate`: generate Prisma Client.
- `npm run prisma:validate`: validate schema.
- `npm run prisma:migrate -- --name init`: development migration.
- `npm run prisma:deploy`: apply committed migrations in deployment.

## Hackathon demo flow

1. Open `/` and introduce the company-specific preparation idea.
2. Click **Explore Companies**, select Deloitte, Software Engineer, and Chitkara University.
3. Walk through reported topics, interview rounds, difficulty distribution, patterns, and source-labeled demo questions.
4. Generate similar questions and show the AI-generated label.
5. Generate the seven-day plan and mark a task complete.
6. Start the AI mock, answer the prompt, and show the score and feedback.
7. Sign in and submit an interview experience; it is marked pending review before becoming visible.

## Security and Git hygiene

`.env`, `.env.*`, `node_modules`, build output, logs, and local npm cache are ignored. Passwords are bcrypt-hashed. JWTs have expiry, issuer, and audience checks. Admin write routes check the database `isAdmin` field. AI endpoints are rate limited and the OpenAI key stays server-side.


