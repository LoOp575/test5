/**
 * Permission matrix — Blueprint §4 & §10
 * GREEN/YELLOW/RED + RBAC Owner > CEO > PM > Agent
 */
export type ActionLevel = 'green' | 'yellow' | 'red';
export type Role = 'owner' | 'ceo' | 'pm' | 'agent' | 'viewer';

export const POLICY = {
  green: { auto: true, needApproval: false, allowRoles: ['owner','ceo','pm','agent'] as Role[] },
  yellow: { auto: false, needApproval: false, allowRoles: ['owner','ceo','pm','agent'] as Role[], constraints: { allowlistOnly: true, timeoutSec: 300, costCapUsd: 1 } },
  red: { auto: false, needApproval: true, allowRoles: ['owner'] as Role[] },
};

export function canExecute(level: ActionLevel, role: Role, hasApproval = false): boolean {
  const p = POLICY[level];
  if (!p.allowRoles.includes(role) && role !== 'owner') return false;
  if (p.needApproval && !hasApproval) return false;
  return true;
}

export function classifyAction(text: string): ActionLevel {
  const t = text.toLowerCase();
  const red = ['merge to main','deploy','publish','delete','production','payment','credential','secret'];
  const yellow = ['branch','sandbox','test','build','asset','render','github','code'];
  if (red.some(k => t.includes(k))) return 'red';
  if (yellow.some(k => t.includes(k))) return 'yellow';
  return 'green';
}

export function assertNoPaidFallback(freeOnly: boolean, requestedCost: number) {
  if (freeOnly && requestedCost > 0) {
    throw new Error('FREE_ONLY_VIOLATION: Model berbayar ditolak — task ditunda/minta Owner, bukan fallback diam-diam (Blueprint §7.3)');
  }
}
