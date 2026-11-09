import * as React from 'react';
export function Badge({ children, variant='default' }: { children: React.ReactNode; variant?: 'default'|'success'|'warning'|'danger' }) {
  const colors: any = { default: 'bg-zinc-100 text-zinc-700', success: 'bg-emerald-100 text-emerald-700', warning: 'bg-amber-100 text-amber-700', danger: 'bg-red-100 text-red-700' };
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors[variant]}`}>{children}</span>;
}
export function Card({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-zinc-200 shadow-sm ${className}`}>{children}</div>;
}
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'ghost'|'outline' }) {
  const { variant='primary', className='', ...rest } = props;
  const vars: any = { primary: 'bg-zinc-900 text-white hover:bg-black', ghost: 'bg-transparent hover:bg-zinc-100', outline: 'border border-zinc-200 hover:bg-zinc-50' };
  return <button className={`px-4 py-2 rounded-xl text-sm font-medium transition ${vars[variant]} ${className}`} {...rest} />;
}
