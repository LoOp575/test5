import { NextRequest, NextResponse } from 'next/server';
import { createTaskSchema } from '@pvc/shared/schemas';
import { TASKS } from '@/lib/mockData';

// GET — daftar task (nanti: Supabase; sekarang mock + fallback aman)
export async function GET() {
  return NextResponse.json({ data: TASKS, source: 'mock' });
}

// POST — buat task (validasi Zod, klasifikasi level)
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Validasi via shared schema (hindari UI/backend tabrakan type)
  const parsed = createTaskSchema.safeParse({
    title: body.title,
    project_id: body.project_id ?? '00000000-0000-0000-0000-000000000000',
    description: body.description,
  });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const level = body.title?.toLowerCase().includes('deploy') || body.title?.toLowerCase().includes('publish') ? 'red' : body.title?.toLowerCase().includes('branch') ? 'yellow' : 'green';
  return NextResponse.json({ ok: true, level, message: level === 'red' ? 'Menunggu approval Owner' : 'Task dibuat', id: `t_${Date.now()}` });
}
