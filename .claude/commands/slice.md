---
description: Build one capability end-to-end as a vertical slice
argument-hint: <module> <short description of the capability>
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---
Build a vertical slice for module **$1**: $2

Work in this order, staying within the module where possible:
1. Read `CLAUDE.md`, `api/CLAUDE.md`, the module's existing code, and any relevant ADR in `docs/adr`.
2. Use the **test-author** subagent to write failing tests first (include a negative tenant-isolation test if data is involved).
3. Implement the slice: migration → model (BelongsToTenant) → service/action → thin controller → route → API resource.
4. If the API surface changed, use the **contract-syncer** subagent to regenerate the contract.
5. Build the frontend side: react-query hook over the ts-client → screen composed from Indi components (both user types, all states) with typed mock fallback.
6. Use the **tenant-isolation-reviewer** subagent to review.
7. Run `/check`. Do not finish until it is green.
Keep the change small and reviewable.
