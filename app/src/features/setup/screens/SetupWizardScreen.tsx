import {
  Container,
  IndiButton,
  IndiCard,
  IndiH1,
  IndiH3,
  IndiParagraph,
  IndiSeparator,
  IndiText,
  IndiXStack,
  IndiYStack,
  Toast,
} from '@/components';
import { FormCheckbox, FormNumberInput, FormSelect, FormTextInput } from '@/components/forms';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

// -- Types --
interface SetupForm {
  displayName: string;
  primaryColor: string;
  features: { crudBuilder: boolean; agents: boolean; rag: boolean; connectors: boolean };
  aiDefaultTier: 'fast' | 'balanced' | 'powerful';
  markupRate: number;
  paymentMethodId: string;
}

const STEPS = ['Branding', 'Features', 'AI model', 'Billing', 'Review'] as const;

// -- Mock Data (Sprint Digital will replace — GET /api/ai/tiers) --
const TIER_OPTIONS = [
  { label: 'Fast (Haiku) — cheap & quick', value: 'fast' },
  { label: 'Balanced (Sonnet) — default', value: 'balanced' },
  { label: 'Powerful (Sonnet 3.7) — deep reasoning', value: 'powerful' },
];

const schema = yup.object({
  displayName: yup.string().required('Display name is required'),
  primaryColor: yup.string().required('Pick a brand colour'),
  aiDefaultTier: yup.string().oneOf(['fast', 'balanced', 'powerful']).required(),
  markupRate: yup.number().min(0).max(10).required('Markup is required'),
  paymentMethodId: yup.string().required('Add a card to finish'),
});

export default function SetupWizardScreen() {
  const [step, setStep] = useState(0);

  const { control, handleSubmit, trigger } = useForm<SetupForm>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      displayName: 'Acme Plumbing',
      primaryColor: '#0055FF',
      features: { crudBuilder: true, agents: true, rag: false, connectors: false },
      aiDefaultTier: 'balanced',
      markupRate: 0.3,
      paymentMethodId: '',
    },
  });

  const next = async () => {
    const ok = await trigger();
    if (ok || step < STEPS.length - 1) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onFinish = (data: SetupForm) => {
    // TODO(api): PATCH /api/org/settings, /api/billing/settings, POST /api/billing/card.
    console.log('setup complete', data);
    Toast.success({ message: 'Setup complete — your workspace is ready' });
    router.replace('/(app)/(admin)/dashboard');
  };

  return (
    <Container>
      <IndiYStack gap="$4" padding="$4">
        <IndiH1>Set up your deployment</IndiH1>

        {/* Step indicator */}
        <IndiXStack gap="$2" flexWrap="wrap" alignItems="center">
          {STEPS.map((label, i) => (
            <IndiXStack key={label} gap="$2" alignItems="center">
              <IndiText color={i === step ? '$textPrimary' : i < step ? '$Green500' : '$textNeutral'} fontWeight="600">
                {i + 1}. {label}
              </IndiText>
              {i < STEPS.length - 1 && <IndiText color="$textNeutral">→</IndiText>}
            </IndiXStack>
          ))}
        </IndiXStack>
        <IndiSeparator />

        <IndiCard padding="$4" gap="$3">
          {step === 0 && (
            <IndiYStack gap="$3">
              <IndiH3>Branding</IndiH3>
              <FormTextInput control={control} name="displayName" label="Display name" />
              <FormTextInput control={control} name="primaryColor" label="Primary colour" placeholder="#0055FF" />
            </IndiYStack>
          )}

          {step === 1 && (
            <IndiYStack gap="$3">
              <IndiH3>Features</IndiH3>
              <FormCheckbox control={control} name="features.crudBuilder" label="AI CRUD builder" />
              <FormCheckbox control={control} name="features.agents" label="Agents" />
              <FormCheckbox control={control} name="features.rag" label="Data lake / RAG" />
              <FormCheckbox control={control} name="features.connectors" label="Connectors" />
            </IndiYStack>
          )}

          {step === 2 && (
            <IndiYStack gap="$3">
              <IndiH3>Default AI model tier</IndiH3>
              <FormSelect control={control} name="aiDefaultTier" label="Tier" data={TIER_OPTIONS} />
            </IndiYStack>
          )}

          {step === 3 && (
            <IndiYStack gap="$3">
              <IndiH3>Billing</IndiH3>
              <FormNumberInput control={control} name="markupRate" label="Markup rate (e.g. 0.30 = 30%)" />
              <FormTextInput
                control={control}
                name="paymentMethodId"
                label="Card token"
                placeholder="pm_… (from Stripe.js)"
              />
              <IndiParagraph color="$textSecondary">
                Card details are tokenised by Stripe — sprintOS never stores the card number.
              </IndiParagraph>
            </IndiYStack>
          )}

          {step === 4 && (
            <IndiYStack gap="$2">
              <IndiH3>Review</IndiH3>
              <IndiText color="$textSecondary">You’re all set. Finish to apply your configuration.</IndiText>
            </IndiYStack>
          )}
        </IndiCard>

        {/* Nav */}
        <IndiXStack gap="$3" justifyContent="space-between">
          <IndiButton type="outline" color="secondary" disabled={step === 0} handlePress={back}>
            Back
          </IndiButton>
          {step < STEPS.length - 1 ? (
            <IndiButton type="solid" color="primary" handlePress={next}>
              Next
            </IndiButton>
          ) : (
            <IndiButton type="solid" color="primary" handlePress={handleSubmit(onFinish)}>
              Finish setup
            </IndiButton>
          )}
        </IndiXStack>
      </IndiYStack>
    </Container>
  );
}
