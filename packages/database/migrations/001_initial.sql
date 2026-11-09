-- PVC Virtual Company — Initial Schema (Blueprint §8)
-- Company sebagai root, modular departments, RLS, audit, soft-delete via status

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type department_code as enum ('HQ','TECH','RSCH','ANIM','BIZ');
exception when duplicate_object then null; end $$;

do $$ begin
  create type agent_status as enum ('idle','working','waiting_approval','blocked','offline');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('backlog','ready','working','review','approval','done','blocked');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type action_level as enum ('green','yellow','red');
exception when duplicate_object then null; end $$;

do $$ begin
  create type approval_status as enum ('pending','approved','rejected','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type workflow_status as enum ('pending','running','paused','completed','failed');
exception when duplicate_object then null; end $$;

-- Companies (single company PVC)
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_user_id uuid references auth.users(id),
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Departments
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  code department_code not null,
  description text,
  building_position jsonb,
  color text,
  icon text,
  created_at timestamptz default now(),
  unique(company_id, code)
);
create index if not exists idx_departments_company on departments(company_id);

-- Agents
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references departments(id) on delete cascade,
  name text not null,
  role text not null,
  avatar_url text,
  skills jsonb default '[]'::jsonb,
  model_policy jsonb default '{}'::jsonb,
  tool_permissions jsonb default '[]'::jsonb,
  memory_scope jsonb default '[]'::jsonb,
  status agent_status default 'idle',
  last_activity_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_agents_department on agents(department_id);
create index if not exists idx_agents_status on agents(status);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text default 'planning',
  priority task_priority default 'medium',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(company_id, slug)
);
create index if not exists idx_projects_company on projects(company_id);
create index if not exists idx_projects_status on projects(status);

-- Tasks
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  parent_task_id uuid references tasks(id),
  assigned_agent_id uuid references agents(id),
  title text not null,
  description text,
  status task_status default 'backlog',
  priority task_priority default 'medium',
  action_level action_level default 'green',
  acceptance_criteria text,
  due_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_tasks_project on tasks(project_id);
create index if not exists idx_tasks_assigned on tasks(assigned_agent_id);
create index if not exists idx_tasks_status on tasks(status);
create index if not exists idx_tasks_created on tasks(created_at);

-- Artifacts (files, renders, docs)
create table if not exists artifacts (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  created_at timestamptz default now()
);

-- Workflow Runs
create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  status workflow_status default 'pending',
  current_node text,
  input jsonb,
  output jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_workflow_company on workflow_runs(company_id);

-- Checkpoints (resume)
create table if not exists checkpoints (
  id uuid primary key default gen_random_uuid(),
  workflow_run_id uuid not null references workflow_runs(id) on delete cascade,
  node text not null,
  state jsonb,
  created_at timestamptz default now()
);

-- Approvals (RED gate)
create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id),
  workflow_run_id uuid references workflow_runs(id),
  requested_by uuid not null,
  action_level action_level not null,
  action_detail jsonb,
  status approval_status default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_approvals_status on approvals(status);

-- Audit Logs (semua tindakan penting)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  actor_id uuid,
  actor_type text,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_audit_company on audit_logs(company_id);
create index if not exists idx_audit_created on audit_logs(created_at);

-- Memories (Company / Project / Agent)
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  project_id uuid references projects(id),
  agent_id uuid references agents(id),
  scope text not null check (scope in ('company','project','agent')),
  title text not null,
  content text not null,
  source text,
  confidence numeric(3,2) default 0.8,
  is_active boolean default true,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Usage Ledger (token & cost tracking)
create table if not exists usage_ledger (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  agent_id uuid references agents(id),
  provider text not null,
  model text not null,
  tokens_input int default 0,
  tokens_output int default 0,
  cost_usd numeric(10,4) default 0,
  task_id uuid references tasks(id),
  created_at timestamptz default now()
);
create index if not exists idx_usage_company on usage_ledger(company_id);

-- Storage buckets (jalankan di Supabase dashboard atau via API)
-- insert into storage.buckets (id, name, public) values ('artifacts','artifacts', false) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict do nothing;

-- RLS Enable
alter table companies enable row level security;
alter table departments enable row level security;
alter table agents enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table artifacts enable row level security;
alter table workflow_runs enable row level security;
alter table checkpoints enable row level security;
alter table approvals enable row level security;
alter table audit_logs enable row level security;
alter table memories enable row level security;
alter table usage_ledger enable row level security;

-- RLS Policies (contoh: owner dapat semua, anon read untuk demo — sesuaikan di production)
-- Untuk MVP, buat policy permissive dengan service_role bypass; sesuaikan setelah auth.

-- Helper: updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists trg_tasks_updated on tasks;
create trigger trg_tasks_updated before update on tasks for each row execute function set_updated_at();
drop trigger if exists trg_workflow_updated on workflow_runs;
create trigger trg_workflow_updated before update on workflow_runs for each row execute function set_updated_at();
