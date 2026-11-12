'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/', icon: '⌂' },
  { label: 'Divisi', href: '/divisi', icon: '▦' },
  { label: 'Proyek', href: '/proyek', icon: '▤' },
  { label: 'Agent', href: '/agent', icon: '◉' },
  { label: 'Laporan', href: '/laporan', icon: '▥' },
  { label: 'Pengaturan', href: '/pengaturan', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 flex flex-row gap-1 overflow-x-auto border-t border-white/10 bg-[#0B0F1A]/[.97] px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl no-scrollbar lg:sticky lg:top-[88px] lg:bottom-auto lg:h-[calc(100vh-112px)] lg:w-[196px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:p-3 lg:shadow-sm"
    >
      <div className="hidden px-2 pb-2 pt-1 lg:block">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">Workspace</p>
      </div>
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex min-h-12 min-w-[76px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4A017] lg:min-w-0 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:text-sm',
              active
                ? 'bg-[#D4A017]/15 text-[#F2CC69] lg:border lg:border-[#D4A017]/25 lg:text-[#8A6500]'
                : 'text-white/65 hover:bg-white/10 hover:text-white lg:text-slate-600 lg:hover:bg-slate-50 lg:hover:text-slate-950'
            )}
          >
            <span aria-hidden="true" className="text-lg leading-5 lg:w-5 lg:text-center">{item.icon}</span>
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-auto hidden rounded-xl border border-slate-200 bg-slate-50 p-3 lg:block">
        <div className="text-xs font-bold text-slate-800">PVC Virtual Company</div>
        <div className="mt-1 text-[11px] leading-4 text-slate-500">10 agent awal · 5 unit organisasi</div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          <span className="h-1.5 flex-1 rounded-full bg-emerald-400" />
          <span className="h-1.5 flex-1 rounded-full bg-sky-400" />
          <span className="h-1.5 flex-1 rounded-full bg-violet-400" />
        </div>
      </div>
    </nav>
  );
}
