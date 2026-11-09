import { BackButton } from '@/components/ui/BackButton';
import { PROJECTS } from '@/lib/mockData';
import Link from 'next/link';

export default function ProyekPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/" label="Kembali ke Dashboard" />
      <div className="bg-white rounded-2xl p-5 border shadow-card flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-zinc-900">Proyek</h1>
          <p className="text-sm text-zinc-500 mt-1">Alur: Intake → Plan → Assign → Exec → QA → Approval → Delivery (Blueprint §5). Tiap proyek punya milestone & audit trail.</p>
        </div>
        <Link href="/tasks" className="hidden md:inline-flex bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black">
          ＋ Lihat Task Board
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border shadow-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg">{p.image}</div>
                <div>
                  <div className="font-black text-zinc-900">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.slug} • {p.dept}</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : p.status === 'review' ? 'bg-amber-50 text-amber-700 border-amber-200' : p.status === 'completed' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-100 text-zinc-600'}`}>
                {p.status}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                <span>Progress</span>
                <span>{p.progress}%</span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 rounded-full" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-zinc-500">📋 {p.tasks} tugas • ⏰ {p.updated}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-zinc-100 text-zinc-600'}`}>
                {p.priority}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/tasks?project=${p.slug}`} className="flex-1 bg-zinc-900 text-white rounded-xl py-2 text-xs font-bold text-center">
                Lihat Detail
              </Link>
              <Link href="/approvals" className="px-3 py-2 bg-zinc-100 rounded-xl text-xs font-semibold text-center">
                Workflow
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
