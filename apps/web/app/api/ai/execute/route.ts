import { NextRequest, NextResponse } from 'next/server';
import { ModelRouter, type Provider } from '@pvc/model-router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ROLES: Record<string, string> = {
  aiko: 'You are Aiko Tanaka, PVC AI CEO. Set direction, clarify goals, and make concise executive decisions.',
  budi: 'You are Budi Santoso, PVC Project Manager. Break work into deliverables, owners, dependencies, and acceptance criteria.',
  chen: 'You are Chen Wei, Fullstack Developer. Produce technically sound implementation plans and code-focused analysis.',
  siti: 'You are Siti QA, PVC Quality Assurance. Find defects, test assumptions, and report pass/fail with evidence.',
  rina: 'You are Rina Hartono, PVC Researcher. Distinguish verified facts from assumptions; never invent sources.',
  david: 'You are David Kim, PVC Analyst. Analyze evidence, quantify tradeoffs, and explain uncertainty.',
  maya: 'You are Maya Sari, Storyboard Artist. Create visual concepts, scenes, and storyboard directions.',
  kenji: 'You are Kenji Sato, 2D Animator. Convert creative briefs into animation plans, timing, and asset specifications.',
  lisa: 'You are Lisa Wijaya, Strategist. Develop positioning, audience, messaging, and measurable strategy.',
  andi: 'You are Andi Prasetyo, Marketing. Create clear marketing content without unsupported claims.',
};

export async function GET() {
  const providers = { gemini: Boolean(process.env.GEMINI_API_KEY), groq: Boolean(process.env.GROQ_API_KEY), openrouter: Boolean(process.env.OPENROUTER_API_KEY) };
  return NextResponse.json({ ok: true, mode: 'free-first', providers, readyProviders: Object.values(providers).filter(Boolean).length, note: 'Memeriksa konfigurasi key, bukan sisa kuota provider.' });
}

export async function POST(req: NextRequest) {
  const secret = process.env.PVC_AI_API_SECRET;
  if (!secret) return NextResponse.json({ error: 'PVC_AI_API_SECRET belum dikonfigurasi.' }, { status: 503 });
  if (req.headers.get('authorization') !== `Bearer ${secret}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const agentId = typeof body.agentId === 'string' ? body.agentId : '';
    const instruction = typeof body.instruction === 'string' ? body.instruction.trim() : '';
    if (!ROLES[agentId]) return NextResponse.json({ error: 'agentId tidak dikenal.' }, { status: 400 });
    if (!instruction || instruction.length > 12000) return NextResponse.json({ error: 'Instruction wajib diisi (maksimal 12.000 karakter).' }, { status: 400 });
    const preferredProvider = ['gemini','groq','openrouter'].includes(body.preferredProvider) ? body.preferredProvider as Provider : undefined;
    const result = await new ModelRouter({ freeOnly: true }).complete([
      { role: 'system', content: `${ROLES[agentId]}\nYou are an employee of PVC Virtual Company. Work only on the assigned task. Never claim to browse, use tools, or verify facts unless evidence is supplied. Reply in Indonesian unless asked otherwise.` },
      { role: 'user', content: instruction },
    ], { preferredProvider, maxOutputTokens: 3000, timeoutMs: 45000 });
    return NextResponse.json({ ok: true, agentId, output: result.content, provider: result.provider, model: result.model, usage: result.tokens, attempts: result.attempts, status: 'completed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI execution failed';
    const paused = message.includes('NO_FREE_PROVIDER') || message.includes('ALL_FREE_PROVIDERS_FAILED');
    return NextResponse.json({ error: message, status: paused ? 'paused' : 'failed' }, { status: paused ? 503 : 502 });
  }
}
