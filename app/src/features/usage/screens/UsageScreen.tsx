import { Container, IndiCard, IndiColumn, IndiH1, IndiH3, IndiTable, IndiText, IndiXStack, IndiYStack, LoadingContainer } from '@/components';
import { api } from '@/lib/api/client';
import { useEffect, useState } from 'react';

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

// -- Mock fallback (used when the API is unreachable) --
const MOCK_ROLLUP: ServiceRollup[] = [
  { service: 'bedrock', quantity: 248_300, billable: 178.94 },
  { service: 'maps', quantity: 1_204, billable: 4.18 },
];
const MOCK_EVENTS: UsageEvent[] = [
  { id: '1', service: 'bedrock', operation: 'chat', unit: 'input_tokens', quantity: 1240, billableCost: 0.0048, createdAt: '2026-06-03 09:14' },
];

export default function UsageScreen() {
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('AUD');
  const [billable, setBillable] = useState<number | null>(null);
  const [rollup, setRollup] = useState<ServiceRollup[]>([]);
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const summary = await api.get<{ currency: string; billable: number; by_service: Record<string, { billable: number; quantity: number }> }>('/usage/summary');
        const evs = await api.get<{ data: any[] }>('/usage/events');
        setCurrency(summary.currency ?? 'AUD');
        setBillable(summary.billable ?? 0);
        setRollup(Object.entries(summary.by_service ?? {}).map(([service, v]) => ({ service, billable: v.billable, quantity: v.quantity })));
        setEvents((evs.data ?? []).map((e) => ({
          id: e.id, service: e.service, operation: e.operation, unit: e.unit,
          quantity: Number(e.quantity), billableCost: Number(e.billable_cost), createdAt: String(e.created_at ?? '').replace('T', ' ').slice(0, 16),
        })));
        setLive(true);
      } catch {
        setRollup(MOCK_ROLLUP);
        setEvents(MOCK_EVENTS);
        setBillable(MOCK_ROLLUP.reduce((s, r) => s + r.billable, 0));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
        <IndiH1>Usage {live ? '· live' : ''}</IndiH1>

        {loading ? (
          <LoadingContainer />
        ) : events.length === 0 ? (
          <IndiCard padding="$6" alignItems="center">
            <IndiText color="$textSecondary">No usage recorded yet — try the Assistant, then come back.</IndiText>
          </IndiCard>
        ) : (
          <>
            <IndiCard padding="$4" gap="$1">
              <IndiText color="$textSecondary">Billable this period</IndiText>
              <IndiH3>{currency} ${(billable ?? 0).toFixed(currency === 'AUD' ? 4 : 2)}</IndiH3>
            </IndiCard>

            <IndiH3>By service</IndiH3>
            <IndiXStack gap="$4" flexWrap="wrap">
              {rollup.map((r) => (
                <IndiCard key={r.service} flex={1} minWidth={180} padding="$4" gap="$1">
                  <IndiText color="$textSecondary">{r.service}</IndiText>
                  <IndiText color="$textPrimary" fontWeight="600">{currency} ${r.billable.toFixed(4)}</IndiText>
                  <IndiText color="$textNeutral">{r.quantity.toLocaleString()} units</IndiText>
                </IndiCard>
              ))}
            </IndiXStack>

            <IndiH3>Recent events</IndiH3>
            <IndiTable data={events} columns={eventColumns} />
          </>
        )}
      </IndiYStack>
    </Container>
  );
}
