import { IndiParagraph } from '@/components/text';
import { RadioGroup, RadioGroupProps, styled } from 'tamagui';
import { IndiView, IndiViewProps, IndiXStack, IndiYStack } from './views';

export function IndiRadioGroupItemWithLabel(props: {
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'withBorder';
  onValueChange?: (value: string) => void;
}) {
  const { value, label, checked, disabled, variant, onValueChange } = props;
  const id = value;

  // Styled Radio Button Item
  const StyledRadioItem = styled(RadioGroup.Item, {
    borderWidth: 2,
    borderRadius: 1000, // Circular
    borderColor: '$gray400', // Default border color for unchecked state
    size: 24,
    tag: 'button',
    cursor: 'pointer',
    variants: {
      checked: {
        true: {
          borderColor: 'transparent',
          backgroundColor: '$inputCheckboxBgSelected',
          hoverStyle: {
            backgroundColor: '$inputCheckboxBgSelected',
            borderColor: '$inputCheckboxBgSelected',
          },
        },
        false: {
          borderColor: '$inputBorderDefault',
          backgroundColor: '$inputBgDefault',
        },
      },
      disabled: {
        true: {
          cursor: 'not-allowed',
          borderColor: '$inputBorderDisabled',
          backgroundColor: '$inputBgDisabled',
        },
      },
    },
  }) as any;

  // Styled Indicator for the inner circle
  const StyledIndicator = styled(RadioGroup.Indicator, {
    width: 8, // Inner circle size
    height: 8,
    borderRadius: 1000,
    backgroundColor: 'white', // Inner circle color
    position: 'absolute',
    variants: {
      checked: {
        true: {
          backgroundColor: 'white',
          hoverStyle: {
            backgroundColor: '$inputBgDefault',
          },
        },
        false: {
          backgroundColor: 'transparent',
        },
      },
      disabled: {
        true: {
          cursor: 'not-allowed',
          backgroundColor: '$inputBgDisabled',
        },
      },
    },
  }) as any;
  return (
    <IndiXStack
      alignItems="center"
      gap="$2"
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      {...(variant === 'withBorder' && {
        borderWidth: 1,
        borderColor: disabled ? '$inputBorderDisabled' : '$border',
        p: '$4',
        borderRadius: 8,
      })}
      onPress={() => onValueChange?.(value)}>
      <StyledRadioItem
        value={value}
        id={id}
        size={24}
        onPress={e => e.stopPropagation()}
        checked={checked}
        disabled={disabled}>
        <StyledIndicator checked={checked} disabled={disabled} />
      </StyledRadioItem>
      <IndiParagraph htmlFor={id}>{label}</IndiParagraph>
    </IndiXStack>
  );
}

type IndiRadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  flexDirection?: 'row' | 'column';
  layoutProps?: IndiViewProps;
  variant?: 'default' | 'withBorder';
} & RadioGroupProps;

export const IndiRadioGroup = (props: IndiRadioGroupProps) => {
  const { value, onValueChange, options, flexDirection = 'column', layoutProps } = props;
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <IndiView gap="$3" flexDirection={flexDirection} {...layoutProps}>
        {options.map(option => (
          <IndiRadioGroupItemWithLabel
            key={option.value}
            value={option.value}
            onValueChange={onValueChange}
            label={option.label}
            checked={option.value === value}
            disabled={option.disabled}
            variant={props.variant}
          />
        ))}
      </IndiView>
    </RadioGroup>
  );
};
