# app/ — React Native Expo frontend rules

- Tamagui tokens only ($textPrimary, $4, etc.) — never hardcoded colours/spacing.
- Expo Router (file-based) under `app/`. No React Navigation.
- Compose screens from Indi components in `src/components`. No raw RN primitives, no other UI lib.
- Forms: react-hook-form + yup via the Form* Indi wrappers.
- Data: react-query hooks in `src/features/<feature>/hooks` over the generated `lib/api` client.
- Every feature: both user-type variants + all states (empty/loading/error/populated/success) + typed mocks.
