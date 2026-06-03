import { Container, IndiCard, IndiH1, IndiH3, IndiText, IndiXStack, IndiYStack, LoadingContainer } from '@/components';
import { IndiColumn, IndiTable } from '@/components';

// -- Types --
interface ServiceRollup {
  service: string;
  quantity: number;
  billable: number;
}

interface UsageEvent {
  id: string;
  service: string;
  operation: string;
  unit: string;
  quantity: number;
  billableCost: number;
  createdAt: string;
}

// -- Mock Data (Sprint Digital will replace — GET /api/usage/summary + /events) --
const MOCK_ROLLUP: ServiceRollup[] = [
  { service: 'bedrock', quantity: 248_300, billable: 178.94 },
  { service: 'maps', quantity: 1_204, billable: 4.18 },
  { service: 'sms', quantity: 92, billable: 1.2 },
];

const MOCK_EVENTS: UsageEvent[] = [
  { id: '1', service: 'bedrock', operation: 'chat', unit: 'input_tokens', quantity: 1240, billableCost: 0.0048, createdAt: '2026-06-03 09:14' },
  { id: '2', service: 'bedrock', operation: 'chat', unit: 'output_tokens', quantity: 612, billableCost: 0.0119, createdAt: '2026-06-03 09:14' },
  { id: '3', service: 'bedrock', operation: 'embed', unit: 'input_tokens', quantity: 8400, billableCost: 0.0002, createdAt: '2026-06-03 08:51' },
];

type ScreenState = 'populated' | 'loading' | 'empty';
const SCREEN_STATE: ScreenState = 'populated';

const totalBillable = MOCK_ROLLUP.reduce((sum, r) => sum + r.billable, 0);

export default function UsageScreen() {
  const eventColumns: IndiColumn<UsageEvent>[] = [
    { title: 'When', dataIndex: 'createdAt' },
    { title: 'Service', dataIndex: 'service' },
    { title: 'Operation', dataIndex: 'operation' },
    { title: 'Unit', dataIndex: 'unit' },
    { title: 'Qty', dataIndex: 'quantity' },
    { title: 'Billable', dataIndex: 'billableCost', render: (_v, e) => `$${e.billableCost.toFixed(4)}` },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Usage</IndiH1>

        {SCREEN_STATE === 'loading' && <LoadingContainer />}

        {SCREEN_STATE === 'empty' && (
          <IndiCard padding="$6" alignItems="center">
            <IndiText color="$textSecondary">No usage recorded yet this period.</IndiText>
          </IndiCard>
        )}

        {SCREEN_STATE === 'populated' && (
          <>
            <IndiCard padding="$4" gap="$1">
              <IndiText color="$textSecondary">Billable this period</IndiText>
              <IndiH3>AUD ${totalBillable.toFixed(2)}</IndiH3>
            </IndiCard>

            <IndiH3>By service</IndiH3>
            <IndiXStack gap="$4" flexWrap="wrap">
              {MOCK_ROLLUP.map((r) => (
                <IndiCard key={r.service} flex={1} minWidth={180} padding="$4" gap="$1">
                  <IndiText color="$textSecondary">{r.service}</IndiText>
                  <IndiText color="$textPrimary" fontWeight="600">
                    AUD ${r.billable.toFixed(2)}
                  </IndiText>
                  <IndiText color="$textNeutral">{r.quantity.toLocaleString()} units</IndiText>
                </IndiCard>
              ))}
            </IndiXStack>

            <IndiH3>Recent events</IndiH3>
            <IndiTable data={MOCK_EVENTS} columns={eventColumns} />
          </>
        )}
      </IndiYStack>
    </Container>
  );
}
