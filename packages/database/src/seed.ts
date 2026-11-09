import { getSupabaseAdmin } from './client';

// Seed PVC: 1 company, 5 departments, 10 agents, 2 demo projects
async function main() {
  const supabase = getSupabaseAdmin();

  // 1. Company
  const { data: company, error: cErr } = await supabase.from('companies').upsert({
    name: 'PVC Virtual Company',
    slug: 'pvc',
    settings: {
      brand_name: 'PVC',
      budget_monthly_usd: 50,
      provider_policy: 'free_only',
    },
  }, { onConflict: 'slug' }).select().single();
  if (cErr) throw cErr;
  console.log('Company:', company.id);

  const departments = [
    { company_id: company.id, name: 'Headquarters', code: 'HQ', description: 'CEO, koordinasi, monitoring, persetujuan', building_position: { x: 50, y: 50 }, color: '#B45309', icon: '🏯' },
    { company_id: company.id, name: 'Technology', code: 'TECH', description: 'Pengembangan aplikasi, backend, frontend, QA', building_position: { x: 20, y: 25 }, color: '#2563EB', icon: '💻' },
    { company_id: company.id, name: 'Research', code: 'RSCH', description: 'Riset teknis/pasar, pengumpulan bukti, analisis', building_position: { x: 80, y: 25 }, color: '#7C3AED', icon: '🔬' },
    { company_id: company.id, name: 'Animation', code: 'ANIM', description: 'Naskah, storyboard, ilustrasi, animasi 2D', building_position: { x: 20, y: 75 }, color: '#DB2777', icon: '🎨' },
    { company_id: company.id, name: 'Business', code: 'BIZ', description: 'Strategi produk, pemasaran, distribusi, evaluasi peluang', building_position: { x: 80, y: 75 }, color: '#059669', icon: '📈' },
  ];

  const deptMap: Record<string, string> = {};
  for (const d of departments) {
    const { data, error } = await supabase.from('departments').upsert(d, { onConflict: 'company_id,code' }).select().single();
    if (error) throw error;
    deptMap[d.code] = data.id;
    console.log(`Dept ${d.code}: ${data.id}`);
  }

  const agents = [
    // HQ
    { department_id: deptMap['HQ'], name: 'Aiko Tanaka', role: 'AI CEO', avatar_url: null, skills: ['leadership','strategy','coordination'], model_policy: { allowed_providers: ['gemini','groq'], free_only: true }, tool_permissions: ['read:all','write:plan'], memory_scope: ['company','project'], status: 'idle' as const },
    { department_id: deptMap['HQ'], name: 'Budi Santoso', role: 'AI Project Manager', avatar_url: null, skills: ['planning','scheduling','risk'], model_policy: { allowed_providers: ['groq'], free_only: true }, tool_permissions: ['read:all','write:task'], memory_scope: ['project'], status: 'idle' as const },
    // Technology
    { department_id: deptMap['TECH'], name: 'Chen Wei', role: 'Fullstack Developer', avatar_url: null, skills: ['TypeScript','Next.js','Supabase','Python'], model_policy: { allowed_providers: ['groq','openrouter'], free_only: true }, tool_permissions: ['read:code','write:sandbox','tool:github_branch'], memory_scope: ['project'], status: 'idle' as const },
    { department_id: deptMap['TECH'], name: 'Siti QA', role: 'QA Engineer', avatar_url: null, skills: ['testing','automation','security'], model_policy: { allowed_providers: ['gemini'], free_only: true }, tool_permissions: ['read:code','tool:test'], memory_scope: ['project'], status: 'idle' as const },
    // Research
    { department_id: deptMap['RSCH'], name: 'Rina Hartono', role: 'Researcher', avatar_url: null, skills: ['web_search','data_analysis','documentation'], model_policy: { allowed_providers: ['gemini','groq'], free_only: true }, tool_permissions: ['tool:search','tool:fetch'], memory_scope: ['project'], status: 'idle' as const },
    { department_id: deptMap['RSCH'], name: 'David Kim', role: 'Analyst', avatar_url: null, skills: ['market_analysis','SQL','visualization'], model_policy: { allowed_providers: ['groq'], free_only: true }, tool_permissions: ['read:data','tool:search'], memory_scope: ['project'], status: 'idle' as const },
    // Animation
    { department_id: deptMap['ANIM'], name: 'Maya Sari', role: 'Storyboard Artist', avatar_url: null, skills: ['storytelling','storyboard','illustration'], model_policy: { allowed_providers: ['gemini'], free_only: true }, tool_permissions: ['tool:image_generate','write:asset'], memory_scope: ['project'], status: 'idle' as const },
    { department_id: deptMap['ANIM'], name: 'Kenji Sato', role: '2D Animator', avatar_url: null, skills: ['animation','editing','Lottie','After Effects'], model_policy: { allowed_providers: ['openrouter'], free_only: true }, tool_permissions: ['tool:render','write:asset'], memory_scope: ['project'], status: 'idle' as const },
    // Business
    { department_id: deptMap['BIZ'], name: 'Lisa Wijaya', role: 'Strategist', avatar_url: null, skills: ['product_strategy','roadmap','KPI'], model_policy: { allowed_providers: ['gemini','groq'], free_only: true }, tool_permissions: ['read:all','write:strategy'], memory_scope: ['company','project'], status: 'idle' as const },
    { department_id: deptMap['BIZ'], name: 'Andi Prasetyo', role: 'Marketing', avatar_url: null, skills: ['copywriting','social','distribution'], model_policy: { allowed_providers: ['groq'], free_only: true }, tool_permissions: ['tool:search','write:content'], memory_scope: ['project'], status: 'idle' as const },
  ];

  for (const a of agents) {
    const { error } = await supabase.from('agents').insert(a);
    if (error) console.warn('Agent insert skipped:', error.message);
    else console.log(`Agent ${a.name} OK`);
  }

  // Demo projects
  const projects = [
    { company_id: company.id, name: 'Landing Page PVC v1', slug: 'landing-pvc-v1', description: 'Landing page perusahaan dengan kampus 2D interaktif', status: 'active', priority: 'high' as const },
    { company_id: company.id, name: 'Animasi Pembuka PVC', slug: 'animasi-pembuka-pvc', description: 'Video animasi 2D 30 detik untuk branding PVC', status: 'planning' as const, priority: 'medium' as const },
  ];
  for (const p of projects) {
    const { error } = await supabase.from('projects').upsert(p, { onConflict: 'company_id,slug' });
    if (error) console.warn(error.message); else console.log(`Project ${p.slug} OK`);
  }

  console.log('Seed done — PVC siap: 1 company, 5 depts, 10 agents');
}
main().catch((e) => { console.error(e); process.exit(1); });
