# sprintOS
Monorepo: `api/` (Laravel), `app/` (Expo), `packages/` (contracts + generated TS client),
`infra/` (Terraform/CDK), `docs/` (ADRs + runbooks). See `CLAUDE.md` for the operating manual
and `docs/` for architecture.

## Building with Claude Code
`.claude/` configures Claude Code as the build tool: subagents (reviewers), slash commands
(`/slice`, `/new-module`, `/check`, `/adr`), permission rules and hooks. `.mcp.json` connects
Claude to GitHub and a dev MySQL (set `GITHUB_TOKEN` and `SPRINTOS_DEV_MYSQL_DSN`). See `.claude/README.md`.
Adjust MCP servers to your stack; check https://docs.claude.com for current config formats.
