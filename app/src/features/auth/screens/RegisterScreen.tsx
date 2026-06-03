import { Container, IndiCard, IndiH1, IndiText, IndiYStack, Toast } from '@/components';
import { IndiButton } from '@/components/buttons';
import { FormTextInput } from '@/components/forms';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
interface RegisterForm {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function RegisterScreen() {
  const { control, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', password: '', passwordConfirmation: '' },
  });

  const onSubmit = (data: RegisterForm) => {
    // TODO(api): POST /api/auth/register { tenant_id, name, email, password } → token.
    console.log('register', data);
    Toast.success({ message: 'Account created' });
    router.replace('/(app)/(user)/dashboard');
  };

  return (
    <Container>
      <IndiYStack flex={1} justifyContent="center" alignItems="center" padding="$4" backgroundColor="$pageBg">
        <IndiCard width="100%" maxWidth={420} padding="$6" gap="$4">
          <IndiYStack gap="$2">
            <IndiH1>Create account</IndiH1>
            <IndiText color="$textSecondary">Join your organisation on sprintOS</IndiText>
          </IndiYStack>

          <IndiYStack gap="$3">
            <FormTextInput control={control} name="name" label="Full name" placeholder="Jordan Smith" />
            <FormTextInput control={control} name="email" label="Email" placeholder="you@company.com.au" />
            <FormTextInput control={control} name="password" label="Password" secureTextEntry />
            <FormTextInput control={control} name="passwordConfirmation" label="Confirm password" secureTextEntry />
            <IndiButton type="solid" color="primary" loading={formState.isSubmitting} handlePress={handleSubmit(onSubmit)}>
              Create account
            </IndiButton>
          </IndiYStack>

          <IndiButton type="link" color="primary" handlePress={() => router.push('/(auth)/login')}>
            I already have an account
          </IndiButton>
        </IndiCard>
      </IndiYStack>
    </Container>
  );
}
