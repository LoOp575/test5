import { cn } from '@/lib/utils';
export function Badge({ children, variant='default', className }: { children: React.ReactNode; variant?: 'default'|'success'|'warning'|'danger'|'info'; className?: string }) {
  const v: any = { default: 'bg-zinc-800 text-zinc-200 border-zinc-700', success: 'bg-emerald-500/15 text-emerald-300 border-emerald-700/40', warning: 'bg-amber-500/15 text-amber-300 border-amber-700/40', danger: 'bg-red-500/15 text-red-300 border-red-700/30', info: 'bg-blue-500/15 text-blue-300 border-blue-700/40' };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', v[variant], className)}>{children}</span>;
}
