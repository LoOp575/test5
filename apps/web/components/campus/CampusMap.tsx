'use client';
import { useState } from 'react';
import Link from 'next/link';
import { DEPARTMENTS, ACTIVITIES } from '@/lib/mockData';
import { BuildingPopup } from './BuildingPopup';

// Konfigurasi posisi — single source, DRY (sebelumnya 5x copy-paste hardcode)
const BUILDING_LAYOUT: Record<string, { pos: string; dotPos: string; dotColor: string; iconBg: string }> = {
  HQ:   { pos: 'left-1/2 -translate-x-1/2 top-[18%] md:top-[21%]', dotPos: 'mx-auto mt-1', dotColor: 'bg-amber-400', iconBg: 'bg-sky-100 text-sky-600' },
  TECH: { pos: 'left-[6%] md:left-[9%] top-[38%] md:top-[39%]', dotPos: 'ml-3 mt-1', dotColor: 'bg-blue-500', iconBg: 'bg-blue-500 text-white' },
  RSCH: { pos: 'right-[6%] md:right-[9%] top-[38%] md:top-[39%]', dotPos: 'ml-auto mr-3 mt-1', dotColor: 'bg-emerald-500', iconBg: 'bg-emerald-500 text-white' },
  ANIM: { pos: 'left-[4%] md:left-[6%] bottom-[18%] md:bottom-[19%]', dotPos: 'ml-3 mt-1', dotColor: 'bg-violet-500', iconBg: 'bg-violet-500 text-white' },
  BIZ:  { pos: 'right-[4%] md:right-[6%] bottom-[18%] md:bottom-[19%]', dotPos: 'ml-auto mr-3 mt-1', dotColor: 'bg-amber-500', iconBg: 'bg-amber-500 text-white' },
};

const QUICK_ACTIONS = [
  { label: 'Proyek Baru', icon: '🚀', color: 'bg-violet-600', href: '/proyek' },
  { label: 'Kelola Agent', icon: '👥', color: 'bg-sky-600', href: '/agent' },
  { label: 'Laporan', icon: '📊', color: 'bg-emerald-600', href: '/laporan' },
  { label: 'Persetujuan', icon: '🛡️', color: 'bg-amber-600', href: '/approvals' },
];

export function CampusMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[560px] lg:min-h-[720px] rounded-[24px] overflow-hidden border border-white/15 shadow-2xl bg-[#0B0F1A]">
      <img src="/images/campus-overview.jpg" alt="PVC Campus" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5 pointer-events-none" />

      {/* Alur logika terurut: 5 gedung — dipetakan dari DEPARTMENTS, bukan hardcode ganda */}
      {DEPARTMENTS.map(dept => {
        const layout = BUILDING_LAYOUT[dept.code];
        if (!layout) return null;
        return (
          <button key={dept.code} onClick={() => setSelected(dept.code)} className={`absolute ${layout.pos} group`}>
            <div className="building-label bg-white rounded-2xl px-3 py-2 flex items-center gap-2.5 shadow-xl border border-zinc-100 group-hover:scale-[1.03] transition max-w-[200px]">
              <div className={`w-9 h-9 rounded-xl ${layout.iconBg} flex items-center justify-center shrink-0 text-sm font-mono`}>{dept.icon}</div>
              <div className="text-left leading-tight">
                <div className="text-[13px] font-extrabold text-zinc-900">{dept.name}</div>
                <div className="text-[11px] text-zinc-500">{dept.subtitle}</div>
                <div className="text-[11px] font-semibold" style={{ color: dept.color }}>👤 2 Karyawan</div>
              </div>
            </div>
            <div className={`${layout.dotPos} w-2.5 h-2.5 ${layout.dotColor} rounded-full border-2 border-white hotspot-pulse`} />
          </button>
        );
      })}

      {/* Bottom bar */}
      <div className="absolute left-2 right-2 bottom-2 flex flex-col lg:flex-row gap-2 items-end">
        <div className="w-full lg:w-[360px] bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/12 rounded-2xl p-3 text-white shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-extrabold">Aktivitas Terbaru</div>
            <button onClick={() => setShowAllActivities(v => !v)} className="text-[11px] text-sky-300 hover:text-white font-semibold">
              {showAllActivities ? 'Sembunyikan ←' : 'Lihat Semua →'}
            </button>
          </div>
          <div className="space-y-1.5">
            {(showAllActivities ? ACTIVITIES : ACTIVITIES.slice(0, 3)).map(a => (
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

        <div className="w-full lg:w-auto flex gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {QUICK_ACTIONS.map(b => (
            <Link
              key={b.label}
              href={b.href}
              className="shrink-0 flex flex-col items-center gap-1 bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-2.5 min-w-[86px] hover:bg-white/10 transition"
            >
              <div className={`w-8 h-8 rounded-xl ${b.color} flex items-center justify-center text-white shadow`}>{b.icon}</div>
              <span className="text-white text-[11px] font-bold leading-none text-center">{b.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {selected && <BuildingPopup code={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
