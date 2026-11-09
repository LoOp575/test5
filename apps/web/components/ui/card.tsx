import { cn } from '@/lib/utils';
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white rounded-2xl border border-zinc-200 shadow-card', className)}>{children}</div>;
}
export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('glass rounded-2xl', className)}>{children}</div>;
}
