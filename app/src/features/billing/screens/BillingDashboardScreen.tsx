import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiH3,
  IndiModal,
  IndiText,
  IndiXStack,
  IndiYStack,
  Toast,
} from '@/components';
import { FormTextInput } from '@/components/forms';
import { IndiColumn, IndiTable } from '@/components';
import { api } from '@/lib/api/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
type InvoiceStatus = 'open' | 'paid' | 'failed' | 'void';

interface Invoice {
  id: string;
  number: string;
  periodStart: string;
  periodEnd: string;
  total: number;
  currency: string;
  status: InvoiceStatus;
}

interface Card {
  brand: string;
  last4: string;
}

interface AddCardForm {
  paymentMethodId: string;
}

// -- Mock Data (Sprint Digital will replace — GET /api/billing/settings + /invoices) --
const MOCK_CARD: Card | null = { brand: 'visa', last4: '4242' };
const MOCK_CURRENT_SPEND = 184.32;

const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'INV-202605-0001', periodStart: '2026-05-01', periodEnd: '2026-05-31', total: 142.1, currency: 'AUD', status: 'paid' },
  { id: '2', number: 'INV-202606-0001', periodStart: '2026-06-01', periodEnd: '2026-06-30', total: 184.32, currency: 'AUD', status: 'open' },
  { id: '3', number: 'INV-202604-0001', periodStart: '2026-04-01', periodEnd: '2026-04-30', total: 98.0, currency: 'AUD', status: 'failed' },
];

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  paid: '$Green500',
  open: '$Blue500',
  failed: '$Red500',
  void: '$Neutral200',
};

const schema = yup.object({
  paymentMethodId: yup.string().required('Enter the tokenised payment method id'),
});

const mapInvoice = (i: any): Invoice => ({
  id: i.id, number: i.number, periodStart: i.period_start, periodEnd: i.period_end,
  total: Number(i.total), currency: i.currency, status: i.status,
});

export default function BillingDashboardScreen() {
  const [cardOpen, setCardOpen] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [currency, setCurrency] = useState('AUD');
  const [currentSpend, setCurrentSpend] = useState(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const load = async () => {
    try {
      const s = await api.get<{ settings: any; current_spend: number }>('/billing/settings');
      setCard(s.settings?.card ?? null);
      setCurrency(s.settings?.currency ?? 'AUD');
      setCurrentSpend(s.current_spend ?? 0);
      const inv = await api.get<{ data: any[] }>('/billing/invoices');
      setInvoices((inv.data ?? []).map(mapInvoice));
    } catch {
      setCard(MOCK_CARD);
      setCurrentSpend(MOCK_CURRENT_SPEND);
      setInvoices(MOCK_INVOICES);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const { control, handleSubmit, reset } = useForm<AddCardForm>({
    resolver: yupResolver(schema),
    defaultValues: { paymentMethodId: '' },
  });

  const onAddCard = async (data: AddCardForm) => {
    try {
      await api.post('/billing/card', { payment_method_id: data.paymentMethodId });
      Toast.success({ message: 'Card saved' });
      reset();
      setCardOpen(false);
      load();
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Could not save card' });
    }
  };

  const onGenerate = async () => {
    try {
      const res = await api.post<any>('/billing/invoices/generate');
      Toast.success({ message: res?.number ? `Generated ${res.number}` : 'No unbilled usage this period' });
      load();
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Generate failed' });
    }
  };

  const onCharge = async (invoice: Invoice) => {
    try {
      const res = await api.post<any>(`/billing/invoices/${invoice.id}/charge`);
      Toast[res?.status === 'paid' ? 'success' : 'error']({ message: `${invoice.number}: ${res?.status}` });
      load();
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Charge failed' });
    }
  };

  const columns: IndiColumn<Invoice>[] = [
    { title: 'Invoice', dataIndex: 'number' },
    { title: 'Period', dataIndex: 'periodStart', render: (_v, inv) => `${inv.periodStart} → ${inv.periodEnd}` },
    { title: 'Total', dataIndex: 'total', render: (_v, inv) => `${inv.currency} $${inv.total.toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', render: (_v, inv) => <IndiBadge color={STATUS_COLOR[inv.status]}>{inv.status}</IndiBadge> },
    {
      title: '',
      dataIndex: 'id',
      render: (_v, inv) =>
        inv.status === 'open' || inv.status === 'failed' ? (
          <IndiButton type="ghost" color="primary" size="sm" handlePress={() => onCharge(inv)}>
            Charge
          </IndiButton>
        ) : null,
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Billing</IndiH1>

        <IndiXStack gap="$4" flexWrap="wrap">
          <IndiCard flex={1} minWidth={220} padding="$4" gap="$1">
            <IndiText color="$textSecondary">Current period spend</IndiText>
            <IndiH3>{currency} ${currentSpend.toFixed(4)}</IndiH3>
          </IndiCard>

          <IndiCard flex={1} minWidth={220} padding="$4" gap="$2">
            <IndiText color="$textSecondary">Payment method</IndiText>
            {card ? (
              <IndiText color="$textPrimary">
                {card.brand.toUpperCase()} •••• {card.last4}
              </IndiText>
            ) : (
              <IndiText color="$Red500">No card on file</IndiText>
            )}
            <IndiButton type="outline" color="primary" size="sm" handlePress={() => setCardOpen(true)}>
              {card ? 'Update card' : 'Add card'}
            </IndiButton>
          </IndiCard>
        </IndiXStack>

        <IndiXStack justifyContent="space-between" alignItems="center">
          <IndiH3>Invoices</IndiH3>
          <IndiButton type="solid" color="primary" size="sm" handlePress={onGenerate}>
            Generate invoice
          </IndiButton>
        </IndiXStack>

        <IndiTable data={invoices} columns={columns} />
      </IndiYStack>

      <IndiModal isOpen={cardOpen} setIsOpen={setCardOpen} hideFooter title="Add payment card">
        <IndiYStack gap="$3" padding="$4">
          <IndiText color="$textSecondary">
            Card is tokenised client-side by Stripe.js — only the token reaches sprintOS.
          </IndiText>
          <FormTextInput control={control} name="paymentMethodId" label="Payment method id" placeholder="pm_…" />
          <IndiButton type="solid" color="primary" handlePress={handleSubmit(onAddCard)}>
            Save card
          </IndiButton>
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
