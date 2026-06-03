import { Container, IndiCard, IndiH1, IndiH3, IndiParagraph, IndiYStack } from '@/components';
import { IndiButton } from '@/components/buttons';
import { router } from 'expo-router';

// -- Types --
interface UserTile {
  title: string;
  description: string;
  href: string;
}

// -- Mock Data (Sprint Digital will replace with API calls) --
const USER_TILES: UserTile[] = [
  { title: 'Assistant', description: 'Ask the AI anything about your work', href: '/(app)/(user)/assistant' },
  { title: 'My usage', description: 'See your AI usage this period', href: '/(app)/(user)/usage' },
  { title: 'Profile', description: 'Switch organisation, manage your account', href: '/(app)/(user)/profile' },
];

export default function UserDashboardScreen() {
  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Welcome</IndiH1>
        <IndiParagraph color="$textSecondary">What would you like to do today?</IndiParagraph>

        <IndiYStack gap="$3">
          {USER_TILES.map((tile) => (
            <IndiCard key={tile.href} padding="$4" gap="$2">
              <IndiH3>{tile.title}</IndiH3>
              <IndiParagraph color="$textSecondary">{tile.description}</IndiParagraph>
              <IndiButton type="outline" color="primary" size="sm" handlePress={() => router.push(tile.href)}>
                Open
              </IndiButton>
            </IndiCard>
          ))}
        </IndiYStack>
      </IndiYStack>
    </Container>
  );
}
