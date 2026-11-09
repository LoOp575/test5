'use client';
import { CampusMap } from '@/components/campus/CampusMap';
export default function CampusPageClient(){
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-4 border">
        <h1 className="font-black">Kampus Virtual PVC</h1>
        <p className="text-xs text-zinc-500 mt-1">Klik setiap gedung untuk melihat karyawan & tugas. Visual kampus = data sistem (Blueprint §9.1).</p>
      </div>
      <CampusMap />
    </div>
  );
}
