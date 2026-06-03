import { CircleHelp } from '@tamagui/lucide-icons';
import React, { forwardRef, ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';
import { IndiButton } from '../buttons';
import { IndiIcon, IndiIconProps } from '../icon';
import { IndiTooltip } from '../miscellaneous/tooltip';
import { IndiErrorText, IndiLabel, IndiText, IndiTextProps } from '../text';
import { IndiView, IndiViewProps, IndiXStack } from '../views/base';

// New InputLabelContainer component
export type InputLabelContainerProps = {
  children?: React.ReactNode;
  rightButton?: React.ReactNode;
};

const InputLabelContainer = ({ children, rightButton }: InputLabelContainerProps) => {
  return (
    <IndiXStack mb="$1" gap="$2" jc={'space-between'} ai={'center'}>
      <IndiXStack full gap="$1" ai={'center'}>
        {children}
      </IndiXStack>
      {rightButton}
    </IndiXStack>
  );
};

// Required component
const Required = () => {
  return <IndiText red>*</IndiText>;
};

// Tooltip component
const TooltipIcon = ({ tooltip }: { tooltip?: string }) => {
  if (!tooltip) return null;
  return (
    <IndiTooltip tooltip={tooltip}>
      <CircleHelp color="$iconSecondary" size={14} />
    </IndiTooltip>
  );
};

// Right Button component
const RightButton = (props: any) => {
  return <IndiButton {...props} />;
};

export type IndiInputLabelProps = IndiTextProps & {
  required?: boolean;
  tooltip?: string;
  type?: 'vertical' | 'horizontal' | 'overlapping';
  rightButton?: React.ReactNode;
};

// Refactored InputLabel
export const InputLabel = (props: IndiInputLabelProps) => {
  if (!props.children) {
    return null;
  }

  const { required, tooltip, rightButton, ...labelProps } = props;

  if (required || tooltip || rightButton) {
    return (
      <InputLabelContainer rightButton={rightButton}>
        <IndiXStack gap="$1" full>
          <IndiLabel {...labelProps} />
          {required && <Required />}
        </IndiXStack>
        <TooltipIcon tooltip={tooltip} />
      </InputLabelContainer>
    );
  }

  return <IndiLabel mb="$1" {...labelProps} />;
};

const Error = (props: IndiTextProps) => {
  const hasError = !!props.children;

  if (!hasError) {
    return null;
  }
  return <IndiErrorText mt={'$2'} {...props} />;
};

export type ValueTextProps = IndiTextProps & { placeholderText?: string };

const Value = (props: ValueTextProps) => {
  const { placeholderText, ...rest } = props;
  const text = props.children;

  const color = (() => {
    if (props.disabled) return '$textDisabled';
    if (text) return '$textNeutral';
    return '$textPlaceholder';
  })();

  return (
    <IndiText color={color} numberOfLines={1} pointerEvents="none" {...rest}>
      {text || placeholderText || 'Select'}
    </IndiText>
  );
};

const InputIcon = (props: IndiIconProps) => {
  return <IndiIcon color={'$textSecondary'} size={16} {...props} />;
};

export type IndiInputContainerProps = IndiViewProps & {
  error?: string;
  focused?: boolean;
};

const Container = forwardRef((props: IndiInputContainerProps, ref?: any) => {
  const { error, focused, ...rest } = props;

  const borderColor = useMemo(() => {
    if (error) return '$inputBorderError';
    if (focused) return '$inputBorderActive';
    return '$inputBorderDefault';
  }, [error, focused]);

  const isHoverable = !rest.disabled && !error && !focused;
  const isFocused = focused && !rest.disabled;

  return (
    <IndiView
      ref={ref}
      fd="row"
      ai="center"
      h="$inputHeight"
      bg="$inputBgDefault"
      px={'$2.5'}
      borderRadius="$small"
      borderColor={borderColor}
      overflow={'hidden'}
      bw={1}
      disabledStyle={{
        bg: '$inputBgDisabled',
        borderColor: '$inputBorderDisabled',
      }}
      {...(isHoverable && { hoverStyle: { bc: '$inputBorderHover', bg: '$inputBgHover', bw: 1 } })}
      {...rest}
      {...(isFocused && { borderColor: '$inputBorderActive', bg: '$inputBgActive', borderWidth: 1 })}
    />
  );
});

type InputWrapperComponent = ForwardRefExoticComponent<IndiViewProps & RefAttributes<any>> & {
  Label: React.FC<IndiInputLabelProps & { rightButton?: React.ReactNode }>;
  LabelContainer: React.FC<InputLabelContainerProps>;
  LabelComponent: React.FC<Omit<IndiInputLabelProps, 'required' | 'tooltip'>>;
  Required: React.FC;
  Tooltip: React.FC<{ tooltip: string }>;
  RightButton: React.FC<any>;
  Container: ForwardRefExoticComponent<IndiInputContainerProps & RefAttributes<any>>;
  Error: React.FC<IndiTextProps>;
  Prompt: React.FC<IndiTextProps>;
  Value: React.FC<ValueTextProps>;
  Icon: React.FC<IndiIconProps>;
};

export const VerticalInputWrapper = React.forwardRef<any, IndiViewProps>(({ children, ...props }, ref) => (
  <IndiView ref={ref} $xs={{ width: '100%' }} {...props}>
    {children}
  </IndiView>
)) as InputWrapperComponent;

VerticalInputWrapper.Label = InputLabel;
VerticalInputWrapper.LabelContainer = InputLabelContainer;
VerticalInputWrapper.Required = Required;
VerticalInputWrapper.Tooltip = TooltipIcon;
VerticalInputWrapper.RightButton = RightButton;
VerticalInputWrapper.Container = Container;
VerticalInputWrapper.Error = Error;
VerticalInputWrapper.Value = Value;
VerticalInputWrapper.Icon = InputIcon;

// Horizontal Wrapper

const HorizontalInputLabel = (props: IndiInputLabelProps & { rightButton?: React.ReactNode }) => {
  return <InputLabel mt={'$2'} {...props} />;
};

export const HorizontalInputWrapper = React.forwardRef<any, IndiViewProps>(({ children, ...props }, ref) => (
  <IndiView fd="row" gap={'$2'} ref={ref} {...props}>
    {children}
  </IndiView>
)) as InputWrapperComponent;

HorizontalInputWrapper.Label = InputLabel;
HorizontalInputWrapper.LabelContainer = InputLabelContainer;
HorizontalInputWrapper.Required = Required;
HorizontalInputWrapper.Tooltip = TooltipIcon;
HorizontalInputWrapper.RightButton = RightButton;
HorizontalInputWrapper.Container = Container;
HorizontalInputWrapper.Error = Error;
HorizontalInputWrapper.Value = Value;
HorizontalInputWrapper.Icon = InputIcon;

export const OverlappingInputWrapper = React.forwardRef<any, IndiViewProps>(({ children, ...props }, ref) => (
  <IndiView ref={ref} {...props}>
    {children}
  </IndiView>
)) as InputWrapperComponent;

const OverlappingInputLabel = (props: IndiInputLabelProps & { rightButton?: React.ReactNode }) => {
  return (
    <IndiXStack gap="$1" position="absolute" top={-10} left={10} zIndex={1000} p={2} bg={'$containerBg'}>
      <IndiLabel size="xs" fontWeight={400} {...props} />
      {props.required && <Required />}
    </IndiXStack>
  );
};

OverlappingInputWrapper.Label = OverlappingInputLabel;
OverlappingInputWrapper.LabelContainer = InputLabelContainer;
OverlappingInputWrapper.Required = Required;
OverlappingInputWrapper.Tooltip = TooltipIcon;
OverlappingInputWrapper.RightButton = RightButton;
OverlappingInputWrapper.Container = Container;
OverlappingInputWrapper.Error = Error;
OverlappingInputWrapper.Value = Value;
OverlappingInputWrapper.Icon = InputIcon;
