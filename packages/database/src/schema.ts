// Drizzle ORM schema — mirrors Supabase Postgres (see migrations/001_initial.sql)
import { pgTable, uuid, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const departmentCodeEnum = pgEnum('department_code', ['HQ', 'TECH', 'RSCH', 'ANIM', 'BIZ']);
export const agentStatusEnum = pgEnum('agent_status', ['idle', 'working', 'waiting_approval', 'blocked', 'offline']);
export const taskStatusEnum = pgEnum('task_status', ['backlog', 'ready', 'working', 'review', 'approval', 'done', 'blocked']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const actionLevelEnum = pgEnum('action_level', ['green', 'yellow', 'red']);
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected', 'expired']);
export const workflowStatusEnum = pgEnum('workflow_status', ['pending', 'running', 'paused', 'completed', 'failed']);

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  owner_user_id: uuid('owner_user_id'),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  company_id: uuid('company_id').references(() => companies.id).notNull(),
  name: text('name').notNull(),
  code: departmentCodeEnum('code').notNull(),
  description: text('description'),
  building_position: jsonb('building_position').$type<{ x: number; y: number }>(),
  color: text('color'),
  icon: text('icon'),
});

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  department_id: uuid('department_id').references(() => departments.id).notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  avatar_url: text('avatar_url'),
  skills: jsonb('skills').$type<string[]>().default([]),
  model_policy: jsonb('model_policy').$type<Record<string, unknown>>(),
  tool_permissions: jsonb('tool_permissions').$type<string[]>().default([]),
  memory_scope: jsonb('memory_scope').$type<string[]>().default([]),
  status: agentStatusEnum('status').default('idle'),
  last_activity_at: timestamp('last_activity_at', { withTimezone: true }),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  company_id: uuid('company_id').references(() => companies.id).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  status: text('status').default('planning'),
  priority: taskPriorityEnum('priority').default('medium'),
  created_by: uuid('created_by'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').references(() => projects.id).notNull(),
  parent_task_id: uuid('parent_task_id'),
  assigned_agent_id: uuid('assigned_agent_id').references(() => agents.id),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('backlog'),
  priority: taskPriorityEnum('priority').default('medium'),
  action_level: actionLevelEnum('action_level').default('green'),
  acceptance_criteria: text('acceptance_criteria'),
  due_at: timestamp('due_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const artifacts = pgTable('artifacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  task_id: uuid('task_id').references(() => tasks.id),
  project_id: uuid('project_id').references(() => projects.id),
  file_name: text('file_name').notNull(),
  file_url: text('file_url').notNull(),
  file_type: text('file_type'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  project_id: uuid('project_id').references(() => projects.id).notNull(),
  company_id: uuid('company_id').references(() => companies.id).notNull(),
  status: workflowStatusEnum('status').default('pending'),
  current_node: text('current_node'),
  input: jsonb('input').$type<Record<string, unknown>>(),
  output: jsonb('output').$type<Record<string, unknown>>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const checkpoints = pgTable('checkpoints', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflow_run_id: uuid('workflow_run_id').references(() => workflowRuns.id).notNull(),
  node: text('node').notNull(),
  state: jsonb('state').$type<Record<string, unknown>>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  task_id: uuid('task_id').references(() => tasks.id),
  workflow_run_id: uuid('workflow_run_id').references(() => workflowRuns.id),
  requested_by: uuid('requested_by').notNull(),
  action_level: actionLevelEnum('action_level').notNull(),
  action_detail: jsonb('action_detail').$type<Record<string, unknown>>(),
  status: approvalStatusEnum('status').default('pending'),
  reviewed_by: uuid('reviewed_by'),
  reviewed_at: timestamp('reviewed_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  company_id: uuid('company_id').references(() => companies.id),
  actor_id: uuid('actor_id'),
  actor_type: text('actor_type'),
  action: text('action').notNull(),
  target_type: text('target_type'),
  target_id: text('target_id'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
