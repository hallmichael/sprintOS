# sprintOS — Project Structure & Agentic Development Guide

*Laravel API + React Native Expo, with a central orchestration layer.*
*Sprint Digital Pty Ltd · v0.1 DRAFT*

This document defines how the sprintOS codebase is laid out, where the orchestration layer lives and how it is structured, and the conventions that let AI coding agents (and humans) build it reliably. It assumes the architecture from the sprintOS Scope document: Sprint-hosted deployment-per-customer (multi-org), Claude via Amazon Bedrock, built-in usage metering + billing, truly agentic runtime, data lake/RAG on AWS, and a strict Indi/Tamagui frontend.

Key decisions baked in:

- The **orchestration layer is a bounded module inside the Laravel API** — one deployable, simplest operations. Heavy work runs on queues/workers, not in the request cycle.
- The repo is a **monorepo** so the API, app, shared contracts and infra evolve together and an AI agent can see the whole system in one place.
- **All AI is Claude via Amazon Bedrock** on Sprint's AWS account (IAM, no customer model keys). The `Ai` module is the single path to the model.
- **Billing is built in.** The `Usage` and `Billing` modules meter every paid third-party call (Claude/Bedrock tokens first), apply a markup (default 30%) and charge a stored card. Sprint hosts each deployment; deployments are multi-tenant so one customer can run multiple organisations.

---

## 1. Repository layout (monorepo)

```
sprintos/
├─ api/                     # Laravel backend (PHP 8.3)
├─ app/                     # React Native Expo frontend
├─ packages/                # Shared, language-split contracts
│  ├─ contracts-openapi/    # Source-of-truth OpenAPI spec
│  └─ ts-client/            # Generated TypeScript API client + types
├─ infra/                   # Terraform/CDK per-deployment IaC
├─ docs/
│  ├─ adr/                  # Architecture Decision Records
│  └─ runbooks/             # Deploy/onboarding/operator runbooks
├─ .github/workflows/       # CI/CD pipelines
├─ CLAUDE.md                # Root agent instructions (see §6)
├─ AGENTS.md                # Human + agent contributor guide
└─ README.md
```

Why monorepo: the API defines the contract, the app consumes it, and orchestration ties them together. Keeping them together means a change to an endpoint and its consumer land in one reviewable unit, and an AI agent has full context without hopping repos. The API ↔ app boundary is enforced by a **generated** typed client (see §4), not by repo separation.

---

## 2. Laravel backend (`api/`)

### 2.1 Modular, domain-oriented structure

Standard Laravel is organised by *technical type* (all controllers together, all models together). At sprintOS's size that smears each feature across the tree and makes it hard for an agent to reason about one capability. We use **modules** (bounded contexts) under `app/Modules`, each owning its own controllers, services, models, jobs and tests. Cross-module calls go through a module's public service interface only — never another module's internals.

```
api/
├─ app/
│  ├─ Modules/
│  │  ├─ Tenancy/            # organisations, context resolution, BelongsToTenant
│  │  ├─ Identity/           # auth, users, roles, permissions, policies
│  │  ├─ Ai/                 # Claude-via-Bedrock gateway (ModelClient, model tiers)
│  │  ├─ Orchestration/      # THE orchestration layer (see §3)
│  │  ├─ Agents/             # agent definitions, builder API, run history
│  │  ├─ Tools/              # tool registry + tool implementations
│  │  ├─ Crud/               # AI CRUD builder: definitions + dynamic engine
│  │  ├─ DataLake/           # ingestion, connectors, RAG retrieval
│  │  ├─ Usage/              # metering ledger for all paid third-party usage
│  │  ├─ Billing/            # markup, payment (Stripe), invoices, caps
│  │  └─ Connectors/         # OneDrive, Google Drive, SharePoint, ext DB/API
│  ├─ Shared/                # cross-cutting: base classes, DTOs, exceptions
│  └─ Providers/             # Laravel service providers wiring modules
├─ database/
│  ├─ migrations/            # core tables
│  └─ migrations_dynamic/    # CRUD-builder generated migrations
├─ routes/
│  ├─ api.php                # thin: delegates to module route files
│  └─ modules/*.php          # one route file per module
├─ tests/
│  ├─ Unit/  Feature/  Architecture/   # incl. tenant-isolation tests
├─ config/
├─ composer.json
└─ CLAUDE.md                 # backend-specific agent rules
```

### 2.2 Anatomy of a module

Every module follows the *same* internal shape, so an agent learns it once and applies it everywhere:

```
app/Modules/Agents/
├─ Http/
│  ├─ Controllers/          # thin — validate, call service, return resource
│  ├─ Requests/             # FormRequest validation
│  └─ Resources/            # API response shaping
├─ Domain/
│  ├─ Models/               # Eloquent models (tenant-scoped)
│  ├─ Services/             # business logic; the module's public API
│  ├─ Actions/              # single-purpose use cases (one public method)
│  └─ Data/                 # DTOs (spatie/laravel-data)
├─ Jobs/                    # queued work
├─ AgentsServiceProvider.php
├─ routes.php
└─ Tests/
```

Rules that make this agent-friendly:

- **Controllers are thin.** They validate (FormRequest), call one Action/Service, and return a Resource. No business logic in controllers.
- **Actions are single-purpose.** `DeployAgentAction::execute(...)` does one thing. Easy for an agent to write, test and reason about in isolation.
- **A module's public surface is its `Services/` interfaces.** Other modules depend on the interface, bound in the service provider. This is what keeps boundaries real.
- **DTOs at the edges.** Inputs/outputs of services are typed DTOs, not arrays — so contracts are explicit and an agent can't silently pass the wrong shape.

### 2.3 Cross-cutting invariants (enforced, not just documented)

- **Tenant scoping:** every tenant-owned model uses the `BelongsToTenant` trait + global scope. An *architecture test* asserts every model in `Modules/**/Models` either uses the trait or is explicitly allow-listed.
- **All paid third-party calls go through `Usage`'s metering service** (which records raw + marked-up cost). An architecture test forbids direct use of HTTP clients / SDKs outside `Ai`, `Connectors` and `Usage`.
- **No cross-module reaching:** an architecture test forbids importing another module's `Domain` internals; only its `Services` contracts.

(See `tests/Architecture` and §6 for how these are enforced with PHPStan + Pest architecture tests.)

---

## 3. The orchestration layer (`app/Modules/Orchestration`)

The orchestration layer is the brain that "manages everything": it turns an agent's goal into a bounded, observable sequence of model calls and tool calls, and it is the single path through which agents, the LLM gateway, the tool registry, RAG and usage logging come together.

### 3.1 Responsibilities

- Own the **reason–act loop**: plan → call tool → observe → re-plan, bounded by max steps and budget.
- Resolve which **Claude model tier** to use (via `Ai`) for each agent/workload.
- Expose the agent's permitted **tools** (via `Tools`) through Bedrock's tool-use API.
- Enforce **guardrails**: step caps, budget caps, allowed-action lists, human-approval pauses.
- Emit a **trace** of every step and a **usage event** for every model/tool call.
- Support **sub-agents** (an orchestration run can spawn child runs) and **resumability** (pause for approval, resume later).

### 3.2 Internal structure

```
app/Modules/Orchestration/
├─ Domain/
│  ├─ Run/
│  │  ├─ OrchestrationRun.php      # state machine: pending→running→awaiting_approval→done/failed
│  │  ├─ RunStep.php               # one reasoning/tool step (persisted = the trace)
│  │  └─ RunContext.php            # tenant, agent, budget, memory handle
│  ├─ Loop/
│  │  ├─ ReasonActLoop.php         # the core loop (provider-agnostic)
│  │  ├─ Planner.php               # turns goal + state into next action
│  │  └─ StepResult.php
│  ├─ Guardrails/
│  │  ├─ BudgetGuard.php  StepLimitGuard.php  ApprovalGuard.php  ActionAllowList.php
│  └─ Contracts/
│     ├─ Orchestrator.php          # public interface (other modules depend on this)
│     ├─ ToolInvoker.php           # how the loop calls a tool (impl in Tools)
│     └─ ModelClient.php           # how the loop calls Claude (impl in Ai)
├─ Jobs/
│  ├─ RunAgentJob.php              # queued entrypoint (SQS + Horizon)
│  └─ ResumeRunJob.php             # resume after approval/event
├─ Services/
│  └─ OrchestrationService.php     # start/resume/cancel a run; implements Orchestrator
└─ Tests/
```

### 3.3 The key abstraction

The loop depends only on three interfaces, so it is independent of provider, tool and storage:

```php
// ModelClient — implemented by the Ai module (Claude-via-Bedrock driver)
interface ModelClient {
    public function respond(ModelRequest $request): ModelResponse; // supports tool-use
}

// ToolInvoker — implemented by the Tools module (permission-checked dispatch)
interface ToolInvoker {
    public function invoke(ToolCall $call, RunContext $ctx): ToolResult;
}

// Orchestrator — the public entrypoint other modules/controllers use
interface Orchestrator {
    public function start(StartRun $cmd): OrchestrationRun;
    public function resume(string $runId, ResumeInput $input): OrchestrationRun;
}
```

A single run, in pseudocode:

```
loop while not done and within step/budget guards:
    response = ModelClient.respond(prompt + tools + history)   // 1 usage event
    persist RunStep(reasoning, response)                       // trace
    if response has tool calls:
        for each call:
            if ActionAllowList denies or ApprovalGuard requires approval:
                pause run (awaiting_approval) and return
            result = ToolInvoker.invoke(call, ctx)             // maybe more usage events
            persist RunStep(tool call, result)
    else:
        done = true
finalise run, totals rolled into Usage
```

Because the loop only knows interfaces, the *same* code runs an agent on Claude, ChatGPT or a local Llama model, calls a CRUD tool or a RAG tool, and a sub-agent is just a tool whose implementation starts another `OrchestrationRun`.

### 3.4 How the modules connect

```
Controller / Trigger (cron, webhook, manual)
        │  StartRun(agentId, input)
        ▼
OrchestrationService ──► RunAgentJob (queue)
        │
        ▼  ReasonActLoop
   ┌────────────┬─────────────┬──────────────┐
   ▼            ▼             ▼              ▼
 Ai         Tools         Guardrails       Usage
(ModelClient)(ToolInvoker)(budget/approval)(meter+mark up every call)
   │            │
   │            ├─ Crud tools ──► Crud module
   │            ├─ RAG tool  ──► DataLake module
   │            ├─ External  ──► Connectors module
   │            └─ Sub-agent ──► Orchestration (child run)
   ▼
Anthropic Claude via Amazon Bedrock (Sprint AWS)
```

---

## 4. The API ↔ App contract (`packages/`)

The boundary between backend and frontend is a **generated, typed client**, not hand-written fetch calls:

1. The API is the source of truth; it produces an **OpenAPI spec** (`packages/contracts-openapi`) from annotations/tests.
2. CI generates a **TypeScript client + types** (`packages/ts-client`) from that spec.
3. The Expo app imports only the generated client — so types are always in sync and an agent editing an endpoint immediately sees frontend type errors if it breaks the contract.

This is the single most important boundary for safe AI development: it converts "did I break the frontend?" from a runtime surprise into a compile-time error.

---

## 5. React Native Expo frontend (`app/`)

Strictly follows Sprint's *Frontend Build Guidelines: UI Only* — Tamagui tokens, Expo Router, react-hook-form + yup, Indi components only. Organised by **feature**, mirroring backend modules so the same mental model spans the stack.

```
app/
├─ app/                      # Expo Router (file-based routing)
│  ├─ (auth)/                # login, register
│  ├─ (app)/
│  │  ├─ (admin)/            # tenant admin surfaces
│  │  │  ├─ crud-builder/  agents/  datalake/  usage/  billing/  settings.tsx
│  │  ├─ (user)/             # end-user surfaces
│  │  │  ├─ [entity]/        # dynamic CRUD screens
│  │  │  └─ assistant.tsx    # chat with agents
│  │  └─ _layout.tsx
│  └─ _layout.tsx
├─ src/
│  ├─ features/              # one folder per feature (mirrors API modules)
│  │  ├─ agents/             # screens, hooks, queries, types, mock data
│  │  ├─ crud/  datalake/  usage/  billing/  identity/
│  │  │  ├─ screens/         # composed from Indi components
│  │  │  ├─ hooks/           # react-query hooks over the ts-client
│  │  │  ├─ schemas/         # yup schemas
│  │  │  └─ mocks/           # typed mock data (per Sprint guide)
│  ├─ components/            # Indi component library (shared)
│  ├─ lib/
│  │  ├─ api/                # configured ts-client instance, auth interceptor
│  │  ├─ query/              # react-query client
│  │  └─ theme/              # Tamagui config + tokens
│  └─ types/
├─ package.json
└─ CLAUDE.md                 # frontend-specific agent rules
```

Frontend rules (enforced by lint/CI):

- Screens compose **Indi components only**; raw React Native primitives and hardcoded styles are lint errors.
- Data fetching goes through **react-query hooks over the generated `ts-client`** — never raw fetch.
- Every feature ships **both user-type variants** and **all interactive states** (empty/loading/error/populated/success) with typed mock data, per the Sprint guide.

---

## 6. AI agentic development process

The structure above exists so AI coding agents can build sprintOS safely and in parallel. The process makes the *implicit* explicit and machine-checkable.

### 6.1 Context files

- **Root `CLAUDE.md`** — the project's operating manual for agents: architecture summary, the hard rules (tenant scoping, usage logging, module boundaries), how to run tests/lint, and how to add a feature. Loaded automatically by Claude Code.
- **`api/CLAUDE.md` and `app/CLAUDE.md`** — stack-specific rules (module anatomy, Indi-only, contract generation).
- **`AGENTS.md`** — contributor guide for humans and other tools.
- **`docs/adr/`** — Architecture Decision Records. Any non-trivial decision is an ADR an agent can read before changing related code.

### 6.2 Vertical slices, not horizontal layers

Agents build **one capability end-to-end** (migration → model → service → action → controller → route → contract → frontend hook → screen → tests), not "all the controllers". This keeps every change shippable, testable and reviewable, and matches the module boundaries.

### 6.3 Definition of Done (every change must)

- Pass `composer test` (Pest), `npm test`, and the **architecture tests** (tenant scoping, no cross-module reaching, no un-metered third-party calls).
- Pass static analysis: **PHPStan/Larastan** (high level) and **TypeScript strict** + ESLint.
- Regenerate the OpenAPI spec and `ts-client` if the API surface changed (CI fails if they drift).
- Include tests for the new behaviour, including a **negative tenant-isolation test** where relevant.
- Touch only the relevant module(s); cross-module changes go through service contracts.

### 6.4 Guardrails that catch AI mistakes early

| Risk when agents code | Guardrail |
|---|---|
| Forgetting tenant scoping | Architecture test asserts `BelongsToTenant` on every model |
| Bypassing usage logging | Architecture test bans HTTP/SDK use outside allowed modules |
| Breaking the frontend contract | Generated `ts-client` + TS strict → compile error |
| Reaching into another module | Architecture test bans non-`Services` imports across modules |
| Hardcoded styles / non-Indi UI | ESLint rule + PR check |
| Schema drift | CI regenerates spec/client and fails on diff |
| Silent scope creep in a PR | Vertical-slice rule + small-PR convention |

### 6.5 Agent workflow loop

```
read CLAUDE.md + relevant ADRs/module
  → write/adjust tests first (red)
  → implement the vertical slice
  → run tests + static analysis + arch tests locally
  → regenerate contract if API changed
  → open PR; CI re-runs the full gate
  → human review focuses on intent, not mechanics
```

### 6.6 CI gate (`.github/workflows`)

Backend: `composer install` → Pest → Larastan → architecture tests.
Frontend: `npm ci` → tsc --noEmit → ESLint → jest.
Contract: regenerate OpenAPI + ts-client → fail if working tree changes.
Only a green gate merges. This is what lets multiple agents work concurrently without stepping on each other.

---

## 7. Build order

Follow the phased plan from the Build Guide, but always as vertical slices: stand up `Tenancy` + `Identity` first (every other module depends on tenant context and auth), then `Ai` (Bedrock) + `Usage` + `Billing` + `Orchestration` together (the spine, so metering and markup exist before anything spends money), then `Tools`, then `Crud`, `DataLake`, `Agents`, and finally `Connectors` and hardening. Each module is "done" only when its slice reaches a screen in the app and passes the full gate.
