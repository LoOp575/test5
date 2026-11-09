import { NextRequest, NextResponse } from 'next/server';
import { PVCWorkflow } from '@pvc/workflow-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ZERO = '00000000-0000-0000-0000-000000000000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const instruction = typeof body.instruction === 'string' ? body.instruction.trim() : '';
    if (!instruction) return NextResponse.json({ error: 'instruction wajib diisi.' }, { status: 400 });

    const workflow = new PVCWorkflow();
    const state = await workflow.run({
      requestId: typeof body.request_id === 'string' ? body.request_id : `req_${Date.now()}`,
      companyId: typeof body.company_id === 'string' ? body.company_id : ZERO,
      projectId: typeof body.project_id === 'string' ? body.project_id : ZERO,
      instruction,
      checkpoints: [],
    });

    const status = state.error ? 'failed' : state.needsApproval ? 'waiting_approval' : 'completed';
    return NextResponse.json({
      ok: true,
      status,
      workflow_run_id: state.requestId,
      plan: state.plan,
      executionResults: state.executionResults,
      qaResult: state.qaResult,
      needsApproval: state.needsApproval,
      approvalId: state.approvalId,
      checkpoints: state.checkpoints.map((c) => c.node),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'workflow failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
