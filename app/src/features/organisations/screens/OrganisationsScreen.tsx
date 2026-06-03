import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiModal,
  IndiText,
  IndiYStack,
  LoadingContainer,
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
interface Organisation {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  memberCount: number;
}

interface CreateOrgForm {
  name: string;
  slug: string;
}

// -- Mock Data (Sprint Digital will replace with API calls — GET /api/tenants) --
const MOCK_ORGS: Organisation[] = [
  { id: '1', name: 'Acme Plumbing', slug: 'acme-plumbing', isActive: true, memberCount: 14 },
  { id: '2', name: 'Brisbane Trades Co', slug: 'brisbane-trades', isActive: true, memberCount: 8 },
  { id: '3', name: 'Coastal Electrical (archived)', slug: 'coastal-electrical', isActive: false, memberCount: 0 },
];

const schema = yup.object({
  name: yup.string().required('Organisation name is required'),
  slug: yup
    .string()
    .matches(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and dashes only')
    .required('Slug is required'),
});

export default function OrganisationsScreen() {
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Organisation[]>([]);

  const load = () =>
    api
      .get<{ data: any[] }>('/tenants')
      .then((res) => setOrgs((res.data ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug, isActive: t.is_active, memberCount: t.member_count ?? 0 }))))
      .catch(() => setOrgs(MOCK_ORGS))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const { control, handleSubmit, reset } = useForm<CreateOrgForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', slug: '' },
  });

  const onCreate = async (data: CreateOrgForm) => {
    try {
      await api.post('/tenants', data); // platform-admin only
      Toast.success({ message: `Organisation "${data.name}" created` });
      reset();
      setCreateOpen(false);
      load();
    } catch (e: any) {
      Toast.error({ message: e?.status === 403 ? 'Only a platform admin can create orgs' : e?.message ?? 'Create failed' });
    }
  };

  const columns: IndiColumn<Organisation>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (_value, org) => (
        <IndiBadge color={org.isActive ? '$Green500' : '$Neutral200'}>{org.isActive ? 'Active' : 'Archived'}</IndiBadge>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Organisations</IndiH1>
        <IndiText color="$textSecondary">Manage the organisations in this deployment.</IndiText>

        <IndiButton type="solid" color="primary" alignSelf="flex-start" handlePress={() => setCreateOpen(true)}>
          New organisation
        </IndiButton>

        {loading ? (
          <LoadingContainer />
        ) : orgs.length === 0 ? (
          <IndiCard padding="$6" alignItems="center" gap="$2">
            <IndiText color="$textSecondary">No organisations yet.</IndiText>
            <IndiButton type="outline" color="primary" handlePress={() => setCreateOpen(true)}>
              Create your first org
            </IndiButton>
          </IndiCard>
        ) : (
          <IndiTable data={orgs} columns={columns} />
        )}
      </IndiYStack>

      <IndiModal isOpen={createOpen} setIsOpen={setCreateOpen} hideFooter title="New organisation">
        <IndiYStack gap="$3" padding="$4">
          <FormTextInput control={control} name="name" label="Name" placeholder="Acme Plumbing" />
          <FormTextInput control={control} name="slug" label="Slug" placeholder="acme-plumbing" />
          <IndiButton type="solid" color="primary" handlePress={handleSubmit(onCreate)}>
            Create
          </IndiButton>
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
