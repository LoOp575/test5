# PVC Multi-AI Runtime (Free-First)

This change adds real server-side provider calls without changing the existing campus/dashboard UI.

## Providers
- Gemini API: `GEMINI_API_KEY`, default model `gemini-2.0-flash`.
- Groq API: `GROQ_API_KEY`, default model `llama-3.3-70b-versatile`.
- OpenRouter: `OPENROUTER_API_KEY`, default model `openrouter/free`.

The router tries the preferred provider first, then Gemini, Groq, and OpenRouter. Provider errors (including rate-limit/quota errors) trigger fallback. If all configured providers fail, the request is paused. There is no paid fallback. Free model availability and quotas can change.

## Vercel setup
Add at least one provider key and `PVC_AI_API_SECRET` in Vercel Environment Variables. Optional overrides: `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`, `APP_BASE_URL`. Redeploy after changing variables. Never use `NEXT_PUBLIC_*` for secrets or commit real keys.

## API
- `GET /api/ai/execute`: reports configured providers only; it cannot see remaining quota.
- `POST /api/ai/execute`: requires `Authorization: Bearer <PVC_AI_API_SECRET>`.

Body:
```json
{ "agentId": "rina", "instruction": "Buat ringkasan riset tentang ...", "preferredProvider": "gemini" }
```
Supported IDs: `aiko`, `budi`, `chen`, `siti`, `rina`, `david`, `maya`, `kenji`, `lisa`, `andi`.

This is the first real-runtime slice: one named employee can call a real model. It does not yet persist tasks/runs to Supabase, coordinate agent handoffs, connect the dashboard controls, or publish external content. Those integrations remain separate follow-up work. External actions must stay behind Owner approval.

## Smoke test
1. Set one or more provider keys and `PVC_AI_API_SECRET` in Vercel.
2. Redeploy.
3. GET `/api/ai/execute`; confirm `readyProviders >= 1`.
4. POST with the bearer secret and a supported `agentId`.
5. Confirm a non-empty output and the actual provider/model in the response.
