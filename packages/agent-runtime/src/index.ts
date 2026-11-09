/**
 * Agent Loop — Blueprint §7.1
 * Plan → Act → Observe → Evaluate, max 5 iterasi & 10 tool calls
 */
export interface AgentLoopConfig {
  maxIterations?: number;
  maxToolCalls?: number;
  timeoutMs?: number;
}

export interface AgentContext {
  agent_id: string;
  task_id: string;
  instruction: string;
  skills: string[];
  toolPermissions: string[];
  memory?: string;
}

export interface LoopResult {
  success: boolean;
  output: string;
  iterations: number;
  toolCalls: number;
  reason: string;
}

type Tool = { name: string; call: (args: any) => Promise<string> };

export class AgentLoop {
  private tools: Map<string, Tool> = new Map();
  constructor(private config: AgentLoopConfig = {}) {
    this.config = { maxIterations: 5, maxToolCalls: 10, timeoutMs: 120000, ...config };
  }

  registerTool(tool: Tool) { this.tools.set(tool.name, tool); }

  async run(ctx: AgentContext, router?: any): Promise<LoopResult> {
    let iterations = 0;
    let toolCalls = 0;
    let lastOutput = '';
    const start = Date.now();

    while (iterations < this.config.maxIterations!) {
      if (Date.now() - start > this.config.timeoutMs!) {
        return { success: false, output: lastOutput, iterations, toolCalls, reason: 'timeout' };
      }
      iterations++;

      // PLAN (LLM bila router tersedia, heuristik sebagai fallback)
      const plan = await this.plan(ctx, lastOutput, router);
      if (plan.action === 'finish') {
        return { success: true, output: plan.content, iterations, toolCalls, reason: 'completed' };
      }

      // ACT (tool)
      if (plan.action === 'tool') {
        if (toolCalls >= this.config.maxToolCalls!) {
          return { success: false, output: lastOutput, iterations, toolCalls, reason: 'max_tool_calls' };
        }
        const tool = this.tools.get(plan.toolName!);
        if (!tool) { lastOutput = `Tool ${plan.toolName} not allowed`; continue; }
        if (!ctx.toolPermissions.includes(tool.name) && !ctx.toolPermissions.includes('*')) {
          lastOutput = `Permission denied for ${tool.name}`; continue;
        }
        toolCalls++;
        try {
          const res = await tool.call(plan.toolArgs);
          lastOutput = `Tool ${tool.name} result: ${res}`;
        } catch (e: any) {
          lastOutput = `Tool error: ${e.message}`;
        }
      }

      // OBSERVE → EVALUATE (loop again)
    }
    return { success: false, output: lastOutput, iterations, toolCalls, reason: 'max_iterations' };
  }

  private async plan(ctx: AgentContext, observation: string, router?: any): Promise<{ action: 'tool'|'finish'; toolName?: string; toolArgs?: any; content: string }> {
    if (router && typeof router.complete === 'function') {
      try {
        const prompt = [
          'Kamu adalah agen pelaksana dalam loop Plan→Act→Observe→Evaluate (Blueprint §7.1).',
          `Instruksi tugas: ${ctx.instruction}`,
          `Observasi terakhir: ${observation || '(belum ada)'}`,
          'Balas HANYA dengan JSON valid: {"action":"tool"|"finish","toolName":"...","toolArgs":{},"content":"..."}',
          'Pilih "tool" hanya jika perlu memanggil tool yang kamu miliki, "finish" jika selesai.',
        ].join('\n');
        const result = await router.complete([{ role: 'user', content: prompt }], { maxOutputTokens: 500 });
        return this.parsePlan(result.content);
      } catch {
        // fallthrough ke heuristik mock
      }
    }
    if (observation.includes('done') || ctx.instruction.toLowerCase().includes('ringkasan')) {
      return { action: 'finish', content: `Ringkasan tugas "${ctx.instruction}" selesai. Observasi: ${observation}` };
    }
    if (ctx.skills.includes('web_search') && !observation.includes('Tool search')) {
      return { action: 'tool', toolName: 'search', toolArgs: { q: ctx.instruction }, content: '' };
    }
    return { action: 'finish', content: `Agent ${ctx.agent_id} menyelesaikan: ${ctx.instruction}` };
  }

  private parsePlan(text: string): { action: 'tool'|'finish'; toolName?: string; toolArgs?: any; content: string } {
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        const obj = JSON.parse(cleaned.slice(start, end + 1));
        const action = obj.action === 'tool' ? 'tool' : 'finish';
        return { action, toolName: obj.toolName, toolArgs: obj.toolArgs, content: obj.content ?? cleaned };
      }
    } catch {
      // ignore, fallback ke content mentah
    }
    return { action: 'finish', content: text };
  }
}
