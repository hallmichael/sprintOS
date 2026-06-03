import { Container, IndiBadge, IndiH1, IndiYStack } from '@/components';
import { IndiColumn, IndiTable } from '@/components';
import { useAgents } from '../hooks/useAgents';
import { MOCK_AGENTS, type Agent } from '../mocks/agents';

export default function AgentListScreen() {
  const { data, isLoading } = useAgents();
  const agents = data?.data ?? MOCK_AGENTS; // mock fallback per Sprint guide

  const columns: IndiColumn<Agent>[] = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Model', dataIndex: 'model' },
    { title: 'Status', dataIndex: 'status', render: (_v, agent) => <IndiBadge>{agent.status}</IndiBadge> },
  ];

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Agents</IndiH1>
        <IndiTable loading={isLoading} data={agents} columns={columns} />
      </IndiYStack>
    </Container>
  );
}
