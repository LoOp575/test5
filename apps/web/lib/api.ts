/**
 * API layer — pemisah UI ↔ Backend (mencegah tabrakan)
 * UI (components/pages) TIDAK boleh import mockData langsung untuk data mutasi.
 * Semua akses lewat sini: fetch ke /api/* (yang nantinya ke Supabase). Saat ini fallback mock.
 */

import { TASKS as MOCK_TASKS, PROJECTS as MOCK_PROJECTS, APPROVALS as MOCK_APPROVALS } from './mockData';

export type ApiResult<T> = { data: T; source: 'api' | 'mock' };

async function fetchJson<T>(url: string, fallback: T): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { data: json.data ?? json, source: 'api' };
  } catch {
    // Backend belum siap / offline → fallback mock (tidak tabrakan, terlog)
    return { data: fallback, source: 'mock' };
  }
}

export const api = {
  tasks: () => fetchJson('/api/tasks', MOCK_TASKS),
  projects: () => fetchJson('/api/projects', MOCK_PROJECTS),
  approvals: () => fetchJson('/api/approvals', MOCK_APPROVALS),
  createTask: async (payload: { title: string; project_id?: string }) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal membuat task');
    return res.json();
  },
  triggerWorkflow: async (payload: { instruction: string; project_id: string }) => {
    const res = await fetch('/api/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Workflow gagal');
    return res.json();
  },
};
