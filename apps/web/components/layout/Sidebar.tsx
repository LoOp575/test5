'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Single source of truth — Indonesian canonical routes (Blueprint bahasa Indonesia)
export const NAV = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Divisi', href: '/divisi', icon: '🏛️' },
  { label: 'Proyek', href: '/proyek', icon: '📋' },
  { label: 'Agent', href: '/agent', icon: '👥' },
  { label: 'Laporan', href: '/laporan', icon: '📊' },
  { label: 'Pengaturan', href: '/pengaturan', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col gap-2 w-[170px] shrink-0 py-2 pl-2">
        <nav className="flex flex-col gap-1.5">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition border',
                isActive(item.href)
                  ? 'bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD] shadow'
                  : 'bg-[#0B0F1A]/80 text-white/85 border-white/10 hover:bg-white/10 backdrop-blur-xl'
              )}
            >
              <span className="text-base">{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto glass rounded-2xl p-3 text-white">
          <div className="text-xs font-bold">PVC Virtual Company</div>
          <div className="text-[11px] text-white/60 mt-1">10 agent aktif • 5 divisi • 100% free-only</div>
          <div className="mt-2 flex gap-1.5">
            <span className="h-1.5 flex-1 bg-emerald-400 rounded-full" />
            <span className="h-1.5 flex-1 bg-blue-400 rounded-full" />
            <span className="h-1.5 flex-1 bg-violet-400 rounded-full" />
          </div>
        </div>
      </aside>

      {/* Mobile toggle button — hanya mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-30 w-12 h-12 bg-zinc-900 text-white rounded-full shadow-xl flex items-center justify-center text-xl border border-white/10"
        aria-label="Toggle menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="w-[78%] max-w-[300px] bg-[#0B0F1A] p-3 flex flex-col gap-2 overflow-y-auto">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="font-black">PVC Menu</span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ✕
              </button>
            </div>
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold',
                  isActive(item.href) ? 'bg-white text-black' : 'bg-white/10 text-white'
                )}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
