import { IndiButton } from '@/components/buttons';
import { FormTextInput } from '@/components/forms';
import { Container, IndiCard, IndiH1, IndiSeparator, IndiText, IndiYStack, Toast } from '@/components';
import { api } from '@/lib/api/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
interface LoginForm {
  email: string;
  password: string;
}

interface SsoProvider {
  key: 'google' | 'microsoft' | 'github';
  label: string;
}

// -- Mock Data (Sprint Digital will replace with API calls) --
// Enabled SSO providers come from GET /api/auth/sso config for the tenant.
const MOCK_SSO_PROVIDERS: SsoProvider[] = [
  { key: 'google', label: 'Continue with Google' },
  { key: 'microsoft', label: 'Continue with Microsoft' },
];

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginScreen() {
  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.login(data.email, data.password);
      const role = res.memberships?.[0]?.role;
      Toast.success({ message: `Signed in as ${res.user?.name ?? data.email}` });
      router.replace(role === 'admin' ? '/(app)/(admin)/dashboard' : '/(app)/(user)/dashboard');
    } catch (e: any) {
      Toast.error({ message: e?.message ?? 'Login failed' });
    }
  };

  const onSso = (provider: SsoProvider) => {
    // TODO(api): GET /api/auth/sso/{provider}/redirect?tenant=… → open IdP URL.
    console.log('sso', provider.key);
  };

  return (
    <Container>
      <IndiYStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$pageBg">
        <IndiCard width="100%" maxWidth={420} padding="$6" gap="$4">
          <IndiYStack gap="$2">
            <IndiH1>Welcome back</IndiH1>
            <IndiText color="$textSecondary">Sign in to your sprintOS workspace</IndiText>
          </IndiYStack>

          <IndiYStack gap="$3">
            <FormTextInput control={control} name="email" label="Email" placeholder="you@company.com.au" />
            <FormTextInput control={control} name="password" label="Password" secureTextEntry />
            <IndiButton type="solid" color="primary" loading={formState.isSubmitting} handlePress={handleSubmit(onSubmit)}>
              Sign in
            </IndiButton>
          </IndiYStack>

          {MOCK_SSO_PROVIDERS.length > 0 && (
            <IndiYStack gap="$3">
              <IndiSeparator />
              <IndiText color="$textNeutral" textAlign="center">
                or
              </IndiText>
              {MOCK_SSO_PROVIDERS.map((p) => (
                <IndiButton key={p.key} type="outline" color="secondary" handlePress={() => onSso(p)}>
                  {p.label}
                </IndiButton>
              ))}
            </IndiYStack>
          )}

          <IndiButton type="link" color="primary" handlePress={() => router.push('/(auth)/register')}>
            Create an account
          </IndiButton>
        </IndiCard>
      </IndiYStack>
    </Container>
  );
}
