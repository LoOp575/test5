'use client';
import { useEffect, useState } from 'react';
import { TASKS } from '@/lib/mockData';
import { fetchTasks, createTask } from '@/lib/api';

const COLS = [
  { id:'backlog', label:'Backlog', color:'bg-zinc-400' },
  { id:'ready', label:'Ready', color:'bg-sky-400' },
  { id:'working', label:'Working', color:'bg-blue-500' },
  { id:'review', label:'Review', color:'bg-violet-500' },
  { id:'approval', label:'Approval', color:'bg-amber-500' },
  { id:'done', label:'Done', color:'bg-emerald-500' },
  { id:'blocked', label:'Blocked', color:'bg-red-500' },
];

type Task = (typeof TASKS)[number];

export default function TasksPage(){
  const [filter,setFilter]=useState('all');
  const [tasks,setTasks]=useState<Task[]>(TASKS);
  const [title,setTitle]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ fetchTasks().then(setTasks); },[]);

  async function submit(){
    const t = title.trim();
    if(!t || busy) return;
    setBusy(true);
    try {
      const res = await createTask({ title: t });
      setTasks(prev => [{ id: res.id, project: '—', title: t, status: 'backlog', priority: 'medium', agent: '—', level: res.level ?? 'green', dept: 'HQ' }, ...prev]);
      setTitle('');
    } catch(e) {
      alert(e instanceof Error ? e.message : 'Gagal membuat task');
    } finally {
      setBusy(false);
    }
  }

  const list = filter==='all' ? tasks : tasks.filter(t=>t.dept===filter);
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border flex items-center justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-black">Task Board</h1><p className="text-sm text-zinc-500 mt-1">Backlog → Ready → Working → Review → Approval → Done / Blocked (Blueprint §9)</p></div>
        <div className="flex w-full gap-1.5 overflow-x-auto bg-zinc-100 rounded-full p-1 no-scrollbar md:w-auto">
          {['all','TECH','RSCH','ANIM','BIZ','HQ'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${filter===f?'bg-zinc-900 text-white':'text-zinc-600 hover:bg-white'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border p-3 flex gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Judul task baru (mis. 'Deploy ke production' → otomatis RED)" className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <button onClick={submit} disabled={busy} className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50">{busy ? '…' : '+ Buat Task'}</button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="grid min-w-[1470px] grid-cols-7 gap-2 p-3 bg-zinc-50">
          {COLS.map(col=>(
            <div key={col.id} className="bg-white rounded-xl border min-h-[420px] flex flex-col">
              <div className="p-2.5 border-b flex items-center justify-between"><span className="text-[11px] font-black tracking-widest uppercase text-zinc-600">{col.label}</span><span className={`w-2 h-2 rounded-full ${col.color}`} /></div>
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {list.filter(t=>t.status===col.id).map(t=>(
                  <div key={t.id} className="border rounded-xl p-2.5 bg-white shadow-sm hover:shadow transition cursor-pointer">
                    <div className="text-xs font-bold leading-tight line-clamp-2">{t.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">{t.project}</div>
                    <div className="mt-2 flex items-center justify-between"><span className="text-[11px] font-medium text-zinc-600">{t.agent}</span><span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${t.level==='red'?'bg-red-50 text-red-700 border-red-200': t.level==='yellow'?'bg-amber-50 text-amber-700 border-amber-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{t.level.toUpperCase()}</span></div>
                  </div>
                ))}
                {list.filter(t=>t.status===col.id).length===0 && <div className="text-[11px] text-zinc-400 text-center py-8 border border-dashed rounded-xl bg-zinc-50">Kosong</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
