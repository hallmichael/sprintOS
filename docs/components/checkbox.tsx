import { IndiParagraph, IndiText } from '@/components/text';
import { Check, Minus } from '@tamagui/lucide-icons';
import { forwardRef, useState } from 'react';
import { GetProps, XStack, styled } from 'tamagui';
import { IndiViewProps, IndiXStack } from './views';

// Use Variant to add the border color to the checkbox
type CheckboxProps = GetProps<typeof XStack> & {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  label?: string;
  isCircle?: boolean;
  variant?: 'default' | 'withBorder';
  indeterminate?: boolean;
  size?: number;
  containerProps?: IndiViewProps;
};

const StyledCheckbox = styled(XStack, {
  name: 'Checkbox',
  borderWidth: 1,
  borderColor: '$inputBorderDefault',
  bg: '$inputBgDefault',
  width: 20,
  height: 20,
  borderRadius: 4,
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    checked: {
      true: {
        backgroundColor: '$inputCheckboxBgSelected',
        borderColor: '$inputCheckboxBgSelected',
        hoverStyle: {
          borderColor: '$inputCheckboxBgSelected',
          backgroundColor: '$inputCheckboxBgSelected',
        },
      },
      false: {
        hoverStyle: {
          borderColor: '$inputBorderHover',
        },
      },
    },
    disabled: {
      true: {
        // opacity: 0.5,
        opacity: 1,
        borderColor: '$inputBorderDisabled',
        backgroundColor: '$inputBgDisabled',
        cursor: 'not-allowed',
        hoverStyle: {
          borderColor: '$inputBorderDisabled',
          backgroundColor: '$inputBgDisabled',
        },
      },
    },
    indeterminate: {
      true: {
        backgroundColor: '$inputCheckboxBgSelected',
        borderColor: '$inputCheckboxBorderSelected',
      },
    },
  } as const,
});

export const IndiCheckbox = forwardRef<any, CheckboxProps>((props, ref) => {
  const {
    checked = false,
    onChange,
    disabled,
    required,
    name,
    value,
    label,
    isCircle,
    variant,
    indeterminate,
    size = 20,
    containerProps,
    ...checkboxProps
  } = props;

  const [internalChecked, setInternalChecked] = useState(checked ?? false);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;

    setInternalChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <IndiXStack
      alignItems="center"
      gap="$2"
      py="$2"
      {...(variant === 'withBorder' && {
        borderWidth: 1,
        borderColor: props.disabled ? '$inputBorderDisabled' : '$border',
        p: '$3',
        mah: '$10',
        borderRadius: 8,
      })}
      onPress={handleToggle}
      {...containerProps}
      {...(disabled && {
        disabled: true,
        opacity: 1,
      })}>
      <StyledCheckbox
        ref={ref}
        checked={isChecked}
        onPress={handleToggle}
        borderRadius={isCircle ? 24 : 4}
        // pointerEvents={disabled ? 'none' : 'auto'}
        disabled={disabled}
        indeterminate={indeterminate}
        width={size}
        height={size}
        {...checkboxProps}>
        {isChecked && !indeterminate && (
          <Check size={14} color={disabled ? '$iconDisabled' : '$inputCheckboxIconSelected'} />
        )}
        {indeterminate && <Minus size={14} color={disabled ? '$iconDisabled' : '$inputCheckboxIconSelected'} />}
      </StyledCheckbox>
      {label && <IndiText>{label}</IndiText>}
    </IndiXStack>
  );
});
