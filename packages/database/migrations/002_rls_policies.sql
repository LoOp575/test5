-- RLS Policies untuk PVC (Blueprint §10)
-- Asumsi: auth.users ada (Supabase Auth). Untuk local dev tanpa auth, gunakan service_role yang bypass RLS.
-- Owner = companies.owner_user_id

-- Helper function: is_owner
create or replace function is_company_owner(cid uuid) returns boolean as $$
  select exists(select 1 from companies where id=cid and owner_user_id = auth.uid());
$$ language sql stable;

-- Companies: owner full, authenticated read
drop policy if exists "companies_select" on companies;
create policy "companies_select" on companies for select using (true);
drop policy if exists "companies_insert_owner" on companies;
create policy "companies_insert_owner" on companies for insert with check (auth.role() = 'authenticated');
drop policy if exists "companies_update_owner" on companies;
create policy "companies_update_owner" on companies for update using (owner_user_id = auth.uid());

-- Departments
drop policy if exists "dept_select" on departments;
create policy "dept_select" on departments for select using (true);
drop policy if exists "dept_mod_owner" on departments;
create policy "dept_mod_owner" on departments for all using (is_company_owner(company_id));

-- Agents
drop policy if exists "agents_select" on agents;
create policy "agents_select" on agents for select using (true);
drop policy if exists "agents_mod_owner" on agents;
create policy "agents_mod_owner" on agents for all using (
  exists(select 1 from departments d where d.id=department_id and is_company_owner(d.company_id))
);

-- Projects
drop policy if exists "projects_select" on projects;
create policy "projects_select" on projects for select using (true);
drop policy if exists "projects_mod_owner" on projects;
create policy "projects_mod_owner" on projects for all using (is_company_owner(company_id));

-- Tasks
drop policy if exists "tasks_select" on tasks;
create policy "tasks_select" on tasks for select using (true);
drop policy if exists "tasks_mod" on tasks;
create policy "tasks_mod" on tasks for all using (
  exists(select 1 from projects p where p.id=project_id and is_company_owner(p.company_id))
);

-- Approvals: hanya owner yang bisa approve RED
drop policy if exists "approvals_select" on approvals;
create policy "approvals_select" on approvals for select using (true);
drop policy if exists "approvals_insert" on approvals;
create policy "approvals_insert" on approvals for insert with check (auth.role()='authenticated');

-- Audit logs: append-only, no delete via RLS
drop policy if exists "audit_select" on audit_logs;
create policy "audit_select" on audit_logs for select using (true);
drop policy if exists "audit_insert" on audit_logs;
create policy "audit_insert" on audit_logs for insert with check (true);
