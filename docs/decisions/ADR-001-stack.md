# ADR-001 — Stack Keputusan

- Frontend: Next.js 14 + TypeScript + Tailwind + Framer Motion — SSR + image optimization, campus SVG hotspot.
- Orchestration: LangGraph.js — checkpoint/resume lebih matang daripada custom queue.
- Model Router: adapter free-only — hindari Vercel AI SDK lock-in, kontrol quota manual.
- DB: Supabase Postgres — RLS + Storage + Realtime dalam satu.
- Worker: Node isolasi — Vercel Functions timeout 10s tidak cocok untuk render.
