import { describe, it, expect } from 'vitest';
import { canExecute, classifyAction } from '@pvc/company-core';

describe('Permission Matrix', () => {
  it('GREEN auto for agent', () => expect(canExecute('green','agent')).toBe(true));
  it('YELLOW needs no approval but owner check', () => expect(canExecute('yellow','agent')).toBe(true));
  it('RED requires owner approval', () => expect(canExecute('red','agent', false)).toBe(false));
  it('RED owner with approval ok', () => expect(canExecute('red','owner', true)).toBe(true));
  it('classify deploy as RED', () => expect(classifyAction('deploy to production')).toBe('red'));
  it('classify branch as YELLOW', () => expect(classifyAction('create branch sandbox/test')).toBe('yellow'));
});
