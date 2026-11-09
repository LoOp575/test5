'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { TASKS } from '@/lib/mockData';
import Link from 'next/link';

const COLS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-zinc-400' },
  { id: 'ready', label: 'Ready', color: 'bg-sky-400' },
  { id: 'working', label: 'Working', color: 'bg-blue-500' },
  { id: 'review', label: 'Review', color: 'bg-violet-500' },
  { id: 'approval', label: 'Approval', color: 'bg-amber-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
  { id: 'blocked', label: 'Blocked', color: 'bg-red-500' },
];

function TasksBoard() {
  const [filter, setFilter] = useState('all');
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get('project');
  const list = filter === 'all' ? TASKS : TASKS.filter(t => t.dept === filter);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black">Task Board</h1>
          <p className="text-sm text-zinc-500 mt-1">Urutan logika: Backlog → Ready → Working → Review → Approval → Done / Blocked (Blueprint §9). Filter dept untuk fokus.</p>
          {projectFilter && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-bold mt-2 inline-block">Filter proyek: {projectFilter}</span>}
        </div>
        <div className="flex gap-1.5 bg-zinc-100 rounded-full p-1 overflow-x-auto">
          {['all', 'TECH', 'RSCH', 'ANIM', 'BIZ', 'HQ'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filter === f ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-zinc-50">
          {COLS.map(col => (
            <div key={col.id} className="bg-white rounded-xl border min-h-[420px] flex flex-col">
              <div className="p-2.5 border-b flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest uppercase text-zinc-600">{col.label}</span>
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
              </div>
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {list
                  .filter(t => t.status === col.id)
                  .map(t => (
                    <div key={t.id} className="border rounded-xl p-2.5 bg-white shadow-sm hover:shadow transition cursor-pointer">
                      <div className="text-xs font-bold leading-tight line-clamp-2">{t.title}</div>
                      <div className="text-[11px] text-zinc-500 mt-1">{t.project}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-zinc-600">{t.agent}</span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${t.level === 'red' ? 'bg-red-50 text-red-700 border-red-200' : t.level === 'yellow' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                        >
                          {t.level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                {list.filter(t => t.status === col.id).length === 0 && (
                  <div className="text-[11px] text-zinc-400 text-center py-8 border border-dashed rounded-xl bg-zinc-50">Kosong</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/" className="bg-white border px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-50">← Dashboard</Link>
        <Link href="/approvals" className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100">Lihat Persetujuan RED →</Link>
      </div>
    </>
  );
}

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/proyek" label="Kembali ke Proyek" />
      <Suspense fallback={<div className="bg-white rounded-2xl border p-8 text-center text-sm text-zinc-500">Memuat board...</div>}>
        <TasksBoard />
      </Suspense>
    </div>
  );
}
