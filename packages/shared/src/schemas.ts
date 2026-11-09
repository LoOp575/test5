import { z } from 'zod';

export const createTaskSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  action_level: z.enum(['green', 'yellow', 'red']).default('green'),
  assigned_agent_id: z.string().uuid().nullable().optional(),
  parent_task_id: z.string().uuid().nullable().optional(),
  acceptance_criteria: z.string().max(1000).optional(),
  due_at: z.string().datetime().nullable().optional(),
});

export const createProjectSchema = z.object({
  company_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const approvalDecisionSchema = z.object({
  approval_id: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  reason: z.string().max(1000).optional(),
});

export const agentUpdateSchema = z.object({
  status: z.enum(['idle', 'working', 'waiting_approval', 'blocked', 'offline']).optional(),
  skills: z.array(z.string()).optional(),
});

export const workflowInputSchema = z.object({
  project_id: z.string().uuid(),
  instruction: z.string().min(10).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
