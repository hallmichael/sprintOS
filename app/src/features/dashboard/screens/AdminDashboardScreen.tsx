import { Container, IndiCard, IndiH1, IndiH3, IndiParagraph, IndiText, IndiXStack, IndiYStack } from '@/components';
import { IndiButton } from '@/components/buttons';
import { router } from 'expo-router';

// -- Types --
interface SpendSummary {
  currency: string;
  billable: number;
  unbilled: number;
  alerting: boolean;
}

interface AdminTile {
  title: string;
  description: string;
  href: string;
}

// -- Mock Data (Sprint Digital will replace with API calls) --
// GET /api/billing/settings + /api/usage/summary
const MOCK_SPEND: SpendSummary = {
  currency: 'AUD',
  billable: 184.32,
  unbilled: 42.18,
  alerting: false,
};

const ADMIN_TILES: AdminTile[] = [
  { title: 'Organisations', description: 'Manage orgs in this deployment', href: '/(app)/(admin)/organisations' },
  { title: 'Users & roles', description: 'Invite users, set roles', href: '/(app)/(admin)/users' },
  { title: 'Billing', description: 'Usage, invoices and card', href: '/(app)/(admin)/billing' },
  { title: 'AI assistant', description: 'Chat with Claude', href: '/(app)/(admin)/assistant' },
  { title: 'Tools', description: 'Register agent tools', href: '/(app)/(admin)/tools' },
  { title: 'Setup wizard', description: 'Configure this deployment', href: '/(app)/(admin)/setup' },
];

const money = (n: number, currency: string) => `${currency} $${n.toFixed(2)}`;

export default function AdminDashboardScreen() {
  const spend = MOCK_SPEND;

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Dashboard</IndiH1>

        {/* Spend summary */}
        <IndiXStack gap="$4" flexWrap="wrap">
          <IndiCard flex={1} minWidth={220} padding="$4" gap="$1">
            <IndiText color="$textSecondary">Billable this period</IndiText>
            <IndiH3>{money(spend.billable, spend.currency)}</IndiH3>
          </IndiCard>
          <IndiCard flex={1} minWidth={220} padding="$4" gap="$1">
            <IndiText color="$textSecondary">Unbilled usage</IndiText>
            <IndiH3 color={spend.alerting ? '$Red500' : '$textPrimary'}>{money(spend.unbilled, spend.currency)}</IndiH3>
          </IndiCard>
        </IndiXStack>

        {/* Quick links */}
        <IndiH3>Manage</IndiH3>
        <IndiXStack gap="$4" flexWrap="wrap">
          {ADMIN_TILES.map((tile) => (
            <IndiCard key={tile.href} width="100%" $gtMd={{ width: '48%' }} $gtLg={{ width: '31%' }} padding="$4" gap="$2">
              <IndiH3>{tile.title}</IndiH3>
              <IndiParagraph color="$textSecondary">{tile.description}</IndiParagraph>
              <IndiButton type="outline" color="primary" size="sm" handlePress={() => router.push(tile.href)}>
                Open
              </IndiButton>
            </IndiCard>
          ))}
        </IndiXStack>
      </IndiYStack>
    </Container>
  );
}
