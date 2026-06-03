import {
  Container,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiLoader,
  IndiSelect,
  IndiText,
  IndiXStack,
  IndiYStack,
} from '@/components';
import { IndiInput } from '@/components/inputs';
import { useState } from 'react';

// -- Types --
type Tier = 'fast' | 'balanced' | 'powerful';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

// -- Mock Data (Sprint Digital will replace — POST /api/ai/complete) --
const TIER_OPTIONS = [
  { label: 'Fast', value: 'fast' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Powerful', value: 'powerful' },
];

const MOCK_HISTORY: ChatMessage[] = [
  { id: '1', role: 'user', text: 'Summarise this month’s usage in one line.' },
  {
    id: '2',
    role: 'assistant',
    text: 'You’ve spent AUD $184.32 this period, mostly on Claude (Bedrock) chat — about 18% above last month.',
  },
];

export default function AssistantScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_HISTORY);
  const [prompt, setPrompt] = useState('');
  const [tier, setTier] = useState<Tier>('balanced');
  const [thinking, setThinking] = useState(false);

  const send = () => {
    if (!prompt.trim()) return;
    const userMsg: ChatMessage = { id: `${Date.now()}`, role: 'user', text: prompt.trim() };
    setMessages((m) => [...m, userMsg]);
    setPrompt('');
    setThinking(true);

    // TODO(api): POST /api/ai/complete { prompt, tier } → append assistant reply.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-a`, role: 'assistant', text: 'This is a sample reply from the assistant.' },
      ]);
      setThinking(false);
    }, 800);
  };

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4" flex={1}>
        <IndiXStack justifyContent="space-between" alignItems="center">
          <IndiH1>Assistant</IndiH1>
          <IndiSelect
            data={TIER_OPTIONS}
            value={tier}
            onChange={(v: Tier) => setTier(v)}
            triggerWidth={160}
            label="Model"
          />
        </IndiXStack>

        <IndiYStack gap="$3" flex={1}>
          {messages.map((msg) => (
            <IndiCard
              key={msg.id}
              padding="$3"
              maxWidth="85%"
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              backgroundColor={msg.role === 'user' ? '$Blue500' : '$containerBg'}
            >
              <IndiText color={msg.role === 'user' ? 'white' : '$textPrimary'}>{msg.text}</IndiText>
            </IndiCard>
          ))}
          {thinking && (
            <IndiXStack gap="$2" alignItems="center" alignSelf="flex-start">
              <IndiLoader />
              <IndiText color="$textNeutral">Thinking…</IndiText>
            </IndiXStack>
          )}
        </IndiYStack>

        <IndiXStack gap="$2" alignItems="center">
          <IndiInput flex={1} value={prompt} onChangeText={setPrompt} placeholder="Ask anything…" onSubmitEditing={send} />
          <IndiButton type="solid" color="primary" handlePress={send} disabled={!prompt.trim()}>
            Send
          </IndiButton>
        </IndiXStack>
      </IndiYStack>
    </Container>
  );
}
