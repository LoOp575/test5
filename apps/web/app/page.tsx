'use client';
import Link from 'next/link';
import { CampusMap } from '@/components/campus/CampusMap';
import { PROJECTS, TASKS, AGENTS } from '@/lib/mockData';

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'ready', label: 'Ready' },
  { id: 'working', label: 'Working' },
  { id: 'review', label: 'Review' },
  { id: 'approval', label: 'Approval' },
  { id: 'done', label: 'Done' },
  { id: 'blocked', label: 'Blocked' },
];

export default function DashboardPage() {
  const productivity = 98;

  return (
    <div className="space-y-5 pb-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard PVC</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/60">
            Pantau kampus virtual, aktivitas agent, proyek, dan alur kerja perusahaan.
          </p>
        </div>
        <Link
          href="/proyek"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#D4A017] px-4 py-2.5 text-sm font-bold text-[#17130A] shadow-sm transition hover:bg-[#E3B52D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2CC69]"
        >
          Lihat proyek
        </Link>
      </section>

      <CampusMap />

      <section aria-label="Ringkasan perusahaan" className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Produktivitas Hari Ini</div>
          <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className="text-3xl font-bold tabular-nums text-white">{productivity}%</span>
            <span className="mb-1 text-xs font-semibold text-emerald-400">▲ +2% vs kemarin</span>
          </div>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10" aria-label="Komposisi status pekerjaan">
            <div className="h-full bg-emerald-500" style={{ width: '72%' }} />
            <div className="h-full bg-sky-500" style={{ width: '18%' }} />
            <div className="h-full bg-amber-400" style={{ width: '8%' }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/60">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Done</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" />Working</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Review</span>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Proyek Aktif</div>
          <div className="mt-3 space-y-3">
            {PROJECTS.slice(0, 3).map((project) => (
              <div key={project.id} className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-base">{project.image}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">{project.name}</div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#D4A017]" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold tabular-nums text-white/75">{project.progress}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#111827] p-4 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Agent Sedang Bekerja</div>
          <div className="mt-3 space-y-3">
            {AGENTS.filter((agent) => agent.status === 'working').slice(0, 4).map((agent) => (
              <div key={agent.id} className="flex min-w-0 items-center gap-3">
                <img src={agent.avatar} alt={agent.name} className="h-8 w-8 shrink-0 rounded-full border border-white/15 bg-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">{agent.name}</div>
                  <div className="truncate text-xs text-white/55">{agent.dept} · {agent.tasks} tugas</div>
                </div>
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-label="Sedang bekerja" />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="task-board" className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-card">
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Board Tugas</h2>
            <p className="mt-0.5 text-xs text-white/50">Alur kerja sesuai Blueprint §5</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-lg bg-white/8 px-2.5 py-1 text-xs font-semibold text-white/75">{TASKS.length} tugas</span>
        </div>
        <div className="grid grid-cols-1 gap-2 bg-[#0B1220] p-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {columns.map((column) => {
            const tasks = TASKS.filter((task) => task.status === column.id);
            return (
              <div key={column.id} className="min-w-0 rounded-xl border border-white/10 bg-[#111827] p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold text-white/75">{column.label}</h3>
                  <span className="rounded-md bg-white/8 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white/60">{tasks.length}</span>
                </div>
                <div className="mt-2 space-y-2">
                  {tasks.map((task) => (
                    <article key={task.id} className="rounded-lg border border-white/10 bg-[#182235] p-2.5 transition-colors hover:border-white/20">
                      <p className="text-xs font-semibold leading-5 text-white">{task.title}</p>
                      <p className="mt-1 truncate text-[11px] text-white/50">{task.project}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-white/65">{task.agent.split(' ')[0]}</span>
                        <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${task.level === 'red' ? 'border-red-400/30 bg-red-400/10 text-red-300' : task.level === 'yellow' ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'}`}>
                          {task.level}
                        </span>
                      </div>
                    </article>
                  ))}
                  {tasks.length === 0 && <p className="rounded-lg border border-dashed border-white/10 px-2 py-5 text-center text-xs text-white/35">Belum ada tugas</p>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-start gap-2 border-t border-amber-400/15 bg-amber-400/5 px-4 py-3 text-xs leading-5 text-amber-200/90">
          <span aria-hidden="true" className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
          Task RED seperti deploy atau publikasi memerlukan persetujuan Owner sebelum dijalankan.
        </div>
      </section>
    </div>
  );
}
