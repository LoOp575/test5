import { NextRequest, NextResponse } from 'next/server';
import { PROJECTS } from '@/lib/mockData';
import { slugify } from '@pvc/shared';
import { getSupabaseAdmin } from '@pvc/database';

function supabaseOrNull() {
  try { return getSupabaseAdmin(); } catch { return null; }
}

export async function GET() {
  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) return NextResponse.json({ data });
  }
  return NextResponse.json({ data: PROJECTS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) return NextResponse.json({ error: 'name wajib diisi.' }, { status: 400 });

  const description = typeof body.description === 'string' ? body.description : undefined;
  const priority = ['low', 'medium', 'high', 'urgent'].includes(body.priority) ? body.priority : 'medium';

  const sb = supabaseOrNull();
  if (sb) {
    const { data, error } = await sb
      .from('projects')
      .insert({
        name,
        slug: slugify(name),
        description: description ?? null,
        company_id: typeof body.company_id === 'string' ? body.company_id : null,
        status: 'planning',
        priority,
      })
      .select()
      .single();
    if (!error && data) return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
  }

  return NextResponse.json({ ok: true, id: `p_${Date.now()}`, slug: slugify(name) });
}
