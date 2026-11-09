import { NextResponse } from 'next/server';
import { DEPARTMENTS } from '@/lib/mockData';
import { getSupabaseAdmin } from '@pvc/database';

function supabaseOrNull() {
  try { return getSupabaseAdmin(); } catch { return null; }
}

export async function GET() {
  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from('departments').select('*').order('code');
    if (!error && data) return NextResponse.json({ data });
  }
  return NextResponse.json({ data: DEPARTMENTS });
}
