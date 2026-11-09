import { cn } from '@/lib/utils';
export function Button({ children, variant='primary', size='md', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'ghost'|'outline'|'soft'; size?: 'sm'|'md'|'lg' }) {
  const v:any={ primary:'bg-zinc-900 text-white hover:bg-black shadow', ghost:'bg-transparent hover:bg-zinc-100 text-zinc-700', outline:'border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800', soft:'bg-zinc-900/10 hover:bg-zinc-900/15 text-zinc-900' };
  const s:any={ sm:'px-3 py-1.5 text-xs', md:'px-4 py-2 text-sm', lg:'px-6 py-3 text-base' };
  return <button className={cn('rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50', v[variant], s[size], className)} {...props}>{children}</button>;
}
