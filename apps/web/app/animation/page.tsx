export default function AnimationPage(){
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border"><h1 className="text-xl font-black">Animation Studio</h1><p className="text-sm text-zinc-500 mt-1">Naskah, storyboard, aset, timeline, render job, versi (Blueprint §9).</p></div>
      <div className="bg-white rounded-2xl border p-4">
        <div className="aspect-[16/9] bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl border border-dashed flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl">🎬</div><div className="font-black mt-2">Animasi Pembuka PVC — Episode 1</div><div className="text-xs text-zinc-500 mt-1">Storyboard 30 detik • 12 shot • Render di worker terisolasi, bukan Vercel Functions</div>
          <div className="mt-3 flex gap-2"><button className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold">▶ Preview</button><button className="bg-white border px-4 py-2 rounded-xl text-xs font-semibold">Timeline</button></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">{['Naskah','Storyboard','Render'].map(s=>(<div key={s} className="bg-zinc-50 rounded-xl p-3 border text-center"><div className="text-xs font-bold">{s}</div><div className="text-[11px] text-zinc-500 mt-1">On progress</div></div>))}</div>
      </div>
    </div>
  );
}
