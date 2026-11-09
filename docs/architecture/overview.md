# Arsitektur PVC Virtual Company

## Diagram Lapisan (Blueprint §6)

```
[ Next.js Dashboard + Campus 2D ]  ← pengguna klik gedung/avatar → data nyata (9.1)
         ↕
[ Vercel API Routes / Control Plane ] — auth, validasi Zod, CRUD, start workflow
         ↕
[ LangGraph.js + Agent Loop ] — StateGraph: Intake→Planner→Router→DeptExecutor(parallel)→Merge→QA→ApprovalGate→Delivery, checkpoint/resume
         ↕
[ Model Router free-only ] — Gemini/Groq/OpenRouter gratis; cek tool-calling, context, quota; NO fallback berbayar diam-diam
         ↕
[ Supabase Postgres + Storage + RLS ] — companies (root), departments, agents, projects, tasks, artifacts, workflow_runs, approvals, audit_logs
         ↕
[ Worker Terisolasi ] — build/test/render panjang (bukan Vercel Functions)
         ↕
[ GitHub API ] — read-only awal; write hanya di branch sandbox; merge/deploy butuh approval RED
```

## Prinsip

- Satu `company_id` sebagai akar semua data.
- Setiap task punya status, owner, level (GREEN/YELLOW/RED), checkpoint.
- Visual bermakna: lampu gedung & avatar = agregasi status backend, bukan animasi palsu.
- Keamanan: RLS, RBAC, sandbox, audit, budget cap.

Lihat `database/migrations/001_initial.sql` untuk ERD lengkap.
