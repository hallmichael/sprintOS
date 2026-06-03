import { IndiButton, IndiButtonProps } from '@/components/buttons';
import { IndiView } from '@/components/views/base';
import { Ellipsis } from '@tamagui/lucide-icons';
import { useState } from 'react';
import type { PopoverProps } from 'tamagui';
import { Popover } from 'tamagui';

/** RN Web Modal uses z-index 9999; portal must be higher or menus render behind modals/drawers. */
const POPOVER_Z_INDEX_ABOVE_MODAL = 10_000;

type DropdownButtonProps = IndiButtonProps & {
  visible: boolean;
};

export function IndiDropdown({
  data,
  trigger,
  triggerProps,
  ...props
}: PopoverProps & {
  trigger?: React.ReactNode;
  data?: DropdownButtonProps[];
  triggerProps?: IndiButtonProps;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover allowFlip stayInFrame resize open={open} onOpenChange={setOpen} placement="bottom" {...props}>
      <Popover.Trigger asChild>
        {trigger || (
          <IndiButton
            color="secondary"
            type="ghost"
            size="sm"
            alignSelf="flex-end"
            fontWeight={500}
            icon={<Ellipsis size={16} />}
            onPress={e => {
              e.stopPropagation();
              setOpen(!open);
            }}
            {...triggerProps}
            // Use hover props from Tamagui
            // onHoverIn={() => setOpen(true)}
          />
        )}
      </Popover.Trigger>

      <Popover.Content
        zIndex={POPOVER_Z_INDEX_ABOVE_MODAL}
        borderWidth={1}
        p={'$2'}
        borderColor="$borderColor"
        bg="$dropdownBgDefault"
        boxShadow="$dropdownShadow"
        elevation={3}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        // Keep popover open when hovering over content
        // onHoverIn={() => setOpen(true)}
        // onHoverOut={() => {
        //   setOpen(false);
        // }}
      >
        <Popover.Arrow size={12} borderWidth={1} borderColor="$borderColor" bg="$dropdownBgDefault" />

        <IndiView minWidth={200}>
          {data
            ?.filter(item => item.visible)
            .map((item, index) => (
              <IndiButton
                jc="flex-start"
                key={index}
                textProps={{ fontFamily: '$body' }}
                {...{ ...item, visible: undefined }}
                onPress={e => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onPress?.(e);
                }}
                handlePress={
                  item.handlePress
                    ? async e => {
                        e.stopPropagation();
                        setOpen(false);
                        await item.handlePress?.(e);
                      }
                    : undefined
                }
              />
            ))}
        </IndiView>
      </Popover.Content>
    </Popover>
  );
}

export default IndiDropdown;
