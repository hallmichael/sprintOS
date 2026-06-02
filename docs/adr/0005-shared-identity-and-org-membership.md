# ADR 0005: Shared user identity + per-org membership

- Status: Accepted
- Supersedes: the one-user-per-org assumption baked into Phase 1.1–1.5.

## Context
A sprintOS deployment is multi-tenant: one customer can run several organisations.
Build Guide 1.5 requires an *"org switcher UI for users with access to several"* orgs.
The original Phase 1 model pinned each user to exactly one org via `users.tenant_id`,
and SSO provisioned a **separate** user row per (org, email). That makes a single human
who belongs to two orgs into two unrelated identities — no shared login, no switcher.

## Decision
Move to a **shared global identity + membership** model.

1. **Global identity.** `users` has no `tenant_id`; email is globally unique within the
   deployment. A user is NOT a tenant-owned model (it is not deleted with any one org),
   so it does **not** use `BelongsToTenant` and is allow-listed in the architecture test.

2. **Membership pivot.** A `tenant_user` table (`tenant_id`, `user_id`, `role`,
   unique `(tenant_id, user_id)`) records which orgs a user belongs to and their role
   **within that org**. Represented by the `Membership` model. Because a membership must
   be queryable across orgs for a given user, it is also not `BelongsToTenant`-scoped
   (allow-listed); all membership queries scope tenant explicitly.

3. **Two RBAC layers, deliberately separated:**
   - **Deployment-level / global** roles live in `spatie/laravel-permission` (guard `web`,
     no teams). The only such role today is `platform-admin` — the cross-org super-admin.
     This layer is where future *permission* management (Scope §2.1) will grow.
   - **Org-level** roles (`admin` / `member` / `viewer`) live on the `tenant_user.role`
     column — they are an attribute of the membership, scoped to one org.

4. **Active org resolution.** Each request's active org comes from the `X-Tenant-ID`
   header, **validated against the caller's memberships**:
   - regular user → header must be an org they belong to; otherwise their default
     (first) membership is used. They can never select an org they don't belong to.
   - platform-admin → may "act as" ANY org via the header (support/management).
   - anonymous → no context.
   The active org drives the `BelongsToTenant` global scope for all owned resources.

5. **Provisioning.** Register and SSO now find-or-create the global user by email, then
   ensure a `Membership` exists for the target org (default role `member`). The same
   email across two orgs is one identity with two memberships.

## Consequences
- Email is unique per deployment, not per org.
- `/api/auth/me` and the login/SSO responses return the user's memberships + active org.
- Org-scoped admin gating uses a `tenant.role:admin` middleware (active-membership role),
  not spatie's `role:` middleware (which now only guards the global `platform-admin`).
- Switching orgs is stateless: the client changes the `X-Tenant-ID` header; no re-login.
- A future hardening option is to bind the active org to the Sanctum token instead of a
  header; deferred — the header is validated against memberships so it cannot be spoofed.
