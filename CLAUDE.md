# sprintOS — Agent Operating Manual

You are working in the sprintOS monorepo: a Laravel API (`api/`), a React Native Expo app (`app/`),
shared contracts (`packages/`), and infra (`infra/`). sprintOS is a truly agentic, Claude-powered,
Sprint-hosted, deployment-per-customer (multi-org) business operating system with built-in billing.

## Hard rules (never violate)
1. **Tenant/org scoping** — every tenant-owned Eloquent model uses the `BelongsToTenant` trait. Never
   query tenant data without the global scope. Architecture tests enforce this.
2. **AI = Claude via Bedrock only** — all model calls go through the `Ai` module's ModelClient
   (Bedrock, Sprint IAM, no customer keys). Never call a model SDK directly elsewhere.
3. **Meter + bill every paid call** — every paid third-party call (Claude/Bedrock tokens, maps, SMS,
   email, etc.) goes through the `Usage` metering service, which records raw + marked-up (default 30%)
   cost. Direct HTTP/SDK calls are only allowed in `Ai`, `Connectors`, `Usage`.
4. **Module boundaries** — call other modules only via their `Services/` contracts. Never import
   another module's `Domain` internals.
5. **The contract is generated** — change an endpoint, then regenerate the OpenAPI spec + ts-client.
   Do not hand-edit `packages/ts-client`.
6. **Frontend = Indi only** — compose screens from `src/components` (Indi) + Tamagui tokens. No raw
   RN primitives, no hardcoded styles, no other form/UI lib. Data via react-query over the ts-client.

## How to add a feature (vertical slice)
migration → model → service/action → controller → route → contract regen → frontend hook → screen → tests.
Build one capability end-to-end. Keep PRs small and within one module where possible.

## Definition of Done
- `cd api && composer test` (Pest), Larastan, and `tests/Architecture` all pass.
- `cd app && npx tsc --noEmit && npm test && npm run lint` pass.
- Contract regenerated if the API changed (CI fails on drift).
- New behaviour has tests, including a negative tenant-isolation test where relevant.

## Where things live
- Orchestration runtime: `api/app/Modules/Orchestration` (see ADR 0002).
- AI gateway (Claude/Bedrock): `api/app/Modules/Ai`.  Tools: `api/app/Modules/Tools`.
- Metering: `api/app/Modules/Usage`.  Billing/markup/payments: `api/app/Modules/Billing`.
- Read `docs/adr/` before changing related architecture (incl. ADR 0004 on Bedrock + billing).
