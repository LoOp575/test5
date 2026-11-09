import { PROJECTS, TASKS, APPROVALS, AGENTS, DEPARTMENTS } from '@/lib/mockData';

/**
 * Lapisan pemisah UI ↔ backend (Blueprint §9.1).
 * Setiap fungsi mencoba endpoint API; jika gagal (belum ada backend/Supabase),
 * kembalikan mock data sehingga dashboard tetap hidup.
 */

export interface CreateTaskResult { ok: boolean; level: 'green' | 'yellow' | 'red'; id: string; message?: string; }
export interface CreateProjectResult { ok: boolean; id: string; slug: string; }
export interface DecideApprovalResult { ok: boolean; decision: string; id: string; }
export interface WorkflowResult {
  ok: boolean;
  status: string;
  workflow_run_id: string;
  plan?: { tasks: unknown[] };
  needsApproval?: boolean;
  approvalId?: string;
  checkpoints?: string[];
}

async function apiFetch<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      ...init,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
  return json;
}

export function fetchProjects() { return apiFetch('/api/projects', PROJECTS); }
export function fetchTasks() { return apiFetch('/api/tasks', TASKS); }
export function fetchApprovals() { return apiFetch('/api/approvals', APPROVALS); }
export function fetchAgents() { return apiFetch('/api/agents', AGENTS); }
export function fetchDepartments() { return apiFetch('/api/departments', DEPARTMENTS); }

export function createTask(input: { title: string; description?: string; project_id?: string; priority?: string }) {
  return apiPost<CreateTaskResult>('/api/tasks', input);
}

export function createProject(input: { name: string; description?: string; company_id?: string; priority?: string }) {
  return apiPost<CreateProjectResult>('/api/projects', input);
}

export function decideApproval(approvalId: string, decision: 'approved' | 'rejected') {
  return apiPost<DecideApprovalResult>('/api/approvals', { approval_id: approvalId, decision });
}

export function runWorkflow(input: { instruction: string; project_id?: string; company_id?: string }) {
  return apiPost<WorkflowResult>('/api/workflow', input);
}
