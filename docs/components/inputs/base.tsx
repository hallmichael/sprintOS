import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import { Input as TInput, InputProps as TInputProps, isWeb } from 'tamagui';
import { IconName } from '../icon';
import { IndiView, IndiViewProps } from '../views';
import { HorizontalInputWrapper, IndiInputLabelProps, OverlappingInputWrapper, VerticalInputWrapper } from './wrapper';

export const IndiInput = forwardRef((props: TInputProps, ref: any) => {
  return (
    <TInput
      ref={ref}
      placeholderTextColor="$textPlaceholder"
      color="$textNeutral"
      fontFamily="$heading"
      fontStyle="normal"
      fontWeight="400"
      // height={'$10'}
      fontSize={14}
      lineHeight={17}
      unstyled
      outlineStyle="none"
      cursor={!props.editable ? 'not-allowed' : undefined}
      disabled={!props.editable}
      disabledStyle={{
        color: '$textDisabled',
      }}
      {...(isWeb && {
        pointerEvents: 'auto',
        bg: '$colorTransparent',
      })}
      {...props}
    />
  );
});

export type IndiLabelInputProps = {
  type?: 'vertical' | 'horizontal' | 'overlapping';
  error?: string;
  nextRef?: React.MutableRefObject<TextInput | null | undefined>;
  inputProps?: TInputProps;
  label?: string;
  prompt?: string;
  promptColor?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  rightIconColor?: string;
  containerProps?: IndiViewProps;
  labelProps?: IndiInputLabelProps;
  area?: boolean;
  renderRight?: React.ReactNode;
  renderLeft?: React.ReactNode;
  disableClear?: boolean;
  readOnly?: boolean;
} & IndiViewProps;

export const IndiLabelInput = React.forwardRef(
  (
    {
      error,
      nextRef,
      label,
      inputProps,
      leftIcon,
      rightIcon,
      rightIconColor,
      labelProps,
      containerProps,
      renderRight,
      renderLeft,
      area,
      disableClear,
      prompt,
      promptColor = error ? undefined : '$textSecondary',
      type = 'vertical',
      disabled,
      readOnly,
      minWidth,
      ...props
    }: IndiLabelInputProps,
    ref?: any,
  ) => {
    const Wrapper = useMemo(() => {
      if (type === 'horizontal') return HorizontalInputWrapper;
      if (type === 'overlapping') return OverlappingInputWrapper;
      return VerticalInputWrapper;
    }, [type]);

    const [isFocused, setIsFocused] = useState(false);

    const onSubmitEditing = useCallback(
      (e: any) => {
        nextRef?.current?.focus();
        inputProps?.onSubmitEditing?.(e);
      },
      [inputProps, nextRef],
    );

    const returnKeyType = (() => {
      if (inputProps?.returnKeyType) return inputProps?.returnKeyType;
      if (area) {
        return 'default';
      }
      return nextRef ? 'next' : 'done';
    })();

    const onPressClear = () => {
      inputProps?.onChangeText?.('');
      ref?.current?.focus();
    };

    const onFocus = (e: any) => {
      e?.stopPropagation();
      if (readOnly) return;
      setIsFocused(true);
      inputProps?.onFocus?.(e);
    };
    const onBlur = (e: any) => {
      setIsFocused(false);
      inputProps?.onBlur?.(e);
    };

    const isInteractionDisabled = disabled || readOnly;

    return (
      <Wrapper {...props}>
        <Wrapper.Label {...labelProps}>{label}</Wrapper.Label>
        <IndiView full>
          <Wrapper.Container
            error={error}
            focused={readOnly ? false : isFocused}
            height={'$inputHeight'}
            disabled={isInteractionDisabled}
            gap={'$2'}
            {...(readOnly && { borderWidth: 0, px: 0 })}
            {...(area && { height: '$25', pt: '$2.5' })}
            {...containerProps}>
            {!!leftIcon && <Wrapper.Icon name={leftIcon} />}
            {renderLeft}
            <IndiInput
              flex={1}
              height={'100%'}
              editable={!isInteractionDisabled}
              {...(area && { multiline: true, height: '100%', verticalAlign: 'top' })}
              {...inputProps}
              {...{ ref, returnKeyType, onFocus, onBlur, onSubmitEditing }}
            />
            {!!inputProps?.value && !disableClear && !area && isFocused && !isWeb && !readOnly && (
              <Wrapper.Icon name={'X'} onPress={onPressClear} />
            )}
            {!!rightIcon && <Wrapper.Icon name={rightIcon} color={rightIconColor || undefined} />}
            {renderRight}
          </Wrapper.Container>
          <Wrapper.Error red={!!error} color={promptColor}>
            {error || prompt}
          </Wrapper.Error>
        </IndiView>
      </Wrapper>
    );
  },
);
