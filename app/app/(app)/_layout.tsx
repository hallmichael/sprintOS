import { Stack } from 'expo-router';

// The (admin) and (user) groups select the surface for the signed-in user type.
// Sprint's auth layer redirects to the correct group based on the active role.
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(user)" />
    </Stack>
  );
}
