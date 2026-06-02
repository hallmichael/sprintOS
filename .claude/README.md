# .claude/ — how Claude Code is set up to build sprintOS

- `settings.json` — shared project settings: permission allow/deny lists and hooks
  (auto-format on edit; reminder to run the gate on stop). Personal overrides go in
  `settings.local.json` (gitignored).
- `agents/` — subagents Claude can delegate to (reviewers + helpers).
- `commands/` — slash commands encoding the build workflow (/slice, /new-module, /check, /adr).
- Repo `CLAUDE.md` (root + api/ + app/) carries the hard rules into every session.
- `../.mcp.json` — MCP servers (DB, GitHub, AWS docs) for real context.

Tip: build in vertical slices with `/slice`, then `/check` before finishing. The subagents
keep the main thread focused and enforce tenant-scoping/boundary rules on every change.
