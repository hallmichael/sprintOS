import type {PopoverProps} from 'tamagui';
import {Adapt, Popover} from 'tamagui';

export function MenuPopOver({Icon, Name, children, trigger, placement = 'right', ...props}: PopoverProps & {Icon?: any; Name?: string; trigger?: React.ReactNode; placement: string}) {
  return (
    <Popover size={'$3'} {...props} placement={placement}>
      <Popover.Trigger asChild>{trigger || <></>}</Popover.Trigger>
      <Adapt>
        <Popover.Sheet modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame padding="$4" zIndex={1000000}>
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay animation="lazy" enterStyle={{opacity: 0}} exitStyle={{opacity: 0}} />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        py="$2"
        px="$3"
        left={20}
        borderWidth={1}
        minWidth={192}
        width="100%"
        alignItems="flex-start"
        bg="$dropdownBgDefault"
        borderColor="$borderColor"
        enterStyle={{x: -10, opacity: 0}}
        exitStyle={{x: -10, opacity: 0}}
        elevate
        animation={['quick', {opacity: {overshootClamping: true}}]}
        zIndex={100000}>
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" bg="$dropdownBgDefault" />
        {children}
      </Popover.Content>
    </Popover>
  );
}
