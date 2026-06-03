# sprintOS app (React Native Expo · UI layer)

Screens for the sprintOS frontend, built per Sprint's **Frontend Build Guidelines: UI Only**
(`docs/SPRINT - Component Guide.pdf`). Composed entirely from the **Indi** component library
(Tamagui + Expo Router + react-hook-form + yup). This package is the **UI layer only** —
data wiring, auth and state are handled in Sprint's app on integration.

## Integration (required to run / typecheck)

The Indi component library (`docs/components/`) is **extracted from Sprint's live app** and
depends on that app's substrate (`@/redux`, `@/graphql`, `@/themes`, `@/hooks`, `@/utils`,
plus the Tamagui theme that defines `$button*`/`$container*` tokens). It does **not** compile
standalone. To run these screens:

1. Drop them into Sprint's Indi app (or install the published Indi package) so that
   `@/components` resolves to the real library and the Tamagui theme is registered.
2. `npm install` with versions aligned to that app (see `package.json`).
3. Replace the `MOCK_*` data + `// TODO(api)` markers with the generated `ts-client` calls
   (`packages/ts-client`) via react-query hooks.

## Structure

- `app/` — Expo Router routes (file-based). Route groups: `(auth)`, `(app)/(admin)`,
  `(app)/(user)`. Route files are thin and render a feature screen.
- `src/features/<feature>/screens/*Screen.tsx` — the screens (composed from Indi components,
  with co-located typed mock data + all interactive states).
- `src/components` — where Sprint's Indi library is mounted (`@/components`).
- `src/lib/api` — configured ts-client instance (Sprint wires auth interceptor).

## A note on the component extract

`docs/components/` is an **incomplete snapshot** of the Indi library and lags the Component
Guide in places (e.g. it exports `IndiBadges`/`CreateFormTextInput` factories and a type-only
`IndiColumn`, and `IndiModal` uses `isOpen`/`setIsOpen`). These screens are written against the
**guide's documented public API** (`@/components`: `FormTextInput`, `FormSelect`, `FormCheckbox`,
`IndiTable`/`IndiColumn`, `IndiBadge`, `IndiModal`, …) — the contract Sprint's published package
is expected to satisfy. Where the extract showed a concrete prop shape (e.g. `IndiModal
isOpen/setIsOpen`), the screens use it. Reconcile remaining naming against Sprint's published
Indi version on integration.

## Conventions (from the guide)

- Indi components only; Tamagui tokens only (never hardcoded colours/spacing).
- Every feature ships **both user-type variants** (admin + end-user) and **all states**
  (empty / loading / error / populated / success).
- Forms: react-hook-form + yup via the `Form*` wrappers; success → `Toast`, errors via the
  `error` prop. Mock data is realistic AU data, typed, co-located.
