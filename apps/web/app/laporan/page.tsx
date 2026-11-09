export default function LaporanPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border shadow-card"><h1 className="text-xl font-black text-zinc-900">Laporan & Monitoring</h1><p className="text-sm text-zinc-500 mt-1">Observability: waktu penyelesaian, task gagal, token, kuota, biaya, worker health (Blueprint §9 & §14).</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{k:'Task Selesai',v:'47',c:'text-emerald-600'},{k:'Rata Penyelesaian',v:'2.4 jam',c:'text-blue-600'},{k:'Token Terpakai',v:'1.2M',c:'text-violet-600'},{k:'Biaya',v:'Rp 0',sub:'free-only',c:'text-amber-600'}].map(s=>(<div key={s.k} className="bg-white rounded-2xl border p-4"><div className="text-[11px] font-extrabold tracking-widest uppercase text-zinc-500">{s.k}</div><div className={`text-2xl font-black mt-1 ${s.c}`}>{s.v}</div>{s.sub&&<div className="text-[11px] text-zinc-500">{s.sub}</div>}</div>))}
      </div>
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-black">Audit Log Terbaru</h3>
        <div className="mt-3 space-y-2 text-sm">
          {['[09:12] Aiko (CEO) membuat plan untuk Landing Page PVC','[09:10] Chen Wei (TECH) push ke branch sandbox/landing-pvc — YELLOW ok','[09:05] Rina (RSCH) menyelesaikan riset — 3 sumber terverifikasi','[09:00] System: checkpoint saved di node Planner','[08:45] Approval RED diminta: deploy production'].map((l,i)=>(<div key={i} className="bg-zinc-50 border rounded-xl px-3 py-2 font-mono text-xs text-zinc-700">{l}</div>))}
        </div>
      </div>
    </div>
  );
}
