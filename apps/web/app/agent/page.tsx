import { BackButton } from '@/components/ui/BackButton';
import { AGENTS } from '@/lib/mockData';
import Link from 'next/link';

export default function AgentPage() {
  return (
    <div className="space-y-4">
      <BackButton href="/" label="Kembali ke Dashboard" />
      <div className="bg-white rounded-2xl p-5 border shadow-card">
        <h1 className="text-xl font-black text-zinc-900">Agent — 10 Karyawan AI</h1>
        <p className="text-sm text-zinc-500 mt-1">Alur: Dept → Agent (role, skill, model free-only, izin tool, memori, status — Blueprint §7). Semua bisa kembali ke Dashboard via nav atau tombol di atas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {AGENTS.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border shadow-card p-4 hover:shadow-lg transition">
            <div className="flex gap-3">
              <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-2xl bg-zinc-100 border" />
              <div className="flex-1 min-w-0">
                <div className="font-black text-zinc-900 leading-none">{a.name}</div>
                <div className="text-xs text-violet-600 font-semibold">{a.role} • {a.dept}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`w-2 h-2 rounded-full ${a.status === 'working' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
                  <span className="text-[11px] text-zinc-500 capitalize">{a.status} • {a.lastActive}</span>
                </div>
              </div>
              <span className="text-[11px] bg-zinc-900 text-white px-2 py-1 rounded-full font-bold h-fit">{a.tasks} tugas</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.skills.map(s => (
                <span key={s} className="text-[11px] bg-zinc-100 border px-2 py-1 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/tasks?agent=${a.id}`} className="flex-1 bg-zinc-900 text-white rounded-xl py-2 text-xs font-bold text-center">
                Tugas
              </Link>
              <span className="px-3 py-2 bg-zinc-100 rounded-xl text-xs font-semibold">Memori</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-400">Free-only • Audit log aktif</div>
          </div>
        ))}
      </div>
    </div>
  );
}
