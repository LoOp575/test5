# Runbook — Local Dev

1. `npm install` (root & apps/web)
2. Copy `.env.example` → `.env.local` → isi Supabase keys.
3. `npm run db:migrate` — jalankan 001_initial.sql & 002_rls_policies.sql (butuh SUPABASE_DB_URL).
4. `npm run db:seed` — seed 1 company PVC, 5 departments, 10 agents, 2 proyek demo.
5. `npm run dev` — buka http://localhost:3000 → klik gedung di kampus untuk melihat divisi & agent.

Tanpa Supabase: app tetap jalan dengan mockData (fallback).
