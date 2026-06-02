// Single configured API client over the generated ts-client. Never call fetch directly.
import createClient from '../../../packages/ts-client';

export const api = createClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
  // auth interceptor injects the Sanctum token + tenant context header
});
