import React, { useSyncExternalStore } from 'react';
import { navStore } from './shims/expoRouter';

import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';
import AdminDashboardScreen from '@/features/dashboard/screens/AdminDashboardScreen';
import UserDashboardScreen from '@/features/dashboard/screens/UserDashboardScreen';
import OrganisationsScreen from '@/features/organisations/screens/OrganisationsScreen';
import UsersScreen from '@/features/users/screens/UsersScreen';
import SetupWizardScreen from '@/features/setup/screens/SetupWizardScreen';
import BillingDashboardScreen from '@/features/billing/screens/BillingDashboardScreen';
import ToolsScreen from '@/features/tools/screens/ToolsScreen';
import AssistantScreen from '@/features/ai/screens/AssistantScreen';
import UsageScreen from '@/features/usage/screens/UsageScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';

type Entry = { label: string; group: string; C: React.ComponentType };

const ROUTES: Record<string, Entry> = {
  '/(auth)/login': { label: 'Login', group: 'Auth', C: LoginScreen },
  '/(auth)/register': { label: 'Register', group: 'Auth', C: RegisterScreen },

  '/(app)/(admin)/dashboard': { label: 'Dashboard', group: 'Admin', C: AdminDashboardScreen },
  '/(app)/(admin)/organisations': { label: 'Organisations', group: 'Admin', C: OrganisationsScreen },
  '/(app)/(admin)/users': { label: 'Users & roles', group: 'Admin', C: UsersScreen },
  '/(app)/(admin)/setup': { label: 'Setup wizard', group: 'Admin', C: SetupWizardScreen },
  '/(app)/(admin)/billing': { label: 'Billing', group: 'Admin', C: BillingDashboardScreen },
  '/(app)/(admin)/tools': { label: 'Tools', group: 'Admin', C: ToolsScreen },
  '/(app)/(admin)/assistant': { label: 'Assistant', group: 'Admin', C: AssistantScreen },
  '/(app)/(admin)/usage': { label: 'Usage', group: 'Admin', C: UsageScreen },

  '/(app)/(user)/dashboard': { label: 'Home', group: 'End user', C: UserDashboardScreen },
  '/(app)/(user)/assistant': { label: 'Assistant', group: 'End user', C: AssistantScreen },
  '/(app)/(user)/usage': { label: 'My usage', group: 'End user', C: UsageScreen },
  '/(app)/(user)/profile': { label: 'Profile', group: 'End user', C: ProfileScreen },
};

const GROUPS = ['Auth', 'Admin', 'End user'];

export default function App() {
  const current = useSyncExternalStore(navStore.subscribe, navStore.get, navStore.get);
  const entry = ROUTES[current];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ width: 248, flexShrink: 0, borderRight: '1px solid #e6e9ee', background: '#fff', overflowY: 'auto', padding: '16px 12px' }}>
        <div style={{ fontWeight: 800, fontSize: 18, padding: '4px 10px 14px' }}>
          sprint<span style={{ color: '#0d9488' }}>OS</span> <span style={{ fontSize: 11, color: '#aeb6c0', fontWeight: 500 }}>preview</span>
        </div>
        {GROUPS.map((g) => (
          <div key={g} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, color: '#aeb6c0', padding: '6px 10px' }}>{g}</div>
            {Object.entries(ROUTES).filter(([, e]) => e.group === g).map(([href, e]) => {
              const active = href === current;
              return (
                <button key={href} onClick={() => navStore.set(href)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: 0, cursor: 'pointer', fontSize: 14, marginBottom: 2, background: active ? '#0d948815' : 'transparent', color: active ? '#0d9488' : '#3b4351', fontWeight: active ? 600 : 500 }}>
                  {e.label}
                </button>
              );
            })}
          </div>
        ))}
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
        <div style={{ fontSize: 12, color: '#aeb6c0', marginBottom: 14 }}>{current}</div>
        {entry ? <entry.C /> : <div style={{ color: '#8a93a0' }}>No screen mapped for {current}</div>}
      </main>
    </div>
  );
}
