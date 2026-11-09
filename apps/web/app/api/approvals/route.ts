import { NextRequest, NextResponse } from 'next/server';
import { APPROVALS } from '@/lib/mockData';
import { getSupabaseAdmin } from '@pvc/database';

function supabaseOrNull() {
  try { return getSupabaseAdmin(); } catch { return null; }
}

export async function GET() {
  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from('approvals').select('*').order('created_at', { ascending: false });
    if (!error && data) return NextResponse.json({ data });
  }
  return NextResponse.json({ data: APPROVALS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const approval_id = typeof body.approval_id === 'string' ? body.approval_id : '';
  const decision = body.decision;
  if (!approval_id || !['approved', 'rejected'].includes(decision)) {
    return NextResponse.json({ error: 'approval_id dan decision (approved/rejected) wajib diisi.' }, { status: 400 });
  }

  const sb = supabaseOrNull();
  if (sb) {
    const { error } = await sb
      .from('approvals')
      .update({ status: decision, reviewed_at: new Date().toISOString(), reviewed_by: typeof body.reviewed_by === 'string' ? body.reviewed_by : null })
      .eq('id', approval_id);
    if (!error) return NextResponse.json({ ok: true, decision, id: approval_id });
  }

  return NextResponse.json({ ok: true, decision, id: approval_id });
}
