import { IndiText } from '@/components/text';
import { IndiView, IndiXStack } from '@/components/views';
import { Option } from '@/types';
import { Check } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo } from 'react';
import { FlatList, SectionList } from 'react-native';
import { getTokens, isWeb } from 'tamagui';

type SelectListProps = {
  data: Option[];
  value?: any;
  multiple?: boolean;
  onPress?: (item: Option) => void;
  numberOfVisibleRow: number;
  renderItem?: (option?: Option) => React.ReactNode;
  handleSearch?: ({ query, page }: { query: string; page?: number }) => Promise<any>;
  isSearchable?: boolean;
  highlightedIndex?: number;
};

export const SelectList = React.forwardRef(
  (
    {
      data,
      numberOfVisibleRow,
      value,
      multiple,
      onPress,
      handleSearch,
      isSearchable = false,
      highlightedIndex,
      ...props
    }: SelectListProps,
    ref?: any,
  ) => {
    // const [searchQuery, setSearchQuery] = useState('');

    // Filter data based on search query
    // const filteredData = useMemo(() => {
    //   if (!searchQuery.trim()) return data;
    //   return data.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
    // }, [data, searchQuery]);
    const filteredData = data;

    const sections = useMemo(() => {
      const grouped: { [key: string]: Option[] } = {};
      const ungrouped: Option[] = [];

      filteredData.forEach(item => {
        const groupName = item.group?.name;
        if (groupName) {
          if (!grouped[groupName]) {
            grouped[groupName] = [];
          }
          grouped[groupName].push(item);
        } else {
          ungrouped.push(item);
        }
      });

      const hasGrouping = Object.keys(grouped).length > 0;

      const sectionedData = Object.keys(grouped).map(title => ({
        title,
        data: grouped[title],
      }));

      if (ungrouped.length > 0) {
        return [{ title: hasGrouping ? 'Other' : null, data: ungrouped }, ...sectionedData];
      }
      return sectionedData;
    }, [filteredData]);

    const highlightedItem = useMemo(
      () => (highlightedIndex !== undefined ? filteredData[highlightedIndex] : undefined),
      [filteredData, highlightedIndex],
    );

    // For single selection
    const selectedIndex = multiple ? -1 : filteredData.findIndex(i => i.value == value);

    // For multiple selection
    const isSelected = useCallback(
      (item: Option) => {
        if (!multiple || !value) return false;
        return Array.isArray(value) ? value.includes(item.value) : false;
      },
      [multiple, value],
    );

    const onScrollToIndexFailed = useCallback(async ({ index }: { index: number }) => {
      ref.current?.scrollToIndex({ index, animated: true });
    }, []);

    const renderMultipleSelect = useCallback(
      (item: Option) => (
        <IndiView
          center
          borderRadius={'$small'}
          border
          borderWidth={isSelected(item) && !item.isDisabled ? 0 : 1}
          bg={item.isDisabled ? '$inputBgDisabled' : isSelected(item) ? '$inputBgSelected' : '$inputBgDefault'}
          w={'$6'}
          h={'$6'}>
          {isSelected(item) && <Check color={item.isDisabled ? '$iconDisabled' : '$iconWhite'} size={12} />}
        </IndiView>
      ),
      [isSelected],
    );

    const renderSingleSelect = useCallback(
      (index: number) => selectedIndex === index && <Check color={'$iconPrimary'} size={16} />,
      [selectedIndex],
    );

    const renderItem = useCallback(
      ({ item }) => (
        <IndiXStack
          ai={'center'}
          px={'$2.5'}
          py={'$2'}
          minHeight={'$inputHeight'}
          backgroundColor={highlightedItem?.value === item.value ? '$listBgHover' : 'transparent'}
          hoverStyle={{
            backgroundColor: '$listBgHover',
          }}
          gap={'$3'}
          onPress={onPress?.bind(this, item)}
          disabled={item.isDisabled}>
          {props.renderItem ? (
            <>
              <IndiXStack flex={1} pointerEvents="none">
                {props.renderItem(item)}
              </IndiXStack>
              {!multiple && value === item.value && <Check color={'$iconPrimary'} size={16} />}
            </>
          ) : (
            <>
              {multiple && renderMultipleSelect(item)}
              <IndiText flex={1} numberOfLines={isWeb ? 1 : 2} ellipsizeMode="tail">
                {item.label}
              </IndiText>

              {!multiple && value === item.value && <Check color={'$iconPrimary'} size={16} />}
            </>
          )}
        </IndiXStack>
      ),
      [onPress, multiple, props.renderItem, renderMultipleSelect, value, highlightedItem],
    );

    const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string | null } }) => {
      if (!title) {
        return null;
      }
      return (
        <IndiXStack bg="$background" px="$3" py="$2">
          <IndiText bold>{title}</IndiText>
        </IndiXStack>
      );
    }, []);

    const inputHeight = getTokens().size.$inputHeight?.val || 40;

    // Calculate popup height based on number of rows
    const maxHeight = useMemo(() => {
      const itemCount = data.length;
      const visibleRows = Math.min(itemCount, numberOfVisibleRow);
      return Math.min(
        itemCount > numberOfVisibleRow ? visibleRows * inputHeight + inputHeight / 2 : itemCount * inputHeight,
        itemCount * inputHeight,
      );
    }, [data.length, numberOfVisibleRow, inputHeight]);

    return (
      <IndiView width={'100%'} maxHeight={maxHeight}>
        {/* {data.length > 20 && isSearchable && (
          <IndiSearchInput
            width={'100%'}
            p="$3"
            handleSearch={handleSearch}
            inputProps={{
              placeholder: 'Search',
              onChangeText: setSearchQuery,
              value: searchQuery,
            }}
          />
        )} */}
        {/* Use FlatList for ungrouped items, SectionList for grouped items */}
        {sections.length === 1 && sections[0].title === null ? (
          <FlatList
            style={{ width: '100%', height: '100%' }}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            data={sections[0].data}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <IndiView full center minHeight={'$inputHeight'}>
                <IndiText>No data</IndiText>
              </IndiView>
            )}
            ref={ref}
            renderItem={renderItem}
            initialNumToRender={Math.min(filteredData.length, numberOfVisibleRow + 2)}
            showsVerticalScrollIndicator={filteredData.length > numberOfVisibleRow}
          />
        ) : (
          <SectionList
            style={{ width: '100%', height: '100%' }}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            sections={sections}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <IndiView full center minHeight={'$inputHeight'}>
                <IndiText>No data</IndiText>
              </IndiView>
            )}
            // ListHeaderComponent={ListHeaderComponent}
            ref={ref}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            initialNumToRender={Math.min(filteredData.length, numberOfVisibleRow + 2)}
            showsVerticalScrollIndicator={filteredData.length > numberOfVisibleRow}
            stickySectionHeadersEnabled
          />
        )}
      </IndiView>
    );
  },
);
