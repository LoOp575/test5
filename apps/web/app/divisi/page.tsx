import { DEPARTMENTS, getDeptAgents, TASKS } from '@/lib/mockData';
export default function DivisiPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border shadow-card">
        <h1 className="text-xl font-black text-zinc-900">Divisi & Departemen</h1>
        <p className="text-sm text-zinc-500 mt-1">5 unit organisasi — 1 Headquarters + 4 departemen produksi. Setiap gedung menampilkan 2 karyawan (kapasitas awal, Blueprint §3).</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEPARTMENTS.map(d=>{
          const agents = getDeptAgents(d.code);
          const tasks = TASKS.filter(t=>t.dept===d.code);
          return (
            <div key={d.code} className="bg-white rounded-2xl border shadow-card overflow-hidden">
              <div className="h-1.5" style={{background:d.color}} />
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg" style={{background:d.color}}>{d.icon}</div>
                  <div><div className="font-black text-zinc-900">{d.name}</div><div className="text-xs text-zinc-500">{d.subtitle}</div><div className="mt-1 flex gap-1"><span className="text-[11px] bg-zinc-100 px-2 py-0.5 rounded-full font-semibold">{agents.length} karyawan</span><span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">{d.kpi.productivity}% produktif</span></div></div>
                </div>
                <p className="text-xs text-zinc-600 mt-3 leading-relaxed">{d.desc}</p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {agents.map(a=>(
                    <div key={a.id} className="flex items-center gap-2 bg-zinc-50 rounded-xl p-2 border"><img src={a.avatar} className="w-8 h-8 rounded-full bg-white border" alt="" /><div className="min-w-0"><div className="text-xs font-bold truncate">{a.name}</div><div className="text-[11px] text-zinc-500 truncate">{a.role}</div></div></div>
                  ))}
                </div>
                <div className="mt-4"><div className="text-[11px] font-extrabold tracking-widest uppercase text-zinc-500 mb-2">Tugas ({tasks.length})</div>{tasks.length? tasks.slice(0,3).map(t=>(<div key={t.id} className="flex items-center gap-2 text-xs bg-white border rounded-xl px-2.5 py-2 mb-1.5"><span className={`w-1.5 h-1.5 rounded-full ${t.status==='done'?'bg-emerald-500':'bg-blue-500'}`}/><span className="flex-1 truncate font-medium">{t.title}</span><span className="text-[10px] px-1.5 py-0.5 rounded-full border bg-zinc-50">{t.status}</span></div>)) : <div className="text-xs text-zinc-400 bg-zinc-50 p-3 rounded-xl text-center border-dashed border">Belum ada tugas</div>}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
