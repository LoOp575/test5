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
    <>
      <aside className="hidden w-[190px] shrink-0 flex-col gap-3 py-2 pl-1 lg:flex">
        <nav aria-label="Navigasi utama" className="flex flex-col gap-1.5">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-3 rounded-xl border px-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A017]',
                  active
                    ? 'border-[#D4A017]/30 bg-[#D4A017]/15 text-[#F2CC69]'
                    : 'border-transparent bg-white/[0.035] text-white/70 hover:border-white/10 hover:bg-white/[0.08] hover:text-white'
                )}
              >
                <span aria-hidden="true" className="w-5 text-center text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-[#111827] p-3 text-white">
          <div className="text-xs font-bold">PVC Virtual Company</div>
          <div className="mt-1 text-[11px] leading-5 text-white/55">10 agent · 5 divisi · Free-only</div>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            <span className="h-1.5 flex-1 rounded-full bg-emerald-400" />
            <span className="h-1.5 flex-1 rounded-full bg-sky-400" />
            <span className="h-1.5 flex-1 rounded-full bg-violet-400" />
          </div>
        </div>
      </aside>

      <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B0F1A]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-stretch justify-around gap-1">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4A017]',
                  active ? 'bg-[#D4A017]/15 text-[#F2CC69]' : 'text-white/55 hover:bg-white/5 hover:text-white'
                )}
              >
                <span aria-hidden="true" className="text-lg leading-5">{item.icon}</span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
