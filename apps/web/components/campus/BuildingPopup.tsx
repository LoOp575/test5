'use client';
import { DEPARTMENTS, getDeptAgents } from '@/lib/mockData';
import { TASKS } from '@/lib/mockData';

export function BuildingPopup({ code, onClose }: { code: string; onClose: () => void }) {
  const dept = DEPARTMENTS.find(d=>d.code===code);
  if (!dept) return null;
  const agents = getDeptAgents(code);
  const deptTasks = TASKS.filter(t=>t.dept===code).slice(0,4);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] rounded-[24px]" onClick={onClose} />
      <div className="relative w-full max-w-[560px] bg-white rounded-[20px] shadow-2xl overflow-hidden max-h-[85%] flex flex-col">
        <div className="h-2 w-full" style={{ background: dept.color }} />
        <div className="p-5 overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl" style={{ background: dept.color }}>{dept.icon}</div>
              <div>
                <div className="font-black text-zinc-900 text-lg leading-none">{dept.name}</div>
                <div className="text-zinc-500 text-xs font-medium">{dept.subtitle}</div>
                <div className="text-[11px] text-zinc-400 mt-1 max-w-[32ch]">{dept.desc}</div>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center">✕</button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-zinc-50 rounded-2xl p-3 text-center border">
              <div className="text-lg font-black text-zinc-900">{dept.kpi.tasks}</div>
              <div className="text-[11px] text-zinc-500 font-semibold">Total Task</div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
              <div className="text-lg font-black text-emerald-600">{dept.kpi.done}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Selesai</div>
            </div>
            <div className="bg-sky-50 rounded-2xl p-3 text-center border border-sky-100">
              <div className="text-lg font-black text-sky-600">{dept.kpi.productivity}%</div>
              <div className="text-[11px] text-sky-700 font-semibold">Produktif</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-extrabold text-zinc-900 tracking-widest uppercase mb-2">Karyawan (2)</div>
            <div className="grid grid-cols-2 gap-2">
              {agents.map(a=>(
                <div key={a.id} className="flex items-center gap-2.5 bg-zinc-50 rounded-2xl p-2.5 border hover:bg-white hover:shadow transition">
                  <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-full bg-white border" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 truncate">{a.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{a.role}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${a.status==='working'?'bg-emerald-500':'bg-zinc-400'}`} />
                      <span className="text-[10px] text-zinc-500 capitalize">{a.status==='working'?'Working • '+a.lastActive : 'Idle'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-xs font-extrabold text-zinc-900 tracking-widest uppercase mb-2">Tugas Aktif</div>
            {deptTasks.length===0 ? <div className="text-xs text-zinc-400 bg-zinc-50 rounded-xl p-3 text-center border border-dashed">Belum ada tugas</div> :
              <div className="space-y-2">
                {deptTasks.map(t=>(
                  <div key={t.id} className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${t.status==='done'?'bg-emerald-500': t.status==='working'?'bg-blue-500' : t.status==='review'?'bg-violet-500' : t.status==='approval'?'bg-amber-500':'bg-zinc-300'}`} />
                    <span className="text-xs font-medium text-zinc-800 truncate flex-1">{t.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${t.level==='red'?'bg-red-50 text-red-600 border-red-200': t.level==='yellow'?'bg-amber-50 text-amber-700 border-amber-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{t.level.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            }
          </div>

          <div className="mt-5 flex gap-2">
            <button className="flex-1 bg-zinc-900 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-black">Buka Halaman Divisi →</button>
            <button onClick={onClose} className="px-4 py-2.5 bg-zinc-100 rounded-xl text-sm font-semibold hover:bg-zinc-200">Tutup</button>
          </div>

          <div className="mt-3 text-[11px] text-zinc-400 text-center">Klik avatar untuk profil lengkap • Status lampu gedung = agregasi task (Blueprint §9.1)</div>
        </div>
      </div>
    </div>
  );
}
