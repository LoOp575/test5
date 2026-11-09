# Deployment

- Vercel: hubungkan repo, set env `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN`.
- `vercel.json` membatasi Functions maxDuration 10s — jangan render panjang di Functions.
- Render worker: jalankan terpisah `npm run dev --workspace=workers/render-worker` di VM/Container dengan sandbox allowlist.
- Monitoring: Supabase pg_stat + Vercel logs; checkpoint di workflow_runs.
