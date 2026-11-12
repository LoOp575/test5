'use client';
import { OWNER } from '@/lib/mockData';

export function TopBar() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-3 py-2.5 sm:px-4 lg:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-violet-600 text-xl text-white">🪷</div>
        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-black tracking-[.16em] text-white">PVC</span>
            <span className="hidden rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/55 sm:inline">Virtual Company</span>
          </div>
          <p className="hidden truncate text-[11px] text-white/55 sm:block">Creative Future Together</p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 sm:flex">
        <span className="h-2 w-2 rounded-full bg-amber-300" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-amber-100">Mode prototipe · verifikasi sumber data</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <img src={OWNER.avatar} alt="" className="h-8 w-8 rounded-full border border-white/15 bg-white/10" />
        <div className="hidden leading-tight sm:block">
          <div className="max-w-[120px] truncate text-xs font-bold text-white">{OWNER.name}</div>
          <div className="text-[10px] text-white/50">Founder</div>
        </div>
      </div>
    </div>
  );
}
