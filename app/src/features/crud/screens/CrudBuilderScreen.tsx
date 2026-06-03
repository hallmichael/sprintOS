import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiH3,
  IndiModal,
  IndiParagraph,
  IndiText,
  IndiXStack,
  IndiYStack,
  IndiLoader,
  Toast,
} from '@/components';
import { FormTextInput } from '@/components/forms';
import { IndiColumn, IndiTable } from '@/components';
import { api } from '@/lib/api/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
interface FieldDef {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface EntityDefinition {
  id: string;
  key: string;
  name: string;
  name_plural: string;
  fields: FieldDef[];
  is_published: boolean;
  version: number;
}

interface ProposeForm {
  prompt: string;
}

// -- Mock fallback --
const MOCK_DEFS: EntityDefinition[] = [
  { id: '1', key: 'customer', name: 'Customer', name_plural: 'Customers', is_published: true, version: 1, fields: [{ key: 'company_name', label: 'Company name', type: 'text', required: true }] },
];

const schema = yup.object({ prompt: yup.string().required('Describe the entity you want to create') });

export default function CrudBuilderScreen() {
  const [definitions, setDefinitions] = useState<EntityDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [proposal, setProposal] = useState<Omit<EntityDefinition, 'id' | 'is_published' | 'version'> | null>(null);
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm<ProposeForm>({
    resolver: yupResolver(schema),
    defaultValues: { prompt: '' },
  });

  const load = () =>
    api
      .get<{ data: EntityDefinition[] }>('/crud/definitions')
      .then((r) => setDefinitions(r.data ?? []))
      .catch(() => setDefinitions(MOCK_DEFS))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const onPropose = async (data: ProposeForm) => {
    setProposing(true);
    try {
      // POST /api/crud/propose — Claude returns a draft definition via tool-use.
      const res = await api.post<Omit<EntityDefinition, 'id' | 'is_published' | 'version'>>('/crud/propose', { prompt: data.prompt });
      setProposal(res);
      Toast.success({ message: `Claude proposed "${res.name}" — review below` });
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Proposal failed' });
    } finally {
      setProposing(false);
    }
  };

  const onSave = async () => {
    if (!proposal) return;
    setSaving(true);
    try {
      await api.post('/crud/definitions', proposal);
      Toast.success({ message: `"${proposal.name}" entity created` });
      reset();
      setProposal(null);
      setProposeOpen(false);
      load();
    } catch (e: any) {
      Toast.error({ message: e?.data?.message ?? e?.message ?? 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const columns: IndiColumn<EntityDefinition>[] = [
    { title: 'Entity', dataIndex: 'name' },
    { title: 'Key', dataIndex: 'key' },
    { title: 'Fields', dataIndex: 'fields', render: (_v, d) => String(d.fields.length) },
    { title: 'Version', dataIndex: 'version' },
    { title: 'Status', dataIndex: 'is_published', render: (_v, d) => <IndiBadge color={d.is_published ? '$Green500' : '$Neutral200'}>{d.is_published ? 'Published' : 'Draft'}</IndiBadge> },
    {
      title: '',
      dataIndex: 'key',
      render: (_v, d) => (
        <IndiButton type="ghost" color="primary" size="sm" handlePress={() => router.push(`/(app)/(admin)/crud/${d.key}` as any)}>
          Open
        </IndiButton>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiXStack justifyContent="space-between" alignItems="center">
          <IndiH1>CRUD builder</IndiH1>
          <IndiButton type="solid" color="primary" handlePress={() => { setProposal(null); reset(); setProposeOpen(true); }}>
            New entity with AI
          </IndiButton>
        </IndiXStack>
        <IndiText color="$textSecondary">Describe an entity in plain English — Claude designs the schema.</IndiText>

        {loading ? <IndiLoader /> : definitions.length === 0 ? (
          <IndiCard padding="$6" alignItems="center" gap="$2">
            <IndiText color="$textSecondary">No entities yet.</IndiText>
            <IndiButton type="outline" color="primary" handlePress={() => setProposeOpen(true)}>Create your first entity</IndiButton>
          </IndiCard>
        ) : (
          <IndiTable data={definitions} columns={columns} />
        )}
      </IndiYStack>

      <IndiModal isOpen={proposeOpen} setIsOpen={setProposeOpen} hideFooter title="New entity with AI">
        <IndiYStack gap="$4" padding="$4">
          {!proposal ? (
            <>
              <IndiText color="$textSecondary">Describe the business data you want to track. Claude will propose fields you can review before saving.</IndiText>
              <FormTextInput control={control} name="prompt" label="Description" placeholder="e.g. Invoices for a trade business with customer, amount, due date and payment status" />
              <IndiButton type="solid" color="primary" loading={proposing} handlePress={handleSubmit(onPropose)}>
                Propose with AI
              </IndiButton>
            </>
          ) : (
            <>
              <IndiCard padding="$4" gap="$2" backgroundColor="$pageBg">
                <IndiH3>{proposal.name} ({proposal.name_plural})</IndiH3>
                <IndiYStack gap="$2">
                  {proposal.fields.map((f) => (
                    <IndiXStack key={f.key} gap="$2" alignItems="center">
                      <IndiBadge color="$Blue500">{f.type}</IndiBadge>
                      <IndiText color="$textPrimary">{f.label}</IndiText>
                      <IndiText color="$textSecondary">({f.key})</IndiText>
                      {f.required && <IndiBadge color="$Orange500">required</IndiBadge>}
                    </IndiXStack>
                  ))}
                </IndiYStack>
              </IndiCard>
              <IndiParagraph color="$textSecondary">This is Claude's proposal. You can save it now or go back to edit the prompt.</IndiParagraph>
              <IndiXStack gap="$3">
                <IndiButton type="outline" color="secondary" handlePress={() => setProposal(null)}>Back</IndiButton>
                <IndiButton type="solid" color="primary" loading={saving} handlePress={onSave}>Save entity</IndiButton>
              </IndiXStack>
            </>
          )}
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
