'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function BackButton({ href = '/', label = 'Kembali' }: { href?: string; label?: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
      >
        ← {label}
      </button>
      <span className="text-zinc-300">•</span>
      <Link href={href} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 underline">
        Ke Dashboard
      </Link>
    </div>
  );
}
