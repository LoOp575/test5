import { createClient } from '@supabase/supabase-js';

export class CompanyService {
  constructor(private supabase: ReturnType<typeof createClient>) {}

  async getCompany(slug: string) {
    const { data, error } = await this.supabase.from('companies').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data;
  }

  async listDepartments(companyId: string) {
    const { data, error } = await this.supabase.from('departments').select('*').eq('company_id', companyId).order('code');
    if (error) throw error;
    return data;
  }

  async listAgents(companyId: string) {
    // via departments
    const { data: depts } = await this.supabase.from('departments').select('id').eq('company_id', companyId);
    const ids = (depts ?? []).map((d: any) => d.id);
    if (!ids.length) return [];
    const { data, error } = await this.supabase.from('agents').select('*, departments!inner(*)').in('department_id', ids).order('created_at');
    if (error) throw error;
    return data;
  }

  async getDepartmentWithAgents(departmentId: string) {
    const { data, error } = await this.supabase.from('departments').select('*').eq('id', departmentId).single();
    if (error) throw error;
    const { data: agents } = await this.supabase.from('agents').select('*').eq('department_id', departmentId);
    return { department: data, agents: agents ?? [] };
  }

  async logAudit(company_id: string, actor_id: string, action: string, target_type?: string, target_id?: string, metadata?: any) {
    await this.supabase.from('audit_logs').insert({ company_id, actor_id, actor_type: 'user', action, target_type, target_id, metadata });
  }
}
