'use client';
import { useState } from 'react';
import { DEPARTMENTS, ACTIVITIES, COMPANY } from '@/lib/mockData';
import { BuildingPopup } from './BuildingPopup';

export function CampusMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[560px] lg:min-h-[720px] rounded-[24px] overflow-hidden border border-white/15 shadow-2xl bg-[#0B0F1A]">
      {/* Background campus image — fill */}
      <img
        src="/images/campus-overview.jpg"
        alt="PVC Campus"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />

      {/* Building hotspots — positioned to match image */}
      {/* HEADQUARTERS — top center */}
      <button onClick={()=>setSelected('HQ')}
        className="absolute left-1/2 -translate-x-1/2 top-[18%] md:top-[21%] group">
        <div className="building-label bg-white rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition">
          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">👥</div>
          <div className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-zinc-900">Headquarters</div>
            <div className="text-[11px] text-zinc-500 font-medium">Koordinasi & Strategi</div>
            <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">👤 2 Karyawan</div>
          </div>
        </div>
        {/* hotspot pulse dot */}
        <div className="mx-auto mt-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white hotspot-pulse" />
      </button>

      {/* TECHNOLOGY — mid left */}
      <button onClick={()=>setSelected('TECH')}
        className="absolute left-[6%] md:left-[9%] top-[38%] md:top-[39%] group">
        <div className="building-label bg-white rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition max-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white text-sm font-mono shrink-0">&lt;/&gt;</div>
          <div className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-zinc-900">Technology</div>
            <div className="text-[11px] text-zinc-500">Pengembangan Software</div>
            <div className="text-[11px] text-blue-600 font-semibold">👤 2 Karyawan</div>
          </div>
        </div>
        <div className="ml-3 mt-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white hotspot-pulse" />
      </button>

      {/* RESEARCH — mid right */}
      <button onClick={()=>setSelected('RSCH')}
        className="absolute right-[6%] md:right-[9%] top-[38%] md:top-[39%] group">
        <div className="building-label bg-white rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition max-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">🧪</div>
          <div className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-zinc-900">Research</div>
            <div className="text-[11px] text-zinc-500">Riset & Analisis</div>
            <div className="text-[11px] text-emerald-600 font-semibold">👤 2 Karyawan</div>
          </div>
        </div>
        <div className="ml-auto mr-3 mt-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white hotspot-pulse" />
      </button>

      {/* ANIMATION — bottom left */}
      <button onClick={()=>setSelected('ANIM')}
        className="absolute left-[4%] md:left-[6%] bottom-[18%] md:bottom-[19%] group">
        <div className="building-label bg-white rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition max-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center text-white shrink-0">🎬</div>
          <div className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-zinc-900">Animation</div>
            <div className="text-[11px] text-zinc-500">Produksi Animasi</div>
            <div className="text-[11px] text-violet-600 font-semibold">👤 2 Karyawan</div>
          </div>
        </div>
        <div className="ml-3 mt-1 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-white hotspot-pulse" />
      </button>

      {/* BUSINESS — bottom right */}
      <button onClick={()=>setSelected('BIZ')}
        className="absolute right-[4%] md:right-[6%] bottom-[18%] md:bottom-[19%] group">
        <div className="building-label bg-white rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition max-w-[200px]">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shrink-0">📈</div>
          <div className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-zinc-900">Business</div>
            <div className="text-[11px] text-zinc-500">Strategi & Pemasaran</div>
            <div className="text-[11px] text-amber-600 font-semibold">👤 2 Karyawan</div>
          </div>
        </div>
        <div className="ml-auto mr-3 mt-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white hotspot-pulse" />
      </button>

      {/* Bottom bar overlays — Aktivitas & Actions */}
      <div className="absolute left-2 right-2 bottom-2 flex flex-col lg:flex-row gap-2 items-end">
        {/* Aktivitas Terbaru */}
        <div className="w-full lg:w-[360px] bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/12 rounded-2xl p-3 text-white shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-extrabold">Aktivitas Terbaru</div>
            <button onClick={()=>setShowAllActivities(!showAllActivities)} className="text-[11px] text-sky-300 hover:text-white font-semibold">Lihat Semua →</button>
          </div>
          <div className="space-y-1.5">
            {(showAllActivities ? ACTIVITIES : ACTIVITIES.slice(0,3)).map(a=>(
              <div key={a.id} className="flex items-center gap-2 bg-white/8 rounded-xl px-2.5 py-1.5 border border-white/8">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{a.text}</div>
                  <div className="text-[11px] text-white/55">{a.time}</div>
                </div>
                <span className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Center motto — desktop only */}
        <div className="hidden xl:flex flex-1 justify-center">
          <div className="bg-[#0B0F1A]/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl px-6 py-2.5 flex items-center gap-3">
            <span className="text-amber-300">🪷</span>
            <div className="text-center leading-tight">
              <div className="text-amber-300 font-black tracking-widest text-sm">PVC</div>
              <div className="text-white/60 text-[10px] tracking-widest">&quot;Innovate • Create • Inspire&quot;</div>
            </div>
            <span className="text-amber-300">🪷</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="w-full lg:w-auto flex gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {[
            { label:'Proyek Baru', icon:'🚀', color:'bg-violet-600' },
            { label:'Kelola Agent', icon:'👥', color:'bg-sky-600' },
            { label:'Laporan', icon:'📊', color:'bg-emerald-600' },
            { label:'Persetujuan', icon:'🛡️', color:'bg-amber-600' },
          ].map(b=>(
            <button key={b.label} className="shrink-0 flex flex-col items-center gap-1 bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-2.5 min-w-[86px] hover:bg-white/10 transition">
              <div className={`w-8 h-8 rounded-xl ${b.color} flex items-center justify-center text-white shadow`}>{b.icon}</div>
              <span className="text-white text-[11px] font-bold leading-none text-center">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popup */}
      {selected && <BuildingPopup code={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
