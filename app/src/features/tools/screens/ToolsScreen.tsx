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
interface Tool {
  id: string;
  key: string;
  name: string;
  handler: string;
  isEnabled: boolean;
}

interface RegisterToolForm {
  key: string;
  name: string;
  description: string;
  handler: string;
}

// -- Mock Data (Sprint Digital will replace — GET /api/tools) --
const MOCK_TOOLS: Tool[] = [
  { id: '1', key: 'calculator', name: 'Calculator', handler: 'calculator', isEnabled: true },
  { id: '2', key: 'lookup_customer', name: 'Customer lookup', handler: 'crud', isEnabled: true },
  { id: '3', key: 'send_sms', name: 'Send SMS', handler: 'connector', isEnabled: false },
];

const HANDLER_OPTIONS = [
  { label: 'Calculator (built-in)', value: 'calculator' },
  { label: 'CRUD entity', value: 'crud' },
  { label: 'Connector', value: 'connector' },
];

const schema = yup.object({
  key: yup.string().matches(/^[a-z0-9_]+$/, 'lowercase, numbers and underscores').required('Key is required'),
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  handler: yup.string().required('Choose a handler'),
});

export default function ToolsScreen() {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<RegisterToolForm>({
    resolver: yupResolver(schema),
    defaultValues: { key: '', name: '', description: '', handler: 'calculator' },
  });

  const onRegister = (data: RegisterToolForm) => {
    // TODO(api): POST /api/tools (org admin only).
    console.log('register tool', data);
    Toast.success({ message: `Tool "${data.key}" registered` });
    reset();
    setOpen(false);
  };

  const columns: IndiColumn<Tool>[] = [
    { title: 'Key', dataIndex: 'key' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Handler', dataIndex: 'handler' },
    {
      title: 'Status',
      dataIndex: 'isEnabled',
      render: (_v, tool) => (
        <IndiBadge color={tool.isEnabled ? '$Green500' : '$Neutral200'}>{tool.isEnabled ? 'Enabled' : 'Disabled'}</IndiBadge>
      ),
    },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Tools</IndiH1>
        <IndiText color="$textSecondary">Tools agents can call via Claude’s tool-use.</IndiText>

        <IndiButton type="solid" color="primary" alignSelf="flex-start" handlePress={() => setOpen(true)}>
          Register tool
        </IndiButton>

        <IndiTable data={MOCK_TOOLS} columns={columns} />
      </IndiYStack>

      <IndiModal isOpen={open} setIsOpen={setOpen} hideFooter title="Register tool">
        <IndiYStack gap="$3" padding="$4">
          <FormTextInput control={control} name="key" label="Key" placeholder="lookup_customer" />
          <FormTextInput control={control} name="name" label="Name" placeholder="Customer lookup" />
          <FormTextInput control={control} name="description" label="Description" placeholder="Find a customer by name" />
          <FormSelect control={control} name="handler" label="Handler" data={HANDLER_OPTIONS} />
          <IndiButton type="solid" color="primary" handlePress={handleSubmit(onRegister)}>
            Register
          </IndiButton>
        </IndiYStack>
      </IndiModal>
    </Container>
  );
}
