'use client';
import { COMPANY, OWNER } from '@/lib/mockData';

export function TopBar() {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2">
      {/* Left: PVC Brand */}
      <div className="flex items-center gap-2.5 bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2 shadow-soft shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-violet-600 flex items-center justify-center text-white text-xl shrink-0">🪷</div>
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-black tracking-widest text-[15px]">PVC</span>
            <span className="text-white/50 text-[10px] border border-white/15 rounded-full px-1.5 py-0.5 hidden sm:inline">Virtual Company · v1.0</span>
          </div>
          <div className="text-white/60 text-[11px] font-medium hidden sm:block">Creative Future Together</div>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="hidden lg:flex items-center gap-2">
        {[
          { icon:'💰', value:'Rp 900.000', sub:'Virtual Budget', color:'text-amber-300' },
          { icon:'💎', value:'12.5K', sub:'Credits', color:'text-sky-300' },
          { icon:'⚡', value:'98%', sub:'Productivity', color:'text-violet-300' },
        ].map(s=>(
          <div key={s.sub} className="flex items-center gap-2 bg-[#0B0F1A]/85 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm">{s.icon}</div>
            <div className="leading-none">
              <div className={`text-white text-xs font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/50 text-[10px]">({s.sub})</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Owner + Weather */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5">
          <img src={OWNER.avatar} alt="owner" className="w-8 h-8 rounded-full bg-white/10" />
          <div className="leading-tight">
            <div className="text-white text-xs font-bold">{OWNER.name}</div>
            <div className="text-white/50 text-[10px]">PVC Founder</div>
          </div>
          <div className="ml-1 flex gap-1 text-white/60"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">⚙️</span><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🔔</span></div>
        </div>
        <div className="bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5 text-right leading-tight hidden sm:block">
          <div className="text-white/70 text-[10px]">Selasa, 27 Mei 2025</div>
          <div className="text-white font-bold text-sm flex items-center gap-1 justify-end">☀️ 09:30</div>
          <div className="text-white/50 text-[10px]">Cuaca: Cerah 28°C</div>
        </div>
      </div>
    </div>
  );
}
