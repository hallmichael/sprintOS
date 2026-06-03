import React, { useEffect, useSyncExternalStore } from 'react';

// Minimal in-memory navigation store standing in for Expo Router.
let current = '/(auth)/login';
const listeners = new Set<() => void>();

export const navStore = {
  get: () => current,
  set: (p: string) => {
    current = p;
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export const router = {
  push: (href: string) => navStore.set(href),
  replace: (href: string) => navStore.set(href),
  navigate: (href: string) => navStore.set(href),
  back: () => navStore.set('/(app)/(admin)/dashboard'),
};

export const useRouter = () => router;
export const usePathname = () => useSyncExternalStore(navStore.subscribe, navStore.get, navStore.get);

export const useLocalSearchParams = <T extends Record<string, string>>(): Partial<T> => {
  const path = navStore.get();
  const segments = path.split('/');
  const last = segments[segments.length - 1];
  // For dynamic routes like /entity/customer return { key: 'customer' }
  return { key: last } as Partial<T>;
};

export const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href="#" onClick={(e) => { e.preventDefault(); navStore.set(href); }}
    style={{ color: '#0d9488', textDecoration: 'none' }}>
    {children}
  </a>
);

export const Redirect = ({ href }: { href: string }) => {
  useEffect(() => navStore.set(href), [href]);
  return null;
};

export const Slot = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const Stack: any = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
Stack.Screen = (_: any) => null;
