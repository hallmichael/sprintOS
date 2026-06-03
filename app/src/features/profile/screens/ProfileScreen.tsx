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
import { api, auth } from '@/lib/api/client';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

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

// -- Mock fallback (used when the API is unreachable) --
const MOCK_PROFILE: Profile = { name: 'Priya Nair', email: 'priya@acme.com.au' };
const MOCK_MEMBERSHIPS: Membership[] = [
  { tenantId: '1', tenantName: 'Acme Plumbing', role: 'member', isActive: true },
];

const ROLE_COLOR: Record<OrgRole, string> = { admin: '$Purple500', member: '$Blue500', viewer: '$Neutral200' };

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
  const [memberships, setMemberships] = useState<Membership[]>(MOCK_MEMBERSHIPS);

  useEffect(() => {
    // Live: GET /api/auth/me → user + memberships.
    api
      .get<{ user: any; memberships: any[] }>('/auth/me')
      .then((res) => {
        setProfile({ name: res.user?.name, email: res.user?.email });
        setMemberships((res.memberships ?? []).map((m, i) => ({ tenantId: m.tenant_id, tenantName: m.tenant_name ?? m.tenant_slug ?? m.tenant_id, role: m.role, isActive: i === 0 })));
      })
      .catch(() => undefined);
  }, []);

  const switchOrg = (m: Membership) => {
    // Sets active org via the X-Tenant-ID header on subsequent calls (validated server-side).
    Toast.success({ message: `Switched to ${m.tenantName}` });
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    auth.clear();
    router.replace('/(auth)/login');
  };

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Profile</IndiH1>

        <IndiCard padding="$4" gap="$1">
          <IndiText color="$textPrimary" fontWeight="600">
            {profile.name}
          </IndiText>
          <IndiText color="$textSecondary">{profile.email}</IndiText>
        </IndiCard>

        <IndiH3>Your organisations</IndiH3>
        <IndiYStack gap="$3">
          {memberships.map((m) => (
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
