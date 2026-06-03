import { Redirect } from 'expo-router';

// Sprint's auth layer decides admin vs user; default unauthenticated → login.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
