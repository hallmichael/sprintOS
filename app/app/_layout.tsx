import { Toast } from '@/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

// NOTE: Sprint's app shell provides the <TamaguiProvider config={...}> wrapper and the
// auth gate. This root layout adds the query client + toast host for the UI layer.
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toast.Provider />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  );
}
