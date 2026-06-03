import { useCallback } from 'react';

import { Minus, Plus } from '@tamagui/lucide-icons';
import { IndiButton } from './buttons';
import { IndiText } from './text';
import { IndiViewProps, IndiXStack } from './views';

type IndiStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
} & IndiViewProps;

export function IndiStepper({ value = 1, min = 1, max = Number.MAX_VALUE, onChange, ...props }: IndiStepperProps) {
  const onPress = useCallback(
    (type: 'minus' | 'plus') => {
      let newValue = type === 'plus' ? value + 1 : value - 1;
      if (newValue < min) {
        newValue = min;
      }
      if (newValue > max) {
        newValue = max;
      }
      onChange?.(newValue);
    },
    [max, min, onChange, value],
  );

  return (
    <IndiXStack gap="$3" jc="flex-end" ai="center" {...props}>
      <IndiButton
        icon={<Minus />}
        size="sm"
        type="ghost"
        color="primary"
        onPress={() => onPress('minus')}
        disabled={value <= min}
      />
      <IndiText minWidth="$2">{value}</IndiText>
      <IndiButton
        icon={<Plus />}
        size="sm"
        type="ghost"
        color="primary"
        onPress={() => onPress('plus')}
        disabled={value >= max}
      />
    </IndiXStack>
  );
}
