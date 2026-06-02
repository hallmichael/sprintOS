# ADR 0002: Orchestration lives as a Laravel module
- Status: Accepted
- Context: sprintOS needs an orchestration layer to run agents (reason-act loop, tools, guardrails).
- Decision: implement it as a bounded module `app/Modules/Orchestration` inside the Laravel API,
  running on queues/workers — one deployable, simplest ops. The loop depends only on the
  `ModelClient`, `ToolInvoker` and `Orchestrator` contracts, so it stays provider/tool agnostic
  and could be extracted into a separate service later without changing callers.
- Consequences: no language split; heavy work must be queued (never in a web request).
