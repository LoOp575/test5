import { describe, it, expect, afterEach } from 'vitest';
import { ModelRouter } from '@pvc/model-router';

const originalGeminiKey = process.env.GEMINI_API_KEY;
afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalGeminiKey;
});

describe('Model Router free-only', () => {
  it('does not silently fall back when budget cap is reached', async () => {
    const router = new ModelRouter({ freeOnly: true, budgetCapUsd: 0, usageUsd: 10 });
    await expect(router.route({})).rejects.toThrow('BUDGET_CAP_REACHED');
  });

  it('selects a configured free provider without calling a paid model', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const router = new ModelRouter({ freeOnly: true });
    const { slot } = await router.route({ needToolCalling: true });
    expect(slot.provider).toBe('gemini');
    expect(slot.model).toBe('gemini-2.0-flash');
    expect(slot.costUsdPer1k).toBe(0);
    expect(slot.supportsToolCalling).toBe(true);
  });

  it('fails closed when no provider key is configured', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    const router = new ModelRouter({ freeOnly: true });
    await expect(router.route({})).rejects.toThrow('NO_FREE_PROVIDER_CONFIGURED');
  });
});
