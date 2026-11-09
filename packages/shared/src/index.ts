/**
 * @pvc/shared — types, enums, Zod schemas, utilities
 * Sumber kebenaran untuk semua package & app.
 */

// ── Enums (mirror DB enums) ──────────────────────────────────
export const DepartmentCode = {
  HQ: 'HQ',
  TECHNOLOGY: 'TECH',
  RESEARCH: 'RSCH',
  ANIMATION: 'ANIM',
  BUSINESS: 'BIZ',
} as const;
export type DepartmentCode = (typeof DepartmentCode)[keyof typeof DepartmentCode];

export const AgentStatus = {
  IDLE: 'idle',
  WORKING: 'working',
  WAITING_APPROVAL: 'waiting_approval',
  BLOCKED: 'blocked',
  OFFLINE: 'offline',
} as const;
export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];

export const TaskStatus = {
  BACKLOG: 'backlog',
  READY: 'ready',
  WORKING: 'working',
  REVIEW: 'review',
  APPROVAL: 'approval',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const ActionLevel = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
} as const;
export type ActionLevel = (typeof ActionLevel)[keyof typeof ActionLevel];

export const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const WorkflowStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;
export type WorkflowStatus = (typeof WorkflowStatus)[keyof typeof WorkflowStatus];

// ── Types ────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  slug: string;
  owner_user_id: string | null;
  settings: CompanySettings;
  created_at: string;
}

export interface CompanySettings {
  brand_name?: string;
  logo_url?: string;
  budget_monthly_usd?: number;
  provider_policy?: 'free_only' | 'allow_paid_with_approval';
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  code: DepartmentCode;
  description: string | null;
  building_position: { x: number; y: number };
  color: string;
  icon: string;
}

export interface Agent {
  id: string;
  department_id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  skills: string[];
  model_policy: ModelPolicy;
  tool_permissions: string[];
  memory_scope: string[];
  status: AgentStatus;
  last_activity_at: string | null;
  department?: Department;
}

export interface ModelPolicy {
  allowed_providers: ('gemini' | 'groq' | 'openrouter')[];
  allowed_models: string[];
  max_tokens_per_task: number;
  max_cost_per_task_usd: number;
  free_only: boolean;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'planning' | 'active' | 'review' | 'completed' | 'archived';
  priority: TaskPriority;
  created_by: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  parent_task_id: string | null;
  assigned_agent_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  action_level: ActionLevel;
  acceptance_criteria: string | null;
  due_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Approval {
  id: string;
  task_id: string | null;
  workflow_run_id: string | null;
  requested_by: string;
  action_level: ActionLevel;
  action_detail: Record<string, unknown>;
  status: ApprovalStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface WorkflowRun {
  id: string;
  project_id: string;
  company_id: string;
  status: WorkflowStatus;
  current_node: string | null;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  checkpoints: Checkpoint[];
  created_at: string;
}

export interface Checkpoint {
  node: string;
  state: Record<string, unknown>;
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────
export function actionLevelForTask(title: string, description?: string | null): ActionLevel {
  const text = `${title} ${description ?? ''}`.toLowerCase();
  const redKeywords = ['deploy', 'merge to main', 'publish', 'delete', 'production', 'payment', 'credential'];
  const yellowKeywords = ['branch', 'sandbox', 'test', 'build', 'asset', 'render'];
  if (redKeywords.some((k) => text.includes(k))) return ActionLevel.RED;
  if (yellowKeywords.some((k) => text.includes(k))) return ActionLevel.YELLOW;
  return ActionLevel.GREEN;
}

export function statusColor(status: TaskStatus | AgentStatus | ApprovalStatus): string {
  const map: Record<string, string> = {
    idle: '#9CA3AF',
    working: '#3B82F6',
    waiting_approval: '#F59E0B',
    blocked: '#EF4444',
    offline: '#6B7280',
    backlog: '#9CA3AF',
    ready: '#60A5FA',
    review: '#A78BFA',
    approval: '#FBBF24',
    done: '#10B981',
    pending: '#F59E0B',
    approved: '#10B981',
    rejected: '#EF4444',
    expired: '#6B7280',
  };
  return map[status] ?? '#9CA3AF';
}

export function departmentMeta(code: DepartmentCode) {
  const metas: Record<DepartmentCode, { label: string; color: string; bg: string; icon: string }> = {
    HQ: { label: 'Headquarters', color: '#B45309', bg: '#FEF3C7', icon: '🏯' },
    TECH: { label: 'Technology', color: '#2563EB', bg: '#DBEAFE', icon: '💻' },
    RSCH: { label: 'Research', color: '#7C3AED', bg: '#EDE9FE', icon: '🔬' },
    ANIM: { label: 'Animation', color: '#DB2777', bg: '#FCE7F3', icon: '🎨' },
    BIZ: { label: 'Business', color: '#059669', bg: '#D1FAE5', icon: '📈' },
  };
  return metas[code];
}
