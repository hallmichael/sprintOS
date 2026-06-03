import { IndiH2 } from '@/components/text';
import { Spinner, YStack } from 'tamagui';

export const IndiLoader = () => {
  return (
    <YStack f={1} justifyContent="center" alignItems="center">
      <IndiH2>Indiflo</IndiH2>
      <Spinner mt={'$2'} size="large" />
    </YStack>
  );
};
