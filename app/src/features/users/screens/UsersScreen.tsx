import {
  Container,
  IndiBadge,
  IndiButton,
  IndiH1,
  IndiModal,
  IndiText,
  IndiYStack,
  Toast,
} from '@/components';
import { FormSelect, FormTextInput } from '@/components/forms';
import { IndiColumn, IndiTable } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
type OrgRole = 'admin' | 'member' | 'viewer';

interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: OrgRole;
}

interface InviteForm {
  name: string;
  email: string;
  role: OrgRole;
}

// -- Mock Data (Sprint Digital will replace with API calls — GET /api/users) --
const MOCK_USERS: OrgUser[] = [
  { id: '1', name: 'Jordan Smith', email: 'jordan@acme.com.au', role: 'admin' },
  { id: '2', name: 'Priya Nair', email: 'priya@acme.com.au', role: 'member' },
  { id: '3', name: 'Liam O’Brien', email: 'liam@acme.com.au', role: 'viewer' },
];

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
];

const ROLE_COLOR: Record<OrgRole, string> = {
  admin: '$Purple500',
  member: '$Blue500',
  viewer: '$Neutral200',
};

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  role: yup.string().oneOf(['admin', 'member', 'viewer']).required('Select a role'),
});

export default function UsersScreen() {
  const [inviteOpen, setInviteOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<InviteForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', role: 'member' },
  });

  const onInvite = (data: InviteForm) => {
    // TODO(api): POST /api/auth/register (admin invite) then PUT /api/users/{id}/roles.
    console.log('invite', data);
    Toast.success({ message: `Invitation sent to ${data.email}` });
    reset();
    setInviteOpen(false);
  };

  const changeRole = (user: OrgUser, role: OrgRole) => {
    // TODO(api): PUT /api/users/{id}/roles { role } (org admin only).
    console.log('change role', user.id, role);
    Toast.success({ message: `${user.name} is now ${role}` });
  };

  const columns: IndiColumn<OrgUser>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (_value, user) => <IndiBadge color={ROLE_COLOR[user.role]}>{user.role}</IndiBadge>,
    },
    {
      title: '',
      dataIndex: 'id',
      render: (_value, user) => (
        <IndiButton
          type="ghost"
          color="primary"
          size="sm"
          handlePress={() => changeRole(user, user.role === 'admin' ? 'member' : 'admin')}
        >
          Toggle admin
        </IndiButton>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Users</IndiH1>
        <IndiText color="$textSecondary">People in this organisation and their roles.</IndiText>

        <IndiButton type="solid" color="primary" alignSelf="flex-start" handlePress={() => setInviteOpen(true)}>
          Invite user
        </IndiButton>

        <IndiTable data={MOCK_USERS} columns={columns} />
      </IndiYStack>

      <IndiModal isOpen={inviteOpen} setIsOpen={setInviteOpen} hideFooter title="Invite user">
        <IndiYStack gap="$3" padding="$4">
          <FormTextInput control={control} name="name" label="Full name" placeholder="Jordan Smith" />
          <FormTextInput control={control} name="email" label="Email" placeholder="jordan@acme.com.au" />
          <FormSelect control={control} name="role" label="Role" data={ROLE_OPTIONS} />
          <IndiButton type="solid" color="primary" handlePress={handleSubmit(onInvite)}>
            Send invite
          </IndiButton>
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
