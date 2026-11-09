import { NextRequest, NextResponse } from 'next/server';
import { workflowInputSchema } from '@pvc/shared/schemas';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = workflowInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const { instruction } = parsed.data;
  return NextResponse.json({
    ok: true,
    workflow_run_id: `wr_${Date.now()}`,
    status: 'running',
    plan: { tasks: instruction.toLowerCase().includes('landing') ? 5 : 3, next: 'Menunggu Planner → Router' },
    checkpoint: 'intake saved',
  });
}
