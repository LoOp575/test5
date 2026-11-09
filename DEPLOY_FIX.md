# Deploy Fix — 2026-11-09 14:32

**Error Vercel:**
```
Error: [unused_function] The pattern "apps/web/app/api/**/*.ts" defined in `functions` doesn't match any Serverless Functions.
```

**Penyebab:** `vercel.json` lama punya key `functions.apps/web/app/api/**/*.ts` — pola ini untuk Vercel Serverless Functions standalone (`/api/*.ts` di root), **bukan** untuk Next.js App Router (`app/api/route.ts`). Vercel Next.js otomatis deteksi API routes, jadi key itu bikin build gagal.

**Fix (commit ini):**
```json
{
  "framework": "nextjs",
  "installCommand": "npm install",
  "buildCommand": "npm run build --workspace=apps/web"
}
```
- Hapus `functions` + `outputDirectory` + `crons` — Next.js plugin yang urus.
- Tambah `turbo` ke `devDependencies` biar `npm run build` (turbo) tidak "turbo: not found" kalau dipakai.

**Opsi Vercel Dashboard (recommended untuk monorepo):**
1. Vercel → Project → Settings → General → **Root Directory** = `apps/web` → Save
2. Lalu buildCommand otomatis jadi `npm run build` (Vercel detect Next.js di apps/web)
3. Verifikasi: Framework Preset = Next.js, Node 18.x

Jika Root Directory tetap di repo root (default), vercel.json baru di atas sudah cukup.

Test lokal:
```
npm install
npm run build --workspace=apps/web  # harus ✓ Compiled successfully
```
