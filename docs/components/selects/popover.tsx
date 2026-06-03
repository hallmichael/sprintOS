import { Option } from '@/types';
import React from 'react';
import { isWeb, Popover } from 'tamagui';
import { NUMBER_OF_VISIBLE_ROW } from './constant';
import { SelectList } from './list';

export type SelectPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Option[];
  value?: any;
  multiple?: boolean;
  onChange?: (option?: Option) => void;
  numberOfVisibleRow?: number;
  renderItem?: (option?: Option) => React.ReactNode;
  children: React.ReactNode;
  triggerWidth?: number;
  handleSearch?: ({ query, page }: { query: string; page?: number }) => Promise<any>;
  isSearchable?: boolean;
  highlightedIndex?: number;
};

export const SelectPopover = ({
  open,
  onOpenChange,
  data = [],
  value,
  multiple,
  onChange,
  numberOfVisibleRow = NUMBER_OF_VISIBLE_ROW,
  renderItem,
  children,
  triggerWidth = 0,
  handleSearch,
  isSearchable = true,
  highlightedIndex,
}: SelectPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange} placement="bottom-start" allowFlip stayInFrame>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Content
        p={0}
        borderWidth={1}
        borderColor="$borderColor"
        bg="$modalBg"
        borderRadius="$default"
        minHeight={'$inputHeight'}
        minWidth={Math.max(triggerWidth, 150)}
        width={isWeb ? '100%' : Math.max(triggerWidth || 150)}
        overflow="hidden"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        boxShadow={'2px 4px 10px 4px rgba(0,0,0,0.06)'}
        elevate
        alignSelf="flex-start"
        position="relative"
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        zIndex={100000002}>
        <Popover.Arrow size={'$2'} borderWidth={1} borderColor="$borderColor" />

        <SelectList
          data={data}
          value={value}
          multiple={multiple}
          numberOfVisibleRow={numberOfVisibleRow}
          onPress={onChange}
          renderItem={renderItem}
          handleSearch={handleSearch}
          isSearchable={isSearchable}
          highlightedIndex={highlightedIndex}
        />
      </Popover.Content>
    </Popover>
  );
};
