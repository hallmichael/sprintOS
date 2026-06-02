# ADR 0004: Claude via Bedrock + built-in billing
- Status: Accepted (supersedes the earlier multi-provider direction)
- Context: Sprint hosts every deployment on Sprint's AWS. We want one AI integration, no customer
  key handling, and to monetise AI/usage directly.
- Decision:
  - All AI is Anthropic Claude via Amazon Bedrock, accessed with Sprint's IAM (no customer model keys).
    The `Ai` module's ModelClient is the only path to a model; the interface stays provider-shaped so a
    second provider could be added later, but v1 has exactly one.
  - Billing is built in. The `Usage` module meters every paid third-party call (Claude tokens first,
    plus maps/SMS/email/etc.) recording raw + marked-up cost. The `Billing` module applies the markup
    (default 30%, configurable), captures a card via Stripe (tokenised, no PAN stored), and invoices.
  - Deployments are multi-tenant: one customer can run multiple organisations.
- Consequences: AI metering/markup cannot be bypassed (single gateway); PCI scope is contained to the
  Billing module + processor; margin depends on the markup vs Bedrock list price (reconcile to AWS invoice).
