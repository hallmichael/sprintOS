import React, { useSyncExternalStore } from 'react';
import { navStore } from './shims/expoRouter';

// Auth screens — full-screen, no shell
import LoginScreen from '@/features/auth/screens/LoginScreen';
import RegisterScreen from '@/features/auth/screens/RegisterScreen';

// Implemented admin screens (Phases 1-4, wired to live API)
import AdminDashboardScreen from '@/features/dashboard/screens/AdminDashboardScreen';
import OrganisationsScreen from '@/features/organisations/screens/OrganisationsScreen';
import UsersScreen from '@/features/users/screens/UsersScreen';
import SetupWizardScreen from '@/features/setup/screens/SetupWizardScreen';
import BillingDashboardScreen from '@/features/billing/screens/BillingDashboardScreen';
import ToolsScreen from '@/features/tools/screens/ToolsScreen';
import AssistantScreen from '@/features/ai/screens/AssistantScreen';
import UsageScreen from '@/features/usage/screens/UsageScreen';
import CrudBuilderScreen from '@/features/crud/screens/CrudBuilderScreen';
import EntityScreen from '@/features/crud/screens/EntityScreen';
import DataLakeScreen from '@/features/datalake/screens/DataLakeScreen';

// Implemented end-user screens
import UserDashboardScreen from '@/features/dashboard/screens/UserDashboardScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';

// ── Navigation map ────────────────────────────────────────────────────────
type NavEntry = { label: string; section: string; icon: string; C: React.ComponentType<any>; props?: Record<string, unknown> };

const ADMIN_NAV: NavEntry[] = [
  { label: 'Dashboard', section: 'Overview', icon: '◻', C: AdminDashboardScreen, href: '/(app)/(admin)/dashboard' },
  { label: 'CRUD builder', section: 'Data', icon: '⚡', C: CrudBuilderScreen, href: '/(app)/(admin)/crud-builder' },
  { label: 'Data lake', section: 'Data', icon: '🗄', C: DataLakeScreen, href: '/(app)/(admin)/datalake' },
  { label: 'Organisations', section: 'Workspace', icon: '🏢', C: OrganisationsScreen, href: '/(app)/(admin)/organisations' },
  { label: 'Users & roles', section: 'Workspace', icon: '👥', C: UsersScreen, href: '/(app)/(admin)/users' },
  { label: 'AI assistant', section: 'AI', icon: '✦', C: AssistantScreen, href: '/(app)/(admin)/assistant' },
  { label: 'Billing', section: 'Finance', icon: '$', C: BillingDashboardScreen, href: '/(app)/(admin)/billing' },
  { label: 'Usage', section: 'Finance', icon: '📊', C: UsageScreen, href: '/(app)/(admin)/usage' },
  { label: 'Tools', section: 'Config', icon: '🔧', C: ToolsScreen, href: '/(app)/(admin)/tools' },
  { label: 'Setup wizard', section: 'Config', icon: '⚙', C: SetupWizardScreen, href: '/(app)/(admin)/setup' },
].map((e) => ({ ...e, props: undefined })) as NavEntry[];

const USER_NAV: NavEntry[] = [
  { label: 'Home', section: 'Overview', icon: '◻', C: UserDashboardScreen, href: '/(app)/(user)/dashboard' },
  { label: 'Assistant', section: 'AI', icon: '✦', C: AssistantScreen, href: '/(app)/(user)/assistant' },
  { label: 'Usage', section: 'Account', icon: '📊', C: UsageScreen, href: '/(app)/(user)/usage' },
  { label: 'Profile', section: 'Account', icon: '👤', C: ProfileScreen, href: '/(app)/(user)/profile' },
] as NavEntry[];

// ── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const current = useSyncExternalStore(navStore.subscribe, navStore.get, navStore.get);
  const isAuth = current.startsWith('/(auth)');
  const isAdmin = current.startsWith('/(app)/(admin)');
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  // Auth pages — full screen, centred, no shell
  if (isAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {current === '/(auth)/register' ? <RegisterScreen /> : <LoginScreen />}
      </div>
    );
  }

  // Resolve the active screen
  const activeEntry = nav.find((e) => (e as any).href === current);

  let content: React.ReactNode;
  if (activeEntry) {
    content = <activeEntry.C />;
  } else {
    // Dynamic entity routes: /(app)/*/crud/{key} or /(app)/*/entity/{key}
    const entityMatch = current.match(/\/crud\/(.+)$/) ?? current.match(/\/entity\/(.+)$/);
    if (entityMatch) {
      content = <EntityScreen entityKey={entityMatch[1]} />;
    } else {
      // Fallback to first nav item
      const First = nav[0].C;
      content = <First />;
    }
  }

  // Unique sections in order
  const sections = [...new Set(nav.map((e) => (e as any).section))];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{
        width: 232, flexShrink: 0, background: '#111827', color: '#e5e7eb',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Wordmark */}
        <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #1f2937' }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: '#fff' }}>
            sprint<span style={{ color: '#0d9488' }}>OS</span>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
            {isAdmin ? 'Admin console' : 'Workspace'}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          {sections.map((section) => (
            <div key={section} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: '#4b5563', padding: '10px 8px 4px' }}>
                {section}
              </div>
              {nav.filter((e) => (e as any).section === section).map((entry) => {
                const href = (entry as any).href as string;
                const active = current === href || (href !== '/(app)/(admin)/dashboard' && current.startsWith(href));
                return (
                  <button key={href} onClick={() => navStore.set(href)} style={{
                    display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left',
                    padding: '7px 9px', borderRadius: 7, border: 0, cursor: 'pointer', fontSize: 13,
                    marginBottom: 1, color: active ? '#fff' : '#9ca3af',
                    background: active ? '#0d9488' : 'transparent',
                    fontWeight: active ? 600 : 400, transition: 'background 0.1s',
                  }}>
                    <span style={{ fontSize: 13, opacity: 0.8 }}>{entry.icon}</span>
                    {entry.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User switcher footer */}
        <div style={{ borderTop: '1px solid #1f2937', padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {isAdmin ? 'A' : 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isAdmin ? 'Demo Admin' : 'Member'}
            </div>
            <button onClick={() => navStore.set(isAdmin ? '/(app)/(user)/dashboard' : '/(app)/(admin)/dashboard')}
              style={{ fontSize: 10, color: '#6b7280', background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
              Switch to {isAdmin ? 'end-user view' : 'admin view'} →
            </button>
          </div>
          <button onClick={() => navStore.set('/(auth)/login')}
            style={{ fontSize: 11, color: '#6b7280', background: 'none', border: 0, cursor: 'pointer', padding: '4px 6px' }}
            title="Sign out">
            ↩
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#f9fafb' }}>
        {content}
      </main>
    </div>
  );
}
