// Mock data sesuai Blueprint §3 & gambar — PVC Virtual Company
export const COMPANY = {
  id: 'c_pvc_001',
  name: 'PVC Virtual Company',
  slug: 'pvc',
  tagline: 'Creative Future Together',
  motto: 'Innovate • Create • Inspire',
  version: 'v1.0',
  budgetVirtual: 900000,
  credits: 12500,
  productivity: 98,
};

export const OWNER = {
  name: 'Owner',
  role: 'PVC Founder',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
};

export type AgentStatus = 'idle' | 'working' | 'waiting_approval' | 'blocked' | 'offline';
export const AGENTS = [
  { id: 'a1', dept: 'HQ', name: 'Aiko Tanaka', role: 'AI CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiko', status: 'working' as AgentStatus, skills: ['Leadership','Strategy'], tasks: 3, lastActive: 'baru saja' },
  { id: 'a2', dept: 'HQ', name: 'Budi Santoso', role: 'AI Project Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', status: 'working' as AgentStatus, skills: ['Planning','Scheduling'], tasks: 5, lastActive: '2 menit lalu' },
  { id: 'a3', dept: 'TECH', name: 'Chen Wei', role: 'Fullstack Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen', status: 'working' as AgentStatus, skills: ['TypeScript','Next.js','Supabase'], tasks: 4, lastActive: '5 menit lalu' },
  { id: 'a4', dept: 'TECH', name: 'Siti Rahayu', role: 'QA Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', status: 'idle' as AgentStatus, skills: ['Testing','Automation'], tasks: 2, lastActive: '12 menit lalu' },
  { id: 'a5', dept: 'RSCH', name: 'Rina Hartono', role: 'Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', status: 'working' as AgentStatus, skills: ['Web Search','Analysis'], tasks: 3, lastActive: 'baru saja' },
  { id: 'a6', dept: 'RSCH', name: 'David Kim', role: 'Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'idle' as AgentStatus, skills: ['Market','SQL'], tasks: 1, lastActive: '1 jam lalu' },
  { id: 'a7', dept: 'ANIM', name: 'Maya Sari', role: 'Storyboard Artist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', status: 'working' as AgentStatus, skills: ['Storytelling','Illustration'], tasks: 6, lastActive: 'baru saja' },
  { id: 'a8', dept: 'ANIM', name: 'Kenji Sato', role: '2D Animator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji', status: 'working' as AgentStatus, skills: ['Animation','Editing'], tasks: 4, lastActive: '8 menit lalu' },
  { id: 'a9', dept: 'BIZ', name: 'Lisa Wijaya', role: 'Strategist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', status: 'idle' as AgentStatus, skills: ['Product','Roadmap'], tasks: 2, lastActive: '30 menit lalu' },
  { id: 'a10', dept: 'BIZ', name: 'Andi Prasetyo', role: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', status: 'working' as AgentStatus, skills: ['Copywriting','Social'], tasks: 3, lastActive: '15 menit lalu' },
];

export const DEPARTMENTS = [
  {
    code: 'HQ', name: 'Headquarters', subtitle: 'Koordinasi & Strategi', color: '#D97706', bg: 'bg-amber-500', light: '#FEF3C7', icon: '🏯',
    pos: { x: 50, y: 32 },
    desc: 'Pusat komando. CEO & PM mengoordinasikan seluruh departemen.',
    kpi: { tasks: 8, done: 6, productivity: 96 },
    buildingImage: '/images/campus-overview.png',
  },
  {
    code: 'TECH', name: 'Technology', subtitle: 'Pengembangan Software', color: '#2563EB', bg: 'bg-blue-600', light: '#DBEAFE', icon: '</>',
    pos: { x: 18, y: 48 },
    desc: 'Membangun aplikasi, backend, frontend, integrasi & QA.',
    kpi: { tasks: 12, done: 9, productivity: 94 },
  },
  {
    code: 'RSCH', name: 'Research', subtitle: 'Riset & Analisis', color: '#7C3AED', bg: 'bg-violet-600', light: '#EDE9FE', icon: '🔬',
    pos: { x: 82, y: 48 },
    desc: 'Riset teknis/pasar, bukti, analisis untuk keputusan.',
    kpi: { tasks: 7, done: 5, productivity: 92 },
  },
  {
    code: 'ANIM', name: 'Animation', subtitle: 'Produksi Animasi', color: '#DB2777', bg: 'bg-pink-600', light: '#FCE7F3', icon: '🎬',
    pos: { x: 16, y: 76 },
    desc: 'Naskah, storyboard, ilustrasi, animasi 2D & editing.',
    kpi: { tasks: 10, done: 6, productivity: 89 },
  },
  {
    code: 'BIZ', name: 'Business', subtitle: 'Strategi & Pemasaran', color: '#059669', bg: 'bg-emerald-600', light: '#D1FAE5', icon: '📈',
    pos: { x: 84, y: 76 },
    desc: 'Strategi produk, pemasaran, distribusi & evaluasi peluang.',
    kpi: { tasks: 6, done: 4, productivity: 91 },
  },
];

export const PROJECTS = [
  { id: 'p1', name: 'AI Education Platform', slug: 'ai-education', status: 'active', priority: 'high', progress: 72, dept: 'TECH', updated: '2 menit lalu', tasks: 12, image: '🎓' },
  { id: 'p2', name: 'Landing Page PVC v1', slug: 'landing-pvc-v1', status: 'active', priority: 'high', progress: 64, dept: 'TECH', updated: '1 jam lalu', tasks: 8, image: '🌐' },
  { id: 'p3', name: 'Animasi Pembuka PVC', slug: 'animasi-pembuka', status: 'review', priority: 'medium', progress: 88, dept: 'ANIM', updated: '5 jam lalu', tasks: 6, image: '🎬' },
  { id: 'p4', name: 'Riset Pasar EduTech 2025', slug: 'riset-edutech', status: 'completed', priority: 'medium', progress: 100, dept: 'RSCH', updated: '1 hari lalu', tasks: 5, image: '📊' },
  { id: 'p5', name: 'Campaign Sosial Media Q2', slug: 'campaign-q2', status: 'planning', priority: 'low', progress: 18, dept: 'BIZ', updated: '2 hari lalu', tasks: 9, image: '📣' },
];

export const TASKS = [
  { id: 't1', project: 'AI Education Platform', title: 'Riset kompetitor bimbel online', status: 'done', priority: 'high', agent: 'Rina Hartono', level: 'green', dept: 'RSCH' },
  { id: 't2', project: 'AI Education Platform', title: 'Desain UI dashboard siswa', status: 'working', priority: 'high', agent: 'Maya Sari', level: 'green', dept: 'ANIM' },
  { id: 't3', project: 'AI Education Platform', title: 'Implementasi auth Supabase + RLS', status: 'working', priority: 'high', agent: 'Chen Wei', level: 'yellow', dept: 'TECH' },
  { id: 't4', project: 'Landing Page PVC v1', title: 'Setup Next.js & kampus 2D interaktif', status: 'review', priority: 'high', agent: 'Chen Wei', level: 'yellow', dept: 'TECH' },
  { id: 't5', project: 'Animasi Pembuka PVC', title: 'Render scene 3 – jembatan lotus', status: 'approval', priority: 'medium', agent: 'Kenji Sato', level: 'red', dept: 'ANIM' },
  { id: 't6', project: 'Animasi Pembuka PVC', title: 'Storyboard episode 1', status: 'done', priority: 'high', agent: 'Maya Sari', level: 'green', dept: 'ANIM' },
  { id: 't7', project: 'Campaign Sosial Media Q2', title: 'Copywriting Instagram carousel', status: 'backlog', priority: 'low', agent: 'Andi Prasetyo', level: 'green', dept: 'BIZ' },
  { id: 't8', project: 'AI Education Platform', title: 'Merge ke production (deploy)', status: 'blocked', priority: 'urgent', agent: 'Chen Wei', level: 'red', dept: 'TECH' },
];

export const ACTIVITIES = [
  { id: 1, text: 'Proyek "AI Education" diperbarui', time: '2 menit lalu', type: 'project', icon: '✅' },
  { id: 2, text: 'Riset pasar selesai', time: '5 menit lalu', type: 'research', icon: '🔵' },
  { id: 3, text: 'Animasi episode 1 dalam proses', time: '7 menit lalu', type: 'anim', icon: '▶️' },
  { id: 4, text: 'Chen Wei menyelesaikan task auth', time: '12 menit lalu', type: 'tech', icon: '💻' },
  { id: 5, text: 'Approval diminta: deploy production', time: '20 menit lalu', type: 'approval', icon: '⚠️' },
];

export const APPROVALS = [
  { id: 'ap1', title: 'Deploy AI Education ke production', requester: 'Chen Wei', level: 'red', status: 'pending', created: '20 menit lalu', detail: 'Merge branch feature/auth ke main & deploy Vercel' },
  { id: 'ap2', title: 'Publish video animasi ke YouTube', requester: 'Kenji Sato', level: 'red', status: 'pending', created: '1 jam lalu', detail: 'Upload animasi pembuka PVC 30 detik' },
];

export function getDeptAgents(code: string) { return AGENTS.filter(a => a.dept === code); }
export function getStatusColor(s: string) {
  const m: Record<string,string> = { idle:'bg-zinc-400', working:'bg-emerald-500', waiting_approval:'bg-amber-500', offline:'bg-zinc-300',
  backlog:'bg-zinc-400', ready:'bg-sky-400', review:'bg-violet-500', approval:'bg-amber-500', done:'bg-emerald-500', blocked:'bg-red-500',
  active:'bg-emerald-500', planning:'bg-zinc-400', completed:'bg-emerald-500', pending:'bg-amber-500', approved:'bg-emerald-500' };
  return m[s] ?? 'bg-zinc-400';
}
