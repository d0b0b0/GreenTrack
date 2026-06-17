# 🌿 GreenTrack

A web app for tracking and reducing your personal carbon footprint.
Measure CO₂ emissions, keep an activity log, complete eco-challenges,
unlock achievements, compete on the leaderboard, and read the eco-library.

Rewritten from a single static HTML page into a full **React + TypeScript (Vite)**
application with user accounts and a **free cloud database (Supabase)**.

![stack](https://img.shields.io/badge/React-18-149ECA) ![vite](https://img.shields.io/badge/Vite-5-646CFF) ![supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E)

> The product UI is in Ukrainian; this README is in English.

---

## ✨ Features

- 👤 **Accounts** — sign up, sign in, profile, privacy settings.
- 📝 **Activity log** — pick an activity + quantity (km, portion, kWh…) and CO₂ is
  computed automatically from emission factors, with a live preview. One-tap
  presets, manual entry, edit, delete-with-confirmation, search, filters, CSV export.
- 📊 **Dashboard** — monthly CO₂, eco-rating, day streak, goals, animated counters and charts.
- 📈 **Analytics** — 6-month trend, weekday breakdown, per-category split.
- 🧮 **Calculator** — annual footprint estimate compared with the Ukrainian average
  (embedded on the landing page and inside the app).
- 🎯 **Challenges** — eco-tasks with automatic progress tracking.
- 🏅 **Achievements** — badges unlocked through activity and habits, with celebratory pop-ups.
- ⭐ **Levels & points** — 7 growth levels (from Sprout to Forest).
- 🏆 **Community leaderboard** — podium and ranking of users with a public profile.
- 📚 **Eco-library** — articles on transport, food, energy, and conscious consumption.
- 🌙 **Dark theme**, responsive design, smooth animations.
- 🧪 **Demo mode** — works with zero setup (data in `localStorage`); add Supabase keys
  and it automatically switches to the cloud database.

## 🚀 Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 — you can register and use it right away
(in demo mode data is stored in the browser).

### Build

```bash
npm run build      # production build into dist/
npm run preview    # local preview of the build
```

## 🗄️ Connect a real database (free)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor.
3. Copy the `Project URL` and `anon` key into a `.env` file:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Restart `npm run dev`. The yellow "Demo mode" banner disappears.

The schema enables Row Level Security so users can only read/write their own
data; the leaderboard exposes only name, avatar, level, and points (no email).

## ☁️ Deploy

### Vercel (recommended)

1. Push the project to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
   Vercel auto-detects Vite (settings are already in `vercel.json`).
3. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   (Settings → Environment Variables), then **Deploy**.

### GitHub Pages

1. Set the repository base path in `.env` or the build settings:
   ```
   VITE_BASE_PATH=/<repository-name>/
   ```
2. Run `npm run build` and publish the `dist/` folder (e.g. via `gh-pages`
   or GitHub Actions). For SPA routing, duplicate `index.html` as `404.html`.

> For Vercel you do **not** need `VITE_BASE_PATH` (base is `/`).

## 🧩 Tech stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| UI           | React 18 + TypeScript + Vite            |
| Routing      | react-router-dom v6                     |
| Charts       | Recharts                                |
| Styling      | Plain CSS (design system + themes)      |
| DB / Auth    | Supabase (PostgreSQL) or localStorage   |

## 📁 Project structure

```
src/
├── components/      UI components (nav, charts, forms, modals)
│   └── panels/      reusable tab panels (overview, analytics, challenges…)
├── context/         providers: theme, toasts, auth+data, auth modal, confirm
├── data/            data layer: local (localStorage) / remote (Supabase)
├── lib/             logic: CO₂ math, emission factors, challenges, achievements, levels, tips
├── pages/           pages (landing, dashboard, activities, community, profile…)
└── styles/          design system (tokens, components, layout, pages)
supabase/schema.sql  SQL schema to create the database
```

## 👥 Team

Student project · NUBiP of Ukraine — Danil Shevchenko, Nazar Vozniuk.

Made with 💚 for a greener future.
