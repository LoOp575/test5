import { NextRequest, NextResponse } from 'next/server';
import { TASKS } from '@/lib/mockData';
import { actionLevelForTask } from '@pvc/shared';
import { getSupabaseAdmin } from '@pvc/database';

function supabaseOrNull() {
  try { return getSupabaseAdmin(); } catch { return null; }
}

export async function GET() {
  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error && data) return NextResponse.json({ data });
  }
  return NextResponse.json({ data: TASKS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return NextResponse.json({ error: 'title wajib diisi.' }, { status: 400 });

  const description = typeof body.description === 'string' ? body.description : undefined;
  const level = actionLevelForTask(title, description);
  const priority = ['low', 'medium', 'high', 'urgent'].includes(body.priority) ? body.priority : 'medium';

  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb
      .from('tasks')
      .insert({
        title,
        description: description ?? null,
        project_id: typeof body.project_id === 'string' ? body.project_id : null,
        priority,
        action_level: level,
        status: 'backlog',
      })
      .select()
      .single();
    if (!error && data) {
      if (level === 'red') {
        await sb.from('approvals').insert({
          requested_by: typeof body.requested_by === 'string' ? body.requested_by : '00000000-0000-0000-0000-000000000000',
          action_level: 'red',
          action_detail: { title },
          status: 'pending',
        });
      }
      return NextResponse.json({
        ok: true, level, id: data.id,
        message: level === 'red' ? 'Menunggu approval Owner' : 'Task dibuat',
      });
    }
  }

  return NextResponse.json({
    ok: true, level, id: `t_${Date.now()}`,
    message: level === 'red' ? 'Menunggu approval Owner' : 'Task dibuat',
  });
}
