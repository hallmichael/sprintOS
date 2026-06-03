import React, { useState } from 'react';
import { Popover, PopoverProps } from 'tamagui';

import { Ellipsis } from '@tamagui/lucide-icons';
import { IndiButton, IndiButtonProps } from '../buttons';
import { IndiView } from '../views';

export type DropdownButtonProps = IndiButtonProps & {
  visible: boolean;
};

type IndiSelectSheetProps = {
  data?: DropdownButtonProps[];
  trigger?: React.ReactNode;
  triggerProps?: IndiButtonProps;
} & PopoverProps;

export const IndiSelectSheet = ({ data, trigger, triggerProps, ...props }: IndiSelectSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover allowFlip stayInFrame resize open={open} onOpenChange={setOpen} placement="bottom" {...props}>
      <Popover.Trigger asChild>
        {trigger || (
          <IndiButton
            color="secondary"
            type="ghost"
            size="sm"
            alignSelf="flex-start"
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
        borderWidth={1}
        p={'$2'}
        boxShadow="2px 4px 10px 4px rgba(0,0,0,0.06)"
        borderColor="$borderColor"
        bg="$dropdownBgDefault"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.15}
        shadowRadius={4}
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
                key={item.text}
                jc="flex-start"
                textProps={{ fontFamily: '$body' }}
                {...item}
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
};
