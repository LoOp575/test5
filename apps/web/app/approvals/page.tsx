import { APPROVALS } from '@/lib/mockData';
export default function ApprovalsPage(){
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border shadow-card">
        <h1 className="text-xl font-black">Persetujuan — Approval Gate (RED)</h1>
        <p className="text-sm text-zinc-500 mt-1">Tindakan berisiko (merge production, deploy, publikasi, hapus data) wajib approval Owner (Blueprint §4.1).</p>
      </div>
      <div className="space-y-3">
        {APPROVALS.map(a=>(
          <div key={a.id} className="bg-white rounded-2xl border p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div><div className="font-bold text-zinc-900">{a.title}</div><div className="text-xs text-zinc-500 mt-1">oleh {a.requester} • {a.created} • <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold text-[11px]">RED</span></div><div className="text-xs text-zinc-600 mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5">{a.detail}</div></div>
              <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200 whitespace-nowrap">Menunggu</span>
            </div>
            <div className="flex gap-2 mt-4"><button className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-emerald-700">✓ Setujui</button><button className="flex-1 bg-white border border-zinc-200 rounded-xl py-2.5 text-sm font-bold hover:bg-zinc-50">✕ Tolak</button></div>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800"><b>Sandbox rule:</b> Merge ke main & deploy hanya dari branch allowlist. Semua RED tercatat di audit_logs.</div>
    </div>
  );
}
