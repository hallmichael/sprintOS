import { Container, IndiH1, IndiYStack, IndiTable, IndiBadge } from '@/components';
import { useAgents } from '../hooks/useAgents';
import { MOCK_AGENTS } from '../mocks/agents';

export default function AgentListScreen() {
  const { data, isLoading, error } = useAgents();
  const agents = data?.data ?? MOCK_AGENTS; // mock fallback per Sprint guide

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Agents</IndiH1>
        {/* loading / error / empty states handled with Indi components */}
        <IndiTable
          loading={isLoading}
          data={agents}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'model', header: 'Model' },
            { key: 'status', header: 'Status', render: (a) => <IndiBadge>{a.status}</IndiBadge> },
          ]}
        />
      </IndiYStack>
    </Container>
  );
}
