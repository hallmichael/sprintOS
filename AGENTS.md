# Contributing (humans & agents)

This repo is built in vertical slices behind a strict CI gate. Read `CLAUDE.md` first.
- One feature = one module slice, end-to-end, behind a small PR.
- Cross-module work goes through `Services/` contracts only.
- Decisions are recorded as ADRs in `docs/adr/`.
- The API↔App boundary is the generated `packages/ts-client`; never edit it by hand.
