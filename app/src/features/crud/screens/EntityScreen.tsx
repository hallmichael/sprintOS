import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiLoader,
  IndiModal,
  IndiText,
  IndiXStack,
  IndiYStack,
  Toast,
} from '@/components';
import { FormCheckbox, FormNumberInput, FormSelect, FormTextInput } from '@/components/forms';
import { IndiColumn, IndiTable } from '@/components';
import { api } from '@/lib/api/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// -- Types --
interface FieldDef {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface EntityDefinition {
  id: string;
  key: string;
  name: string;
  name_plural: string;
  fields: FieldDef[];
  version: number;
}

interface CrudRecord {
  id: string;
  data: Record<string, any>;
  created_at: string;
}

interface Props {
  /** The entity key from the route param, e.g. "customer" */
  entityKey: string;
}

function FieldInput({ field, control }: { field: FieldDef; control: any }) {
  if (field.type === 'boolean')  return <FormCheckbox control={control} name={`data.${field.key}`} label={field.label} />;
  if (field.type === 'number' || field.type === 'currency') return <FormNumberInput control={control} name={`data.${field.key}`} label={field.label} placeholder={field.placeholder} />;
  if (field.type === 'select' && field.options?.length) {
    const opts = field.options.map((o) => ({ label: o, value: o }));
    return <FormSelect control={control} name={`data.${field.key}`} label={field.label} data={opts} />;
  }
  return <FormTextInput control={control} name={`data.${field.key}`} label={field.label} placeholder={field.placeholder} secureTextEntry={false} />;
}

export default function EntityScreen({ entityKey }: Props) {
  const [def, setDef] = useState<EntityDefinition | null>(null);
  const [records, setRecords] = useState<CrudRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({ defaultValues: { data: {} as Record<string, any> } });

  const load = async () => {
    try {
      const [d, r] = await Promise.all([
        api.get<EntityDefinition>(`/crud/definitions/${entityKey}`),
        api.get<{ data: CrudRecord[] }>(`/crud/entities/${entityKey}`),
      ]);
      setDef(d);
      setRecords(r.data ?? []);
    } catch (e: any) {
      Toast.error({ message: `Could not load ${entityKey}: ${e?.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [entityKey]);

  const onCreate = async (values: { data: Record<string, any> }) => {
    if (!def) return;
    setSubmitting(true);
    try {
      await api.post(`/crud/entities/${entityKey}`, { data: values.data });
      Toast.success({ message: `${def.name} created` });
      reset({ data: {} });
      setCreateOpen(false);
      load();
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Create failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.del(`/crud/entities/${entityKey}/${id}`);
      Toast.success({ message: 'Deleted' });
      setRecords((r) => r.filter((x) => x.id !== id));
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Delete failed' });
    }
  };

  if (loading) return <Container><IndiYStack padding="$4"><IndiLoader /></IndiYStack></Container>;

  if (!def) return (
    <Container><IndiYStack padding="$4" gap="$2">
      <IndiText color="$Red500">Entity not found: {entityKey}</IndiText>
    </IndiYStack></Container>
  );

  // Build table columns dynamically from the definition.
  const fieldCols: IndiColumn<CrudRecord>[] = def.fields.slice(0, 4).map((f) => ({
    title: f.label,
    dataIndex: 'data',
    render: (_v, rec) => {
      const val = rec.data[f.key];
      if (val == null) return <IndiText color="$textNeutral">—</IndiText>;
      if (typeof val === 'boolean') return <IndiBadge color={val ? '$Green500' : '$Neutral200'}>{val ? 'Yes' : 'No'}</IndiBadge>;
      return String(val);
    },
  }));

  const columns: IndiColumn<CrudRecord>[] = [
    ...fieldCols,
    {
      title: '',
      dataIndex: 'id',
      render: (_v, rec) => (
        <IndiButton type="ghost" color="red" size="sm" handlePress={() => onDelete(rec.id)}>Delete</IndiButton>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiXStack justifyContent="space-between" alignItems="center">
          <IndiH1>{def.name_plural}</IndiH1>
          <IndiButton type="solid" color="primary" handlePress={() => { reset({ data: {} }); setCreateOpen(true); }}>
            New {def.name}
          </IndiButton>
        </IndiXStack>

        <IndiText color="$textSecondary">{records.length} record{records.length !== 1 ? 's' : ''}</IndiText>

        {records.length === 0 ? (
          <IndiCard padding="$6" alignItems="center" gap="$2">
            <IndiText color="$textSecondary">No {def.name_plural.toLowerCase()} yet.</IndiText>
            <IndiButton type="outline" color="primary" handlePress={() => setCreateOpen(true)}>
              Create first {def.name}
            </IndiButton>
          </IndiCard>
        ) : (
          <IndiTable data={records} columns={columns} />
        )}
      </IndiYStack>

      <IndiModal isOpen={createOpen} setIsOpen={setCreateOpen} hideFooter title={`New ${def.name}`}>
        <IndiYStack gap="$3" padding="$4">
          {def.fields.map((f) => (
            <FieldInput key={f.key} field={f} control={control} />
          ))}
          <IndiButton type="solid" color="primary" loading={submitting} handlePress={handleSubmit(onCreate)}>
            Save {def.name}
          </IndiButton>
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
