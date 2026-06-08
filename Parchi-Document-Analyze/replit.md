# Parchi پرچی

An AI-powered prescription and medical test report companion for Pakistani patients. Upload a prescription photo and get each medicine explained in plain Urdu, with generic price alternatives and an evidence layer. Upload a lab report and get each value color-coded with bilingual explanations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/parchi run dev` — run the frontend (Vite)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `GEMINI_API_KEY` — Google Gemini API key (user-supplied, not Replit AI Integrations)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Framer Motion + wouter (routing)
- API: Express 5
- AI: Google Gemini 2.5 Flash via `@google/genai` (custom client, NOT Replit AI Integrations)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Fonts: Fraunces (titles), Lexend (UI), Noto Nastaliq Urdu (Urdu text), JetBrains Mono (values/prices)

## Where things live

- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/api-client-react/src/generated/` — generated React Query hooks + TypeScript types (do not edit)
- `artifacts/api-server/src/routes/prescription.ts` — prescription analysis route
- `artifacts/api-server/src/routes/testreport.ts` — test report analysis route
- `artifacts/api-server/src/lib/gemini.ts` — custom Gemini Vision client
- `artifacts/parchi/src/pages/` — Home, Prescription, TestReport pages
- `artifacts/parchi/src/components/` — MedicineCard, TestValueCard, EvidenceLayer, GenericAlternatives, ScheduleView, UploadArea, Disclaimer

## Architecture decisions

- **Stateless by design**: images are processed and discarded per-request; no database needed
- **Custom Gemini client**: uses `@google/genai` directly with `GEMINI_API_KEY` — Replit AI Integrations Gemini requires `AI_INTEGRATIONS_GEMINI_BASE_URL` which is not available on the free tier
- **Base64 upload**: prescription/report images are read as base64 in the browser and sent via JSON body (no multipart/form-data needed)
- **Contract-first API**: OpenAPI spec → Orval codegen → typed hooks; server validates with Zod schemas
- **Gemini model**: `gemini-2.5-flash` with `responseMimeType: "application/json"` for structured JSON responses

## Product

- **Prescription scan**: Upload a photo → Gemini reads medicines → explains each in bilingual English/Urdu with timing, food instructions, warnings, side effects, evidence strength, WHO badges, and generic price alternatives in PKR
- **Test report scan**: Upload a lab report → each value color-coded (Normal/High/Low/Borderline/Urgent) with bilingual explanations and doctor questions
- **Bilingual throughout**: English + Urdu (Noto Nastaliq Urdu, RTL) on every screen
- **Safety-first**: Prominent disclaimer on every page; evidence layer never frames information as "question your doctor"

## User preferences

- App name: Parchi (پرچی)
- Target users: Pakistani patients, primary language Urdu
- No database — fully stateless (privacy-first)

## Gotchas

- Do NOT use `lib/integrations-gemini-ai/src/client.ts` — it requires `AI_INTEGRATIONS_GEMINI_BASE_URL` which is unset. Always use `artifacts/api-server/src/lib/gemini.ts`.
- `@google/genai` must be installed in `artifacts/api-server` (not root) — it was added explicitly.
- Import types from `@workspace/api-client-react` (the barrel), not from the `/src/generated/` subpath.
- `TestValue.doctor_question` is the English field (not `doctor_question_english`).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
