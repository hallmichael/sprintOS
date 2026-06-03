import { IndiButton } from '@/components/buttons';
import { IndiTags } from '@/components/miscellaneous/tags';
import { IndiParagraph } from '@/components/text';
import { IndiView, IndiXStack, IndiYStack } from '@/components/views/base';
import { ListFilter } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Popover } from 'tamagui';
export interface AppliedFilter {
  name?: string;
  type?: string;
  label: string;
  value: string | string[];
}
interface IndiFilterProps {
  type: 'single' | 'group';
  filterText?: string;
  onReset?: () => void;
  onApply?: () => void;
  submitButtonText?: string;
  resetButtonText?: string;
  totalFiltered?: number;
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end';
  buttonProps?: any;
  fullWidth?: boolean;
}
export const IndiFilter = ({
  type = 'single',
  filterText = 'Filter',
  onReset,
  onApply,
  submitButtonText = 'Apply filters',
  resetButtonText = 'Clear all',
  totalFiltered,
  children,
  placement = 'bottom-end',
  buttonProps,
  fullWidth = false,
  ...props
}: IndiFilterProps) => {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    setOpen(false);
    if (onApply) {
      onApply();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <IndiYStack width={fullWidth ? '100%' : 'auto'}>
      <Popover allowFlip open={open} onOpenChange={setOpen} placement={placement} {...props}>
        <Popover.Trigger asChild>
          <IndiButton
            type="outline"
            color="secondary"
            size="lg"
            width={fullWidth ? '100%' : 'auto'}
            text={filterText}
            alignSelf={fullWidth ? 'stretch' : 'flex-start'}
            iconAfter={
              <IndiXStack ai={'center'} jc={'center'} ac="center" gap="$2">
                {!!totalFiltered && (
                  <IndiView
                    w={'$4'}
                    h={'$4'}
                    borderRadius="$small"
                    backgroundColor={'$Primary500'}
                    py="$2"
                    px="$1.5"
                    ai={'center'}
                    jc={'center'}>
                    <IndiParagraph color="$textWhite">{totalFiltered}</IndiParagraph>
                  </IndiView>
                )}
                <ListFilter size="$4" />
              </IndiXStack>
            }
            {...buttonProps}
          />
        </Popover.Trigger>

        <Popover.Content
          bg="$containerBg"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$gray6"
          display="flex"
          mt="$2"
          minWidth={type === 'single' ? '$60' : '$80'}
          boxShadow="$dropdownShadow"
          p={0}
          ai="stretch"
          zIndex={100000001}>
          <IndiFilterContent
            type={type}
            submitButtonText={submitButtonText}
            resetButtonText={resetButtonText}
            handleApply={handleApply}
            handleReset={handleReset}>
            {children}
          </IndiFilterContent>
        </Popover.Content>
      </Popover>
    </IndiYStack>
  );
};

export const IndiFilterContent = ({
  children,
  type,
  submitButtonText,
  resetButtonText,
  handleApply,
  handleReset,
}: {
  children: React.ReactNode;
  type: 'single' | 'group';
  submitButtonText: string;
  resetButtonText: string;
  handleApply: () => void;
  handleReset: () => void;
}) => {
  return (
    <IndiYStack px={type === 'single' ? '$2' : '$4'} py={type === 'single' ? '$3' : '$4'} gap="$3">
      {children}
      <IndiXStack
        justifyContent="space-between"
        pt="$3"
        {...(type === 'single' ? { borderTopWidth: 1, borderTopColor: '$border' } : {})}>
        {type == 'group' && (
          <IndiButton type="outline" color="secondary" size="lg" text={resetButtonText} onPress={handleReset} />
        )}
        <IndiButton
          type="solid"
          color="primary"
          size="lg"
          text={submitButtonText}
          onPress={handleApply}
          alignSelf="stretch"
          {...(type === 'single' ? { flex: 1 } : {})}
        />
      </IndiXStack>
    </IndiYStack>
  );
};

export const FilterTags = ({
  appliedFilters,
  setAppliedFilters,
  handleClearAll,
  type = 'single',
}: {
  appliedFilters: AppliedFilter[];
  setAppliedFilters: (appliedFilters: AppliedFilter[]) => void;
  handleClearAll: () => void;
  type: 'single' | 'group';
}) => {
  const handleRemoveFilter = (filterValue: string | string[], filterType?: string) => {
    setAppliedFilters(
      appliedFilters.filter(
        filter => !(filter.value === filterValue && (filter.type === filterType || type != 'group')),
      ),
    );
  };

  if (!appliedFilters.length) return null;

  return (
    <IndiXStack flexWrap="wrap" gap="$2" mt="$2" ai="center">
      <IndiParagraph>Filters applied:</IndiParagraph>
      {appliedFilters.map((filter, index) => (
        <IndiTags
          key={`${filter.type}-${filter.value}-${index}`}
          text={type === 'single' ? filter.name || filter.label : `${filter.name || filter.type} ${filter.label}`}
          onRemove={() => handleRemoveFilter(filter.value, filter.type)}
        />
      ))}
      <IndiButton type="ghost" color="secondary" size="sm" text="Clear all" onPress={handleClearAll} />
    </IndiXStack>
  );
};
