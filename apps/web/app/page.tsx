import { CampusMap } from '@/components/campus/CampusMap';
import { PROJECTS, TASKS, AGENTS } from '@/lib/mockData';

export default function DashboardPage() {
  return (
    <div className="space-y-3">
      {/* Campus hero — alur utama: Owner melihat kampus → klik gedung */}
      <CampusMap />

      {/* Ringkasan cepat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border shadow-card">
          <div className="text-xs font-extrabold tracking-widest uppercase text-zinc-500">Produktivitas Hari Ini</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-black text-zinc-900">98%</span>
            <span className="text-emerald-600 text-xs font-bold mb-1">▲ +2% vs kemarin</span>
          </div>
          <div className="mt-3 h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-emerald-500 rounded-full" style={{width:'72%'}} />
            <div className="h-full bg-blue-500 rounded-full" style={{width:'18%'}} />
            <div className="h-full bg-amber-400 rounded-full" style={{width:'8%'}} />
          </div>
          <div className="flex gap-3 mt-2 text-[11px] font-medium text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"/>Done</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"/>Working</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded-full"/>Review</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-card">
          <div className="text-xs font-extrabold tracking-widest uppercase text-zinc-500">Proyek Aktif</div>
          <div className="mt-3 space-y-2">
            {PROJECTS.slice(0,3).map(p=>(
              <div key={p.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-sm">{p.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">{p.name}</div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-violet-600" style={{width: `${p.progress}%`}} /></div>
                </div>
                <span className="text-xs font-bold text-zinc-700">{p.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-card">
          <div className="text-xs font-extrabold tracking-widest uppercase text-zinc-500">Agent Teraktif</div>
          <div className="mt-3 space-y-2">
            {AGENTS.filter(a=>a.status==='working').slice(0,4).map(a=>(
              <div key={a.id} className="flex items-center gap-2.5">
                <img src={a.avatar} alt={a.name} className="w-7 h-7 rounded-full bg-zinc-100 border" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-900 truncate">{a.name} <span className="text-zinc-400 font-normal">• {a.role}</span></div>
                  <div className="text-[11px] text-zinc-500">{a.dept} • {a.tasks} tugas</div>
                </div>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board preview — urutan logika Blueprint §5 */}
      <div className="bg-white rounded-2xl border shadow-card overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <div className="font-black text-zinc-900">Board Tugas — <span className="text-zinc-500 font-semibold">Intake → Plan → Assign → Exec → QA → Approval → Delivery</span></div>
          <span className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded-full font-bold">{TASKS.length} tugas</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-zinc-50">
          {[
            { id:'backlog', label:'Backlog', count: TASKS.filter(t=>t.status==='backlog').length },
            { id:'ready', label:'Ready', count: 0 },
            { id:'working', label:'Working', count: TASKS.filter(t=>t.status==='working').length },
            { id:'review', label:'Review', count: TASKS.filter(t=>t.status==='review').length },
            { id:'approval', label:'Approval', count: TASKS.filter(t=>t.status==='approval').length },
            { id:'done', label:'Done', count: TASKS.filter(t=>t.status==='done').length },
            { id:'blocked', label:'Blocked', count: TASKS.filter(t=>t.status==='blocked').length },
          ].map(col=>(
            <div key={col.id} className="bg-white rounded-xl border p-2.5 min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-zinc-500">{col.label}</span>
                <span className="text-[11px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded-full">{col.count}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {TASKS.filter(t=>t.status===col.id).map(t=>(
                  <div key={t.id} className="bg-white border rounded-xl p-2 shadow-sm hover:shadow transition cursor-pointer">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight line-clamp-2">{t.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-1">{t.project}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-semibold text-zinc-600">{t.agent.split(' ')[0]}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${t.level==='red'?'bg-red-50 text-red-700 border-red-200': t.level==='yellow'?'bg-amber-50 text-amber-700 border-amber-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{t.level}</span>
                    </div>
                  </div>
                ))}
                {col.count===0 && <div className="text-[11px] text-zinc-400 text-center py-6 border border-dashed rounded-xl">Kosong</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-amber-50 border-t text-[11px] text-amber-800">🔴 Task RED wajib <b>Approval Owner</b> — YELLOW sandbox allowlist. Lihat <a href="/approvals" className="underline font-bold">Persetujuan</a>.</div>
      </div>
    </div>
  );
}
