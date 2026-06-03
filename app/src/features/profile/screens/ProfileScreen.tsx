import {
  Container,
  IndiBadge,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiH3,
  IndiSeparator,
  IndiText,
  IndiXStack,
  IndiYStack,
  Toast,
} from '@/components';
import { router } from 'expo-router';

// -- Types --
type OrgRole = 'admin' | 'member' | 'viewer';

interface Membership {
  tenantId: string;
  tenantName: string;
  role: OrgRole;
  isActive: boolean;
}

interface Profile {
  name: string;
  email: string;
}

// -- Mock Data (Sprint Digital will replace — GET /api/auth/me) --
const MOCK_PROFILE: Profile = { name: 'Priya Nair', email: 'priya@acme.com.au' };

const MOCK_MEMBERSHIPS: Membership[] = [
  { tenantId: '1', tenantName: 'Acme Plumbing', role: 'member', isActive: true },
  { tenantId: '2', tenantName: 'Brisbane Trades Co', role: 'viewer', isActive: false },
];

const ROLE_COLOR: Record<OrgRole, string> = { admin: '$Purple500', member: '$Blue500', viewer: '$Neutral200' };

export default function ProfileScreen() {
  const switchOrg = (m: Membership) => {
    // TODO(api): set active org (X-Tenant-ID) and refetch; only member orgs are switchable.
    Toast.success({ message: `Switched to ${m.tenantName}` });
  };

  const signOut = () => {
    // TODO(api): POST /api/auth/logout.
    router.replace('/(auth)/login');
  };

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Profile</IndiH1>

        <IndiCard padding="$4" gap="$1">
          <IndiText color="$textPrimary" fontWeight="600">
            {MOCK_PROFILE.name}
          </IndiText>
          <IndiText color="$textSecondary">{MOCK_PROFILE.email}</IndiText>
        </IndiCard>

        <IndiH3>Your organisations</IndiH3>
        <IndiYStack gap="$3">
          {MOCK_MEMBERSHIPS.map((m) => (
            <IndiCard key={m.tenantId} padding="$4" gap="$2">
              <IndiXStack justifyContent="space-between" alignItems="center">
                <IndiYStack gap="$1">
                  <IndiText color="$textPrimary" fontWeight="600">
                    {m.tenantName}
                  </IndiText>
                  <IndiBadge color={ROLE_COLOR[m.role]}>{m.role}</IndiBadge>
                </IndiYStack>
                {m.isActive ? (
                  <IndiBadge color="$Green500">Active</IndiBadge>
                ) : (
                  <IndiButton type="outline" color="primary" size="sm" handlePress={() => switchOrg(m)}>
                    Switch
                  </IndiButton>
                )}
              </IndiXStack>
            </IndiCard>
          ))}
        </IndiYStack>

        <IndiSeparator />
        <IndiButton type="outline" color="red" alignSelf="flex-start" handlePress={signOut}>
          Sign out
        </IndiButton>
      </IndiYStack>
    </Container>
  );
}
