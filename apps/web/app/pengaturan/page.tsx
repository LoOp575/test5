import { BackButton } from '@/components/ui/BackButton';
import Link from 'next/link';

export default function PengaturanPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/" label="Kembali ke Dashboard" />
      <div className="bg-white rounded-2xl p-5 border shadow-card">
        <h1 className="text-xl font-black">Pengaturan</h1>
        <p className="text-sm text-zinc-500 mt-1">Alur: Company → Provider policy (free-only) → Roles → Security → Budget. Semua terurut & terdokumentasi (Blueprint §10).</p>
      </div>
      <div className="bg-white rounded-2xl border p-5 space-y-4">
        <div>
          <h3 className="font-bold text-sm">Provider Policy — Free Only</h3>
          <p className="text-xs text-zinc-500 mt-1">Jika semua jalur gratis gagal → task ditunda / minta Owner — bukan fallback berbayar diam-diam.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">✓ Gemini gratis</span>
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">✓ Groq gratis</span>
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">✓ OpenRouter gratis</span>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold text-sm">Keamanan</h3>
          <div className="mt-2 grid md:grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-50 p-3 rounded-xl border">🔒 RLS aktif — Owner full, anon read demo</div>
            <div className="bg-zinc-50 p-3 rounded-xl border">🛡️ Sandbox isolasi filesystem & network allowlist</div>
            <div className="bg-zinc-50 p-3 rounded-xl border">📝 Audit log semua tindakan penting</div>
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800">⚠️ Approval RED wajib Owner</div>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-bold text-sm">Budget Caps</h3>
          <div className="mt-2 bg-white border rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm">Bulanan: Rp 750.000 / Rp 900.000</span>
            <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </div>
      <Link href="/" className="inline-block bg-white border px-4 py-2 rounded-xl text-sm font-bold">← Dashboard</Link>
    </div>
  );
}
