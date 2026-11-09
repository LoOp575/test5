/**
 * Model Router free-only — Blueprint §7.3
 * Adapter untuk Gemini, Groq, OpenRouter (hanya model gratis).
 * JANGAN fallback diam-diam ke berbayar — task ditunda / minta Owner.
 */
export type Provider = 'gemini' | 'groq' | 'openrouter';
export interface ModelSlot {
  provider: Provider;
  model: string;
  contextWindow: number;
  supportsToolCalling: boolean;
  quotaRemaining?: number;
  costUsdPer1k: number; // 0 untuk free
}

export const FREE_REGISTRY: Record<Provider, ModelSlot[]> = {
  gemini: [
    { provider: 'gemini', model: 'gemini-1.5-flash', contextWindow: 1_000_000, supportsToolCalling: true, costUsdPer1k: 0 },
    { provider: 'gemini', model: 'gemini-1.5-flash-8b', contextWindow: 1_000_000, supportsToolCalling: true, costUsdPer1k: 0 },
  ],
  groq: [
    { provider: 'groq', model: 'llama-3.1-8b-instant', contextWindow: 131072, supportsToolCalling: true, costUsdPer1k: 0 },
    { provider: 'groq', model: 'llama-3.3-70b-versatile', contextWindow: 131072, supportsToolCalling: true, costUsdPer1k: 0 },
    { provider: 'groq', model: 'gemma2-9b-it', contextWindow: 8192, supportsToolCalling: false, costUsdPer1k: 0 },
  ],
  openrouter: [
    { provider: 'openrouter', model: 'meta-llama/llama-3.1-8b-instruct:free', contextWindow: 131072, supportsToolCalling: false, costUsdPer1k: 0 },
    { provider: 'openrouter', model: 'google/gemini-2.0-flash-exp:free', contextWindow: 1_000_000, supportsToolCalling: true, costUsdPer1k: 0 },
  ],
};

export interface RouterDecision {
  slot: ModelSlot;
  reason: string;
}

export class ModelRouter {
  constructor(private opts: { freeOnly: boolean; budgetCapUsd?: number; usageUsd?: number }) {}

  async route(opts: { needToolCalling?: boolean; minContext?: number; preferredProvider?: Provider }): Promise<RouterDecision> {
    const candidates = Object.values(FREE_REGISTRY).flat().filter(s => {
      if (opts.needToolCalling && !s.supportsToolCalling) return false;
      if (opts.minContext && s.contextWindow < opts.minContext) return false;
      // di real world: cek quotaRemaining via API ping
      return s.costUsdPer1k === 0; // free-only hard filter
    });

    if (!candidates.length) {
      throw new Error('NO_FREE_MODEL_AVAILABLE: Semua jalur gratis gagal — task PAUSED, minta Owner (bukan fallback berbayar).');
    }

    // Prefer requested provider
    if (opts.preferredProvider) {
      const pref = candidates.find(c => c.provider === opts.preferredProvider);
      if (pref) return { slot: pref, reason: `preferred ${opts.preferredProvider}` };
    }

    // Budget cap
    if (this.opts.budgetCapUsd !== undefined && (this.opts.usageUsd ?? 0) >= this.opts.budgetCapUsd) {
      throw new Error('BUDGET_CAP_REACHED: Hentikan pemanggilan model sampai reset/approval.');
    }

    // Simple: pilih yang context terbesar
    const best = [...candidates].sort((a,b) => b.contextWindow - a.contextWindow)[0];
    return { slot: best, reason: 'largest context window among free models' };
  }

  // Simulasi ping kuota — di production panggil API provider
  async checkQuota(provider: Provider): Promise<{ ok: boolean; remaining?: number }> {
    const envKey = { gemini: process.env.GEMINI_API_KEY, groq: process.env.GROQ_API_KEY, openrouter: process.env.OPENROUTER_API_KEY }[provider];
    if (!envKey) return { ok: false };
    return { ok: true, remaining: 100 };
  }

  /** Catat usage — dipanggil setiap selesai agent turn */
  async recordUsage(ledger: any, params: { agent_id: string; provider: Provider; model: string; inputTokens: number; outputTokens: number; task_id: string; company_id: string }) {
    const cost = 0; // free_only = 0
    if (ledger) await ledger.insert({ ...params, tokens_input: params.inputTokens, tokens_output: params.outputTokens, cost_usd: cost });
    return { cost };
  }
}

// Adapter abstraksi — implementasi nyata panggil provider SDK
export abstract class ProviderAdapter {
  abstract provider: Provider;
  abstract chat(prompt: string, opts?: any): Promise<{ content: string; tokens: { input: number; output: number } }>;
}

export class GeminiAdapter extends ProviderAdapter {
  provider: Provider = 'gemini';
  async chat(prompt: string) {
    // TODO: @google/generative-ai
    return { content: `[Gemini mock] ${prompt.slice(0,200)}`, tokens: { input: 100, output: 100 } };
  }
}
export class GroqAdapter extends ProviderAdapter {
  provider: Provider = 'groq';
  async chat(prompt: string) {
    // TODO: groq-sdk
    return { content: `[Groq mock] ${prompt.slice(0,200)}`, tokens: { input: 100, output: 100 } };
  }
}
export class OpenRouterAdapter extends ProviderAdapter {
  provider: Provider = 'openrouter';
  async chat(prompt: string) {
    return { content: `[OpenRouter mock] ${prompt.slice(0,200)}`, tokens: { input: 100, output: 100 } };
  }
}

export function getAdapter(provider: Provider): ProviderAdapter {
  const map: Record<Provider, ProviderAdapter> = {
    gemini: new GeminiAdapter(),
    groq: new GroqAdapter(),
    openrouter: new OpenRouterAdapter(),
  };
  return map[provider];
}
