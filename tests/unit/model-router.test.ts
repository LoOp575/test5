import { describe, it, expect, afterEach } from 'vitest';
import { ModelRouter } from '@pvc/model-router';

const originalKeys = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
};
afterEach(() => {
  for (const [key, value] of Object.entries(originalKeys)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
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
