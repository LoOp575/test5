import { describe, it, expect } from 'vitest';
import { ModelRouter } from '@pvc/model-router';
describe('Model Router free-only', () => {
  it('no silent paid fallback', async () => {
    const router = new ModelRouter({ freeOnly: true, budgetCapUsd: 0, usageUsd: 10 });
    await expect(router.route({})).rejects.toThrow('BUDGET_CAP_REACHED');
  });
  it('routes to free model', async () => {
    const router = new ModelRouter({ freeOnly: true });
    const { slot } = await router.route({ needToolCalling: true });
    expect(slot.costUsdPer1k).toBe(0);
    expect(slot.supportsToolCalling).toBe(true);
  });
});
