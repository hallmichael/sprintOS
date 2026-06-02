# ADR 0003: The API↔App boundary is a generated typed client
- Status: Accepted
- The API emits an OpenAPI spec (`packages/contracts-openapi`); CI generates `packages/ts-client`.
  The app imports only the generated client. Breaking the contract becomes a compile-time error,
  which is the key safety net for AI-driven changes. The generated client is never hand-edited.
