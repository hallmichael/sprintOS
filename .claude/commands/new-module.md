---
description: Scaffold a new backend module in the standard anatomy
argument-hint: <ModuleName>
allowed-tools: Read, Glob, Edit, Write, Bash
---
Scaffold module **$1** under `api/app/Modules/$1` using the standard anatomy:
`Http/{Controllers,Requests,Resources}`, `Domain/{Models,Services,Actions,Data}`, `Jobs/`, `Tests/`,
a `$1ServiceProvider.php` (bind the module's Service contracts) and a `routes.php` (registered from `routes/modules`).
Mirror an existing module (e.g. Agents) for conventions. Add a placeholder Service interface and bind it.
Do not add business logic yet — just the skeleton and its registration. Then run `cd api && composer arch`.
