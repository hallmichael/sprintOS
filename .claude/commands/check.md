---
description: Run the full quality gate (backend + frontend + contract)
allowed-tools: Bash
---
Run the complete Definition-of-Done gate and report a concise pass/fail summary per step:
- `cd api && composer test`
- `cd api && composer analyse`
- `cd api && composer arch`
- `cd app && npm run typecheck`
- `cd app && npm run lint`
- `cd app && npm test`
- `./scripts/regen-contract.sh && git diff --exit-code` (contract drift check)
If anything fails, list the failures with file:line and propose fixes. Do not declare done unless all pass.
