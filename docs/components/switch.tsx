import { useState } from 'react';
import { Switch, SwitchProps } from 'tamagui';
import { IndiLabel } from './text';
import { IndiView } from './views';
type IndiSwitchProps = SwitchProps & {
  label?: string;
  error?: boolean;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
  labelFlexDirection?: 'row' | 'column';
};

export const IndiSwitch = ({
  label,
  onChange,
  error,
  checked,
  disabled,
  value,
  labelFlexDirection = 'row',
  ...props
}: IndiSwitchProps) => {
  const [checkedState, setCheckedState] = useState(checked);
  return (
    <IndiView flexDirection={labelFlexDirection} gap="$2">
      {label && (
        <IndiLabel w={labelFlexDirection === 'row' ? '$36' : '100%'} color={error ? '$textRed' : '$textSecondary'}>
          {label}
        </IndiLabel>
      )}
      <Switch
        size="$6"
        padding={0}
        checked={checkedState}
        onCheckedChange={checked => {
          console.log('checked', checked);
          setCheckedState(checked);
          onChange?.(checked);
        }}
        bg={checkedState ? '$inputSwitchBgOn' : disabled ? '$inputSwitchBgDisabled' : '$inputSwitchBgOff'}
        borderColor={checkedState ? '$inputSwitchBgOn' : '$inputSwitchBgOff'}
        cursor="pointer"
        disabled={disabled}
        disabledStyle={{
          borderColor: '$inputSwitchBgDisabled',
          cursor: 'not-allowed',
        }}
        {...props}>
        <Switch.Thumb animation="medium" bg={disabled ? '$inputSwitchHandleBgDisabled' : '$NeutralWhite'} />
      </Switch>
    </IndiView>
  );
};
