import { NextRequest, NextResponse } from 'next/server';
// Mock LangGraph workflow trigger
export async function POST(req: NextRequest){
  const { instruction, project_id } = await req.json();
  // Di production: panggil PVCWorkflow().run()
  return NextResponse.json({
    ok: true,
    workflow_run_id: `wr_${Date.now()}`,
    status: 'running',
    plan: {
      tasks: instruction.toLowerCase().includes('landing') ? 5 : 3,
      next: 'Menunggu Planner → Router',
    },
    checkpoint: 'intake saved',
  });
}
