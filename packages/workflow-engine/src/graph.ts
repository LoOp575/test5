/**
 * Workflow Engine — Blueprint §6 & §7.2
 * LangGraph.js state machine: Intake → Planner → Router → DeptExecutor (parallel) → Merge → QA → ApprovalGate → Delivery → ErrorHandler
 * Dengan checkpoint/resume.
 */
export type NodeId = 'intake' | 'planner' | 'router' | 'dept_executor' | 'merge' | 'qa' | 'approval_gate' | 'delivery' | 'error';

export interface WorkflowState {
  requestId: string;
  companyId: string;
  projectId: string;
  instruction: string;
  plan?: { tasks: { title: string; deptCode: string; priority: string; action_level: string }[] };
  assignedTasks?: string[];
  executionResults?: Record<string, string>;
  qaResult?: { passed: boolean; defects: string[] };
  needsApproval?: boolean;
  approvalId?: string;
  error?: string;
  checkpoints: { node: NodeId; state: any; at: string }[];
}

export interface NodeResult { next: NodeId | 'end'; patch: Partial<WorkflowState>; checkpoint?: boolean }

export class PVCWorkflow {
  // Definisi graph — jika LangGraph.js tersedia, pakai StateGraph; jika tidak, fallback ke runner sederhana ini
  nodes: Record<NodeId, (s: WorkflowState) => Promise<NodeResult>> = {
    intake: async (s) => ({
      next: 'planner',
      patch: { },
      checkpoint: true,
    }),
    planner: async (s) => {
      // CEO/PM memecah pekerjaan (mock — production panggil LLM)
      const lower = s.instruction.toLowerCase();
      let tasks: any[] = [];
      if (lower.includes('landing page')) {
        tasks = [
          { title: 'Riset referensi landing page', deptCode: 'RSCH', priority: 'high', action_level: 'green' },
          { title: 'Desain hero & komponen UI', deptCode: 'ANIM', priority: 'high', action_level: 'green' },
          { title: 'Implementasi Next.js di branch sandbox/landing-pvc', deptCode: 'TECH', priority: 'high', action_level: 'yellow' },
          { title: 'QA & test landing page', deptCode: 'TECH', priority: 'medium', action_level: 'green' },
          { title: 'Strategi go-to-market landing page', deptCode: 'BIZ', priority: 'medium', action_level: 'green' },
        ];
      } else if (lower.includes('animasi') || lower.includes('video')) {
        tasks = [
          { title: 'Riset style animasi 2D', deptCode: 'RSCH', priority: 'medium', action_level: 'green' },
          { title: 'Naskah & storyboard 30 detik', deptCode: 'ANIM', priority: 'high', action_level: 'green' },
          { title: 'Produksi aset ilustrasi', deptCode: 'ANIM', priority: 'high', action_level: 'yellow' },
          { title: 'Render & editing', deptCode: 'ANIM', priority: 'high', action_level: 'yellow' },
          { title: 'Distribusi & promosi video', deptCode: 'BIZ', priority: 'medium', action_level: 'green' },
        ];
      } else {
        tasks = [
          { title: `Eksekusi: ${s.instruction.slice(0,60)} - riset`, deptCode: 'RSCH', priority: 'medium', action_level: 'green' },
          { title: `Eksekusi: ${s.instruction.slice(0,60)} - implementasi`, deptCode: 'TECH', priority: 'high', action_level: 'yellow' },
          { title: `Kajian & QA`, deptCode: 'TECH', priority: 'medium', action_level: 'green' },
        ];
      }
      return { next: 'router', patch: { plan: { tasks } }, checkpoint: true };
    },
    router: async (s) => ({
      next: 'dept_executor',
      patch: { assignedTasks: s.plan?.tasks.map(t => t.title) ?? [] },
      checkpoint: true,
    }),
    dept_executor: async (s) => {
      // Parallel execution — mock
      const results: Record<string, string> = {};
      for (const t of s.plan?.tasks ?? []) {
        results[t.title] = `Selesai oleh dept ${t.deptCode} (${t.action_level})`;
      }
      return { next: 'merge', patch: { executionResults: results }, checkpoint: true };
    },
    merge: async (s) => ({ next: 'qa', patch: {}, checkpoint: true }),
    qa: async (s) => {
      const passed = !s.instruction.toLowerCase().includes('gagal');
      return { next: 'approval_gate', patch: { qaResult: { passed, defects: passed ? [] : ['Build gagal'] } }, checkpoint: true };
    },
    approval_gate: async (s) => {
      const hasRed = (s.plan?.tasks ?? []).some(t => t.action_level === 'red');
      const need = hasRed || s.instruction.toLowerCase().includes('deploy') || s.instruction.toLowerCase().includes('publish');
      if (need) {
        return { next: 'delivery', patch: { needsApproval: true, approvalId: `apr_${Date.now()}` } , checkpoint: true };
      }
      return { next: 'delivery', patch: { needsApproval: false }, checkpoint: false };
    },
    delivery: async (s) => ({ next: 'end', patch: {}, checkpoint: true }),
    error: async (s) => ({ next: 'end', patch: { error: s.error ?? 'unknown' }, checkpoint: true }),
  };

  async run(initial: WorkflowState, onCheckpoint?: (node: NodeId, state: WorkflowState) => Promise<void>): Promise<WorkflowState> {
    let state = { ...initial };
    let current: NodeId | 'end' = 'intake';
    let steps = 0;
    while (current !== 'end' && steps < 20) {
      steps++;
      const handler = this.nodes[current as NodeId];
      if (!handler) break;
      try {
        const res = await handler(state);
        state = { ...state, ...res.patch };
        if (res.checkpoint) {
          state.checkpoints.push({ node: current as NodeId, state: { ...res.patch }, at: new Date().toISOString() });
          if (onCheckpoint) await onCheckpoint(current as NodeId, state);
        }
        current = res.next as any;
      } catch (e: any) {
        state.error = e.message;
        current = 'error';
      }
    }
    return state;
  }

  // Resume dari checkpoint terakhir
  async resume(state: WorkflowState, fromNode: NodeId, onCheckpoint?: any): Promise<WorkflowState> {
    // lanjut dari node berikutnya
    const order: NodeId[] = ['intake','planner','router','dept_executor','merge','qa','approval_gate','delivery'];
    const idx = order.indexOf(fromNode);
    let current: NodeId | 'end' = order[Math.min(idx + 1, order.length - 1)] ?? 'delivery';
    let s = { ...state };
    let steps = 0;
    while (current !== 'end' && steps < 20) {
      steps++;
      const h = this.nodes[current as NodeId];
      if (!h) break;
      const res = await h(s);
      s = { ...s, ...res.patch };
      if (res.checkpoint) s.checkpoints.push({ node: current as NodeId, state: res.patch, at: new Date().toISOString() });
      if (onCheckpoint) await onCheckpoint(current, s);
      current = res.next as any;
    }
    return s;
  }
}
