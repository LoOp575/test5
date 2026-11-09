import { BackButton } from '@/components/ui/BackButton';
import Link from 'next/link';

export default function ReposPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/" label="Kembali ke Dashboard" />
      <div className="bg-white rounded-2xl p-5 border">
        <h1 className="text-xl font-black">Repositories</h1>
        <p className="text-sm text-zinc-500 mt-1">GitHub read-only awal; merge/deploy butuh approval RED (Blueprint §10). Alur: Branch sandbox → QA → Approval → Merge.</p>
      </div>
      <div className="bg-white rounded-2xl border divide-y">
        {[
          { name: 'LoOp575/test5', branch: 'arena/9a4ca47a-test5', status: '✓ CI passing', access: 'read-write sandbox' },
          { name: 'pvc/landing-page', branch: 'sandbox/landing-pvc', status: '● needs review', access: 'YELLOW allowed' },
        ].map(r => (
          <div key={r.name} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">{r.name}</div>
              <div className="text-xs text-zinc-500 mt-1">{r.branch} • {r.access}</div>
            </div>
            <span className="text-xs bg-zinc-100 px-2.5 py-1 rounded-full font-semibold">{r.status}</span>
          </div>
        ))}
      </div>
      <Link href="/" className="inline-block bg-white border px-4 py-2 rounded-xl text-sm font-bold">← Dashboard</Link>
    </div>
  );
}
