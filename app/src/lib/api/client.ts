/**
 * Minimal live API client for the local preview (talks to the running Laravel
 * API). In Sprint's app this is replaced by the generated ts-client + auth
 * interceptor; here it's a thin fetch wrapper with Bearer-token auth.
 */
const BASE_URL = 'http://localhost:8000/api';
const TOKEN_KEY = 'sprintos_token';

export const auth = {
  token: (): string | null => (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isAuthed: () => !!auth.token(),
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
  }
}

async function request<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body) headers['Content-Type'] = 'application/json';
  const token = auth.token();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? res.statusText, data);
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string) => request<T>('GET', path),
  post: <T = any>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T = any>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  del: <T = any>(path: string) => request<T>('DELETE', path),

  async login(email: string, password: string) {
    const res = await request<{ token: string; user: any; memberships: any[] }>('POST', '/auth/login', {
      email,
      password,
    });
    auth.set(res.token);
    return res;
  },
  logout() {
    auth.clear();
  },
};
