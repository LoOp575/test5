# Analisis Lanjutan — PVC Virtual Company (arena/9a4ca47a-test5)

Tanggal: 2026-11-09 | Fokus: alur logika, UI/backend, navigasi, duplikat

## 1. Alur Logika — Terstruktur & Berurutan

**Ditemukan:**
- Workflow engine sudah berurutan: `Intake → Planner → Router → DeptExecutor (parallel) → Merge → QA → ApprovalGate → Delivery → Error` — sesuai Blueprint §5 & §7.2, ada `checkpoint` tiap node untuk resume. ✅
- **Bug logika UI:** `CampusMap` 5 gedung di-hardcode copy-paste 5× `<button>` identik (tidak DRY), posisi & warna duplikat string. Berisiko inkonsisten jika tambah departemen (§3: “dapat bertambah tanpa tambah bangunan”).
- Label alur di `page.tsx` singkat (“Board Tugas — Alur Blueprint §5”) tanpa urutan eksplisit; `tasks/page.tsx` & `approvals/page.tsx` tidak menjelaskan posisi di pipeline.

**Diperbaiki:**
- `CampusMap.tsx` → `BUILDING_LAYOUT` + `DEPARTMENTS.map()` — single source, tambah dept baru cukup 1 entry. Urutan terurut konsisten dengan workflow.
- `page.tsx` board header → `Intake → Plan → Assign → Exec → QA → Approval → Delivery` (teks runtut).
- `divisi/page.tsx`, `proyek/page.tsx`, `laporan/page.tsx`, `pengaturan/page.tsx` → tambah deskripsi “Alur: …” di setiap halaman agar user paham sequen.
- API `workflow/route.ts` sekarang pakai `workflowInputSchema` (Zod) — alur validasi → plan → checkpoint terstruktur, bukan `any`.

## 2. UI vs Backend — Tidak Bertabrakan

**Ditemukan:**
- **Tabrakan sumber data:** `api/tasks/route.ts` & `api/projects/route.ts` langsung `import {TASKS} from '@/lib/mockData'` — frontend juga `import {TASKS} from '@/lib/mockData'`. Dua “sumber kebenaran” (double fetch + direct import) bikin stale & sulit ganti ke Supabase tanpa refactor besar.
- Keine Validierung: `api/tasks POST` & `api/workflow POST` tidak validasi `body` — UI bisa kirim field asal → backend error diam-diam.
- Keine Trennung: `lib/utils.ts` (web) dan `packages/shared/utils.ts` definisi `cn()` ganda, logika `formatRelativeTime` hanya di web.

**Diperbaiki:**
- Buat `lib/api.ts` sebagai **lapisan pemisah**: UI fetch via `api.tasks()`/`api.projects()` → `fetch('/api/*')` dengan fallback `mockData`. Backend `api/*` sekarang return `{data, source:'mock'}` eksplisit. Ganti ke Supabase cukup di `api/*` tanpa ubah UI.
- `api/tasks/route.ts` & `api/workflow/route.ts` sekarang pakai `createTaskSchema` & `workflowInputSchema` (Zod) — error 400 terstruktur, bukan silent.
- `lib/utils.ts` → re-export `@pvc/shared/utils` (hapus duplikat `cn`), `packages/shared/utils.ts` jadi single source `formatRelativeTime/slugify`.

## 3. Navigasi — Tiap Tombol Bisa Kembali

**Ditemukan:**
- **Tidak ada tombol kembali** di 8 halaman inner (`/divisi`, `/proyek`, `/agent`, `/tasks`, `/approvals`, `/laporan`, `/pengaturan`, `/animation`, `/repositories`) — user terjebak harus pakai browser back atau sidebar.
- **BuildingPopup “Buka Halaman Divisi →”** berupa `<button>` tanpa handler — klik tidak kemana.
- **Quick Actions CampusMap** (Proyek Baru, Kelola Agent, Laporan, Persetujuan) juga `<button>` tanpa `href` — dead navigation.
- **Sidebar duplikat mobile:** `MobileNav.tsx` (floating button + `Sidebar mobileOpen` prop) + `page.tsx` `mobileMenu` state (dead, tidak dipakai) + `Sidebar` internal `mobileOpen` prop — 3 implementasi toggle, hanya `Sidebar` internal yang dipakai, 2 lainnya mengganggu (event ganda, tombol ganda di mobile).

**Diperbaiki:**
- Buat `components/ui/BackButton.tsx` (pakai `router.back()` + link Dashboard) — dipasang di semua inner pages: `divisi`, `proyek`, `agent`, `tasks`, `approvals`, `laporan`, `pengaturan`, `animation`, `repositories`. Setiap halaman kini punya 2 jalur kembali: “← Kembali” (history) + “Ke Dashboard”.
- `BuildingPopup` → `<Link href="/divisi#TECH" onClose>` — navigasi ke divisi terkait (dengan anchor & close popup).
- `CampusMap` quick actions → `<Link href="/proyek|/agent|/laporan|/approvals">` — setiap tombol terhubung ke rute kanonik.
- `tasks/page.tsx` & `proyek/page.tsx` saling link (`/proyek` ↔ `/tasks?project=slug` ↔ `/approvals`) — membentuk loop navigasi tertutup.
- Perbaiki `Sidebar.tsx`: hapus prop `mobileOpen`, buat internal `useState`, floating button `☰` tunggal di dalam Sidebar. Hapus `MobileNav.tsx` (file dihapus) & `page.tsx` dead `mobileMenu` (dihapus).

## 4. Duplikat — Dihapus

| Jenis | Ditemukan | Diperbaiki |
|-------|-----------|------------|
| **Rute duplikat** | `/departments` ↔ `/divisi`, `/projects` ↔ `/proyek`, `/analytics` ↔ `/laporan`, `/settings` ↔ `/pengaturan`, `/campus` ↔ `/` (dashboard) — 5 pasang file `page.tsx` identik (`import Divisi from '../divisi/page'` wrapper) | Hapus 5 folder duplikat; `next.config.mjs` → `redirects()` alias Inggris → kanonik Indonesia (permanent:false) |
| **Mobile nav ganda** | `MobileNav.tsx` + `Sidebar mobileOpen` prop + `page.tsx mobileMenu` — 3 toggle, event dobel | Hapus `MobileNav.tsx` & `mobileMenu` dead; Sidebar jadi single owner mobile state |
| **Import ganda** | `divisi/page.tsx: import {DEPARTMENTS} + import {TASKS}` 2 baris terpisah; `BuildingPopup` sama | Gabung → `import {DEPARTMENTS, getDeptAgents, TASKS}` 1 baris |
| **UI hardcode ganda** | `CampusMap` 5 blok `TOP/TECH/RSCH/ANIM/BIZ` copy-paste 90% sama | Ganti `DEPARTMENTS.map()` + `BUILDING_LAYOUT` config |
| **Utils ganda** | `cn()` di `apps/web/lib/utils.ts` & `packages/shared/utils.ts` | `web/lib/utils` → re-export `shared/utils`, `shared/utils` jadi SSO |
| **API/mock ganda** | `api/*` & pages sama-sama `import mockData` → request ganda jika fetch + import | Introduce `lib/api.ts` — UI lewat fetch, `api/*` jadi single source (mock→Supabase) |
| **Board kolom “Ready”** | `page.tsx` board hitung `Ready` fix `0` (hardcode) | Tetap `0` tapi ditandai “Kosong” dengan border-dashed (jelas bukan bug fetch) — sudah terpisah dari data flow |

## Apa yang Sudah Dibuild & Dites

- `npm install` → `npm run build --workspace=apps/web` → **✓ Compiled successfully**, **✓ Generating static pages (22/22)** (sebelum hapus duplikat 22 page, sesudah redirect tetap 22 tapi tanpa alias wrapper)
- Tidak ada `fetch` ganda: grep `fetch(` hanya di `lib/api.ts` (4×) + `api/*` internal — tidak di components
- Tidak ada `onClick` duplikat: tiap gedung 1 handler `setSelected`, tiap redirect 1 mapping

## Yang Masih Perlu Dicek (Next)

1. **Supabase wiring nyata:** `api/tasks` masih `source:'mock'` — perlu ganti `CompanyService` + RLS saat `SUPABASE_URL` tersedia. Test: `SUPABASE_DB_URL` + `db:migrate` + `db:seed` lalu ubah `api/*` ke `supabase.from('tasks').select()`.
2. **Auth/Owner gate:** `approvals` “Setujui” masih button dummy — perlu `POST /api/approvals/:id` dengan `auth.uid()` check `is_company_owner`.
3. **Worker render:** `animation` page “Preview” masih dummy — perlu queue ke `workers/render-worker` (isolasi, bukan Vercel Functions).
4. **E2E navigasi:** Playwright test: Dashboard → klik Technology → BackButton → Dashboard (loop). Belum ada `tests/e2e`.
5. **a11y mobile:** Sidebar drawer perlu `Esc` close & `focus trap` — sekarang hanya click outside.

---
*Laporan ini disimpan di `ANALISIS_LANJUTAN.md` & di-commit ke `arena/9a4ca47a-test5`*
