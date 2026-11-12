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
  const completed = TASKS.filter((task) => task.status === 'done').length;
  const productivity = TASKS.length ? Math.round((completed / TASKS.length) * 100) : 0;
  const activeProjects = PROJECTS.filter((project) => project.status === 'active');
  const workingAgents = AGENTS.filter((agent) => agent.status === 'working');

  return (
    <div className="space-y-5 pb-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Data prototipe
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Dashboard PVC</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Pantau kampus virtual, aktivitas agent, proyek, dan alur kerja perusahaan.
          </p>
        </div>
        <Link href="/proyek" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#D4A017] px-4 py-2.5 text-sm font-bold text-[#17130A] shadow-sm transition hover:bg-[#E3B52D]">
          Lihat proyek
        </Link>
      </section>

      <CampusMap />

      <section aria-label="Ringkasan perusahaan" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article className="pvc-panel p-4">
          <div className="pvc-kicker">Penyelesaian tugas · data prototipe</div>
          <div className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
            <span className="text-3xl font-extrabold tabular-nums text-slate-900">{productivity}%</span>
            <span className="mb-1 text-xs font-medium text-slate-500">{completed} dari {TASKS.length} tugas selesai</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={productivity} aria-valuemin={0} aria-valuemax={100} aria-label="Persentase tugas selesai">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${productivity}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Dihitung dari status tugas yang tersedia, bukan angka produktivitas real-time.</p>
        </article>

        <article className="pvc-panel p-4">
          <div className="pvc-kicker">Proyek aktif · data prototipe</div>
          <div className="mt-3 space-y-3">
            {activeProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-base">{project.image}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">{project.name}</div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#D4A017]" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold tabular-nums text-slate-600">{project.progress}%</span>
              </div>
            ))}
            {activeProjects.length === 0 && <p className="text-sm text-slate-400">Belum ada proyek aktif.</p>}
          </div>
        </article>

        <article className="pvc-panel p-4 sm:col-span-2 xl:col-span-1">
          <div className="pvc-kicker">Agent bekerja · data prototipe</div>
          <div className="mt-3 space-y-3">
            {workingAgents.slice(0, 4).map((agent) => (
              <div key={agent.id} className="flex min-w-0 items-center gap-3">
                <img src={agent.avatar} alt="" className="h-8 w-8 shrink-0 rounded-full border border-slate-200 bg-slate-50" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">{agent.name}</div>
                  <div className="truncate text-xs text-slate-500">{agent.dept} · {agent.tasks} tugas</div>
                </div>
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-label="Status bekerja" />
              </div>
            ))}
            {workingAgents.length === 0 && <p className="text-sm text-slate-400">Tidak ada agent berstatus bekerja.</p>}
          </div>
        </article>
      </section>

      <section id="task-board" className="pvc-panel overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Board Tugas</h2>
            <p className="mt-0.5 text-xs text-slate-500">Alur kerja sesuai Blueprint §5 · data prototipe</p>
          </div>
          <Link href="/tasks" className="text-xs font-bold text-amber-700 hover:text-amber-900">Buka Task Board →</Link>
        </div>
        <div className="overflow-x-auto">
          <div className="grid min-w-[1260px] grid-cols-7 gap-2 bg-slate-50 p-3">
            {columns.map((column) => {
              const tasks = TASKS.filter((task) => task.status === column.id);
              return (
                <div key={column.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-700">{column.label}</h3>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600">{tasks.length}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {tasks.map((task) => (
                      <article key={task.id} className="rounded-lg border border-slate-100 bg-white p-2.5 transition-colors hover:border-amber-200">
                        <p className="text-xs font-semibold leading-5 text-slate-800">{task.title}</p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">{task.project}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="truncate text-[11px] text-slate-600">{task.agent.split(' ')[0]}</span>
                          <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${task.level === 'red' ? 'border-red-200 bg-red-50 text-red-700' : task.level === 'yellow' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                            {task.level}
                          </span>
                        </div>
                      </article>
                    ))}
                    {tasks.length === 0 && <p className="rounded-lg border border-dashed border-slate-200 px-2 py-5 text-center text-xs text-slate-400">Belum ada tugas</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-amber-100 bg-amber-50/70 px-4 py-3 text-xs leading-5 text-amber-900">
          Tindakan berisiko tinggi seperti merge production atau deploy tetap memerlukan persetujuan Owner.
        </div>
      </section>
    </div>
  );
}
