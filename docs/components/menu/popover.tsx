import type {PopoverProps} from 'tamagui';
import {Popover} from 'tamagui';

export function MenuPopOver({Icon, Name, children, trigger, placement = 'right', ...props}: PopoverProps & {Icon?: any; Name?: string; trigger?: React.ReactNode; placement?: string}) {
  return (
    <Popover size="$5" {...props} placement={placement}>
      <Popover.Trigger asChild>{trigger || <></>}</Popover.Trigger>

      <Popover.Content
        py="$2"
        px="$3"
        left={20}
        borderWidth={1}
        minWidth={192}
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
