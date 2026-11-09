import { NextRequest, NextResponse } from 'next/server';
import { TASKS } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ data: TASKS }); }
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Di production: insert ke Supabase, klasifikasi action_level, buat approval jika RED
  const level = body.title?.toLowerCase().includes('deploy') ? 'red' : body.title?.toLowerCase().includes('branch') ? 'yellow' : 'green';
  return NextResponse.json({ ok: true, level, message: level==='red' ? 'Menunggu approval Owner' : 'Task dibuat', id: `t_${Date.now()}` });
}
