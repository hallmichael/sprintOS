export interface Agent {
  id: string;
  name: string;
  status: 'draft' | 'deployed' | 'paused';
  model: 'claude-haiku' | 'claude-sonnet' | 'claude-opus'; // Claude tier (via Bedrock)
  lastRunAt: string | null; // ISO; null = never run (edge case)
}

export const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'Invoice Chaser', status: 'deployed', model: 'claude-sonnet', lastRunAt: '2026-06-01T09:00:00Z' },
  { id: '2', name: 'Lead Triager', status: 'draft', model: 'claude-haiku', lastRunAt: null },
];
