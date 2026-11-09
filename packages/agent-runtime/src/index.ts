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

      // PLAN (LLM)
      const plan = await this.plan(ctx, lastOutput);
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

  private async plan(ctx: AgentContext, observation: string): Promise<{ action: 'tool'|'finish'; toolName?: string; toolArgs?: any; content: string }> {
    // Di production: panggil ModelRouter → LLM
    // Mock heuristics untuk MVP/demo
    if (observation.includes('done') || ctx.instruction.toLowerCase().includes('ringkasan')) {
      return { action: 'finish', content: `Ringkasan tugas "${ctx.instruction}" selesai. Observasi: ${observation}` };
    }
    // Jika butuh tool, contoh: search
    if (ctx.skills.includes('web_search') && !observation.includes('Tool search')) {
      return { action: 'tool', toolName: 'search', toolArgs: { q: ctx.instruction }, content: '' };
    }
    return { action: 'finish', content: `Agent ${ctx.agent_id} menyelesaikan: ${ctx.instruction}` };
  }
}
