# English Loop

**Watch. Listen. Read. Speak. Grow.**

English Loop is an Input-Based & Output-Based English Learning web application designed as a teaching innovation portfolio by **Yusril Maulana**.

## MVP

- Student and teacher demo mode
- Supabase email/password authentication (username is mapped to `username@englishloop.local`)
- Student dashboard, content library, comprehension checks, browser speaking recorder, reflection, submission, vocabulary, and progress
- Teacher dashboard, students, content/activity builder, class assignment, speaking submissions, private audio playback, feedback, and class progress
- Private Supabase Storage bucket for speaking audio
- RLS-protected Postgres data model
- Responsive student mobile navigation and teacher desktop/mobile workspace

## Stack

- Next.js 16
- React 19
- Supabase Auth, Postgres, Storage, RLS
- Vercel

## Environment

Copy `.env.example` to `.env.local` and provide:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Only the publishable Supabase key is used in the browser. Authorization is enforced in Postgres/Storage RLS.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
