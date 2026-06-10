# Relationship OS

**Never lose touch with the people who matter.**

Relationship OS is a personal CRM designed for individuals who want to intentionally nurture their relationships. It uses an event-driven approach combined with a hybrid formula (recency × frequency × variety × intensity) to help you understand and improve your relationship health scores.

> **Live Demo:** [https://relationship-os.vercel.app](https://relationship-os.vercel.app)
>
> The demo runs in **Demo Mode** with mock data. To use with real data, connect a Supabase PostgreSQL database.

---

## Features

### Core Features

- **Relationship Tracking** - Keep track of everyone important in your life
- **Interaction Logging** - Record coffee chats, calls, meals, gifts and more
- **Health Score** - See at a glance how your relationships are doing
- **Promise Reminders** - Never forget a commitment to someone
- **Personal Notes** - Remember the little things that make relationships special

### Scoring System

The relationship health score uses a hybrid formula:

```
Score = (Recency Factor) × (Frequency Weight) × (Variety Bonus) × (Intensity Factor)
```

- **Recency** - How recently you interacted (exponential decay)
- **Frequency** - How often you connect (weighted by relationship type)
- **Variety** - Diversity of interaction types (gifts, calls, meals, etc.)
- **Intensity** - Quality rating (1-5 stars) of each interaction

### Status Categories

- **Growing** (green) - Score ≥ 70, strong healthy relationship
- **Stable** (blue) - Score 50-69, relationship is maintained
- **Fading** (amber) - Score 25-49, needs attention
- **Lost Contact** (gray) - Score < 25, relationship has gone cold

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **State** | React Query (TanStack Query) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later
- **npm** or **pnpm**
- A **Supabase** account (free tier is sufficient)
- A **Vercel** account (free tier is sufficient)

---

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/relationship-os.git
cd relationship-os
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following variables:

```env
# Database (Supabase PostgreSQL)
# Leave empty to run in Demo Mode with mock data
DATABASE_URL=

# Optional: Supabase anon key for future auth
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> **Note:** If `DATABASE_URL` is empty or undefined, the app runs in **Demo Mode** with pre-populated mock data. This is perfect for testing without setting up a database.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Database Setup (Supabase)

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Enter project details:
   - **Name:** `relationship-os`
   - **Database Password:** (generate a strong password and save it!)
   - **Region:** Choose closest to your users
4. Click **Create new project**
5. Wait for the project to be provisioned (~2 minutes)

### Step 2: Get Your Connection Strings

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. You'll see two connection strings:

#### For the Application (Transaction Pooler)
Use this for `DATABASE_URL` in your app:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

#### For Migrations (Direct Connection)
Use this for `DIRECT_URL` in your app (required for Prisma migrations):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

> **Important:** Supabase uses PgBouncer for connection pooling. The transaction-mode pooler (port 6543) is optimized for apps, while the direct connection (port 5432) is required for Prisma migrations to avoid connection pool conflicts.

### Step 3: Update Environment Variables

Add both connection strings to your `.env.local`:

```env
# App connection (with PgBouncer pooler)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

### Step 4: Configure Prisma for Supabase

Prisma needs to use the direct connection for schema changes. Update your `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Step 5: Push Database Schema

```bash
npm run db:push
```

This creates all the tables and indexes defined in `prisma/schema.prisma`.

### Step 6: Seed the Database (Optional)

```bash
npm run db:seed
```

This creates a demo user and sample data for testing.

---

## Vercel Deployment

### Option A: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No**
- Project name? **relationship-os**
- Directory? **./** (current directory)
- Override settings? **No**

### Option B: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [https://vercel.com](https://vercel.com)
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** Leave as default
6. Click **Deploy**

### Option C: Deploy via Vercel Dashboard (Drag & Drop)

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Scroll down and click **Or drag a folder here**
4. Drag your project folder
5. Wait for deployment

### Setting Environment Variables on Vercel

1. After deployment, go to your project dashboard
2. Click **Settings** tab
3. Click **Environment Variables**
4. Add each variable:

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres` | Production, Preview, Development |

5. Click **Save**
6. Go to **Deployments**
7. Click the three dots (⋮) on the latest deployment
8. Click **Redeploy**

> **Important:** After adding environment variables, you must redeploy for changes to take effect.

---

## Project Structure

```
relationship-os/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── demo/          # Demo mode API
│   │   │   ├── interactions/  # Interactions CRUD
│   │   │   ├── people/         # People CRUD
│   │   │   └── promises/       # Promises CRUD
│   │   ├── people/
│   │   │   ├── page.tsx       # People directory
│   │   │   └── [id]/page.tsx  # Person detail
│   │   ├── promises/page.tsx   # Promises page
│   │   ├── quick-add/page.tsx  # Quick add modal
│   │   ├── settings/page.tsx   # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard
│   ├── components/
│   │   ├── AddPersonModal.tsx
│   │   ├── AddPromiseModal.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EditPersonModal.tsx
│   │   ├── PersonCard.tsx
│   │   ├── QuickAddModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StarRating.tsx
│   │   └── Toast.tsx
│   └── lib/
│       ├── demo.ts            # Demo mode data
│       ├── hooks.ts           # React Query hooks
│       ├── prisma.ts          # Prisma client
│       ├── supabase.ts        # Supabase client
│       └── utils.ts           # Utility functions
├── public/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## API Reference

### People

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/people` | List all people |
| POST | `/api/people` | Create a person |
| GET | `/api/people/[id]` | Get a person |
| PATCH | `/api/people/[id]` | Update a person |
| DELETE | `/api/people/[id]` | Delete a person |
| PATCH | `/api/people/[id]/notes` | Update person's notes |

### Interactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interactions` | List interactions |
| POST | `/api/interactions` | Create an interaction |

### Promises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/promises` | List promises |
| POST | `/api/promises` | Create a promise |
| PATCH | `/api/promises` | Update a promise |
| DELETE | `/api/promises` | Delete a promise |

---

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Linting
npm run lint             # Run ESLint
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase connection string (transaction pooler, port 6543) |
| `DIRECT_URL` | Yes | Supabase direct connection (for Prisma migrations, port 5432) |

> **Note:** Both connection strings are required when using Supabase with connection pooling.

---

## Demo Mode

When `DATABASE_URL` is not set, the app runs in **Demo Mode**:

- Uses pre-populated mock data
- All CRUD operations work with local state
- No data persists between sessions
- Perfect for showcasing the app

---

## Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npm install
npm run postinstall
```

### Database connection errors

1. Verify your `DATABASE_URL` and `DIRECT_URL` are correct
2. Make sure both connection strings are using the correct format:
   - `DATABASE_URL` should end with `?pgbouncer=true` (port 6543)
   - `DIRECT_URL` should NOT have `?pgbouncer=true` (port 5432)
3. Check if your Supabase IP allowlist includes your IP (if configured)
4. Ensure your database password is correct (no special characters that need URL encoding)

### "Error during migration: connection pool exhausted"

This happens when using PgBouncer with Prisma migrations. Always use `DIRECT_URL` (port 5432) for migrations:

```bash
# Set the direct URL for this command
DIRECT_URL="postgresql://..." npm run db:push
```

### Build errors on Vercel

1. Make sure all environment variables are set in Vercel dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
2. Redeploy after adding environment variables
3. Check the build logs for specific errors

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see LICENSE file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The Postgres database platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TanStack Query](https://tanstack.com/query) - Powerful asynchronous state management
- [Lucide](https://lucide.dev/) - Beautiful open source icons
