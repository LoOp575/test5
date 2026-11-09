'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/', icon: '🏠', active: true },
  { label: 'Divisi', href: '/divisi', icon: '🏛️' },
  { label: 'Proyek', href: '/proyek', icon: '📋' },
  { label: 'Agent', href: '/agent', icon: '👥' },
  { label: 'Laporan', href: '/laporan', icon: '📊' },
  { label: 'Pengaturan', href: '/pengaturan', icon: '⚙️' },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden lg:flex flex-col gap-2 w-[170px] shrink-0 py-2 pl-2">
        <nav className="flex flex-col gap-1.5">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition border',
                  active ? 'bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD] shadow' : 'bg-[#0B0F1A]/80 text-white/85 border-white/10 hover:bg-white/10 backdrop-blur-xl'
                )}>
                <span className="text-base">{item.icon}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto glass rounded-2xl p-3 text-white">
          <div className="text-xs font-bold">PVC Virtual Company</div>
          <div className="text-[11px] text-white/60 mt-1">10 agent aktif • 5 divisi • 100% free-only</div>
          <div className="mt-2 flex gap-1.5">
            <span className="h-1.5 flex-1 bg-emerald-400 rounded-full"/><span className="h-1.5 flex-1 bg-blue-400 rounded-full"/><span className="h-1.5 flex-1 bg-violet-400 rounded-full"/>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="w-[78%] max-w-[300px] bg-[#0B0F1A] p-3 flex flex-col gap-2 overflow-y-auto">
            <div className="flex items-center justify-between text-white mb-2">
              <span className="font-black">PVC Menu</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10">✕</button>
            </div>
            {NAV.map(item=>{
              const active = pathname===item.href;
              return <Link key={item.href} href={item.href} onClick={onClose} className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold', active?'bg-white text-black':'bg-white/10 text-white')}>{item.icon} {item.label}</Link>
            })}
          </div>
        </div>
      )}
    </>
  );
}
