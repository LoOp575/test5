/**
 * PVC Multi-Provider Model Router
 * Free-first routing with real provider HTTP APIs and explicit fallback.
 * API keys are read server-side only. Never expose them to NEXT_PUBLIC_*.
 */
export type Provider = 'gemini' | 'groq' | 'openrouter';
export interface ModelSlot { provider: Provider; model: string; contextWindow: number; supportsToolCalling: boolean; quotaRemaining?: number; costUsdPer1k: number; }
export interface RouterDecision { slot: ModelSlot; reason: string; }
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }
export interface ChatResult { content: string; provider: Provider; model: string; tokens: { input: number; output: number }; attempts: { provider: Provider; ok: boolean; error?: string }[]; }

const MODELS: Record<Provider, string> = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'openrouter/free',
};
const CONTEXT: Record<Provider, number> = { gemini: 1_000_000, groq: 131_072, openrouter: 131_072 };
const ENV: Record<Provider, string> = { gemini: 'GEMINI_API_KEY', groq: 'GROQ_API_KEY', openrouter: 'OPENROUTER_API_KEY' };
export function isProviderConfigured(provider: Provider): boolean { return Boolean(process.env[ENV[provider]]); }

export class ModelRouter {
  constructor(private opts: { freeOnly: boolean; budgetCapUsd?: number; usageUsd?: number } = { freeOnly: true }) {}

  async route(opts: { needToolCalling?: boolean; minContext?: number; preferredProvider?: Provider } = {}): Promise<RouterDecision> {
    if (this.opts.budgetCapUsd !== undefined && (this.opts.usageUsd ?? 0) >= this.opts.budgetCapUsd) throw new Error('BUDGET_CAP_REACHED');
    const order: Provider[] = opts.preferredProvider ? [opts.preferredProvider, ...(['gemini','groq','openrouter'] as Provider[]).filter(p => p !== opts.preferredProvider)] : ['gemini','groq','openrouter'];
    const slot = order.filter(isProviderConfigured).map(provider => ({
      provider, model: MODELS[provider], contextWindow: CONTEXT[provider],
      supportsToolCalling: provider !== 'openrouter' || MODELS.openrouter === 'openrouter/free',
      costUsdPer1k: 0,
    })).find(s => (!opts.needToolCalling || s.supportsToolCalling) && (!opts.minContext || s.contextWindow >= opts.minContext));
    if (!slot) throw new Error('NO_FREE_PROVIDER_CONFIGURED');
    return { slot, reason: `selected configured free-first provider: ${slot.provider}` };
  }

  async complete(messages: ChatMessage[], options: { preferredProvider?: Provider; maxOutputTokens?: number; temperature?: number; timeoutMs?: number } = {}): Promise<ChatResult> {
    const order: Provider[] = options.preferredProvider ? [options.preferredProvider, ...(['gemini','groq','openrouter'] as Provider[]).filter(p => p !== options.preferredProvider)] : ['gemini','groq','openrouter'];
    const attempts: ChatResult['attempts'] = [];
    const errors: string[] = [];
    if (this.opts.budgetCapUsd !== undefined && (this.opts.usageUsd ?? 0) >= this.opts.budgetCapUsd) throw new Error('BUDGET_CAP_REACHED');
    for (const provider of order) {
      if (!isProviderConfigured(provider)) continue;
      try {
        const result = await this.call(provider, messages, options);
        attempts.push({ provider, ok: true });
        return { ...result, provider, model: MODELS[provider], attempts };
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown provider error';
        errors.push(`${provider}: ${message}`);
        attempts.push({ provider, ok: false, error: message });
      }
    }
    throw new Error(errors.length ? `ALL_FREE_PROVIDERS_FAILED: ${errors.join(' | ')}` : 'NO_FREE_PROVIDER_CONFIGURED');
  }

  private async call(provider: Provider, messages: ChatMessage[], options: { maxOutputTokens?: number; temperature?: number; timeoutMs?: number }): Promise<{ content: string; tokens: { input: number; output: number } }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 45000);
    try {
      const key = process.env[ENV[provider]]!;
      if (provider === 'gemini') {
        const system = messages.find(m => m.role === 'system')?.content;
        const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent?key=${encodeURIComponent(key)}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
          body: JSON.stringify({ ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}), contents, generationConfig: { temperature: options.temperature ?? 0.4, maxOutputTokens: options.maxOutputTokens ?? 2048 } }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
        const content = data?.candidates?.[0]?.content?.parts?.map((p: {text?: string}) => p.text ?? '').join('') ?? '';
        if (!content) throw new Error('Provider returned empty content');
        return { content, tokens: { input: data?.usageMetadata?.promptTokenCount ?? 0, output: data?.usageMetadata?.candidatesTokenCount ?? 0 } };
      }
      const base = provider === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1';
      const response = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(provider === 'openrouter' ? { 'HTTP-Referer': process.env.APP_BASE_URL || 'https://pvc.vercel.app', 'X-Title': 'PVC Virtual Company' } : {}) },
        signal: controller.signal,
        body: JSON.stringify({ model: MODELS[provider], messages, temperature: options.temperature ?? 0.4, max_tokens: options.maxOutputTokens ?? 2048 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string' || !content.trim()) throw new Error('Provider returned empty content');
      return { content, tokens: { input: data?.usage?.prompt_tokens ?? 0, output: data?.usage?.completion_tokens ?? 0 } };
    } finally { clearTimeout(timer); }
  }

  async checkQuota(provider: Provider): Promise<{ ok: boolean; remaining?: number }> {
    // Public provider APIs do not expose a consistent remaining-quota value.
    // This reports key configuration only; actual rate/quota errors trigger fallback in complete().
    return { ok: isProviderConfigured(provider) };
  }

  async recordUsage(ledger: any, params: { agent_id: string; provider: Provider; model: string; inputTokens: number; outputTokens: number; task_id: string; company_id: string }) {
    const cost = 0;
    if (ledger) await ledger.insert({ ...params, tokens_input: params.inputTokens, tokens_output: params.outputTokens, cost_usd: cost });
    return { cost };
  }
}

export abstract class ProviderAdapter {
  abstract provider: Provider;
  abstract chat(prompt: string, opts?: { maxOutputTokens?: number }): Promise<{ content: string; tokens: { input: number; output: number } }>;
}
class RoutedAdapter extends ProviderAdapter {
  constructor(public provider: Provider) { super(); }
  async chat(prompt: string, opts?: { maxOutputTokens?: number }) {
    const result = await new ModelRouter({ freeOnly: true }).complete([{ role: 'user', content: prompt }], { preferredProvider: this.provider, ...opts });
    return { content: result.content, tokens: result.tokens };
  }
}
export class GeminiAdapter extends RoutedAdapter { constructor() { super('gemini'); } }
export class GroqAdapter extends RoutedAdapter { constructor() { super('groq'); } }
export class OpenRouterAdapter extends RoutedAdapter { constructor() { super('openrouter'); } }
export function getAdapter(provider: Provider): ProviderAdapter {
  const map: Record<Provider, ProviderAdapter> = { gemini: new GeminiAdapter(), groq: new GroqAdapter(), openrouter: new OpenRouterAdapter() };
  return map[provider];
}
