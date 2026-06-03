import { Option, OptionWithColor } from '@/types';
import { X } from '@tamagui/lucide-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { Spinner, isWeb } from 'tamagui';
import { IndiButton } from '../buttons';
import { HorizontalInputWrapper, OverlappingInputWrapper, VerticalInputWrapper } from '../inputs/wrapper';
import { IndiTags } from '../miscellaneous/tags';
import { IndiText } from '../text';
import { IndiCircle, IndiView, IndiXStack } from '../views/base';
import { IndiAutoComplete } from './autocomplete';
import { NUMBER_OF_VISIBLE_ROW } from './constant';
import { multiSelectToggleAllRow } from './multiSelectAllToggle';
import { SelectPopover } from './popover';
import { IndiSelectProps, Position } from './type';

export const IndiSelect = (props: React.PropsWithChildren<IndiSelectProps>) => {
  const {
    data: _data = [],
    value,
    label,
    error,
    disabled,
    labelProps,
    valueProps,
    type = 'vertical',
    prompt,
    numberOfVisibleRow = NUMBER_OF_VISIBLE_ROW,
    multiple,
    selectedOption,
    selectedOptions,
    containerProps,
    triggerWidth,
    clearable = false,
    loading,
    isSearchable,
    hasAllOption,
    onChange,
    onOptionChange,
    onOptionsChange,
    handleChange,
    renderItem,
    renderSelectedItem,
    handleSearch,
    ...restProps
  } = props;

  if (_data.length > 10) return <IndiAutoComplete {...props} />;

  const data = useMemo(() => {
    if (hasAllOption) {
      return [
        {
          label: 'All',
          value: null,
        },
        ..._data,
      ];
    }
    return _data;
  }, [_data, hasAllOption]);
  const Wrapper = useMemo(() => {
    if (type === 'horizontal') return HorizontalInputWrapper;
    if (type === 'overlapping') return OverlappingInputWrapper;
    return VerticalInputWrapper;
  }, [type]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const aref = useAnimatedRef<any>();
  const position = useSharedValue<Position>({ width: 0, height: 0, pageX: 0, pageY: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Reset highlighted index when dropdown closes
  useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1);
    }
  }, [open]);

  const _renderSelectedItem = renderSelectedItem || renderItem;

  const _selectedOption = selectedOption || data?.find(i => i.value == value);
  // Handle single and multiple selection display
  const selectedText = !multiple ? selectedOption?.label || data?.find(i => i.value == value)?.label : undefined;

  // If multiple selection, determine selected options
  const multiSelectedOptions = useMemo(() => {
    return (
      (selectedOptions && selectedOptions.length > 0 && selectedOptions) ||
      (Array.isArray(value) && value.length > 0 ? data?.filter(item => value.includes(item.value)) : [])
    );
  }, [selectedOptions, value, data]);

  // const handleOpen = useCallback(() => {
  //   Keyboard.dismiss();
  //   runOnUI(() => {
  //     'worklet';
  //     const measurements = reanimatedMeasure(aref);
  //     if (measurements) {
  //       const { width, height, pageX, pageY } = measurements;
  //       position.value = { width, height, pageX, pageY };
  //       runOnJS(setOpen)(true);
  //     }
  //   })();
  // }, []);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height, x, y } = e.nativeEvent.layout;
    position.value = { width, height, pageX: x, pageY: y };
    setContainerWidth(width);
  }, []);

  const handleClearSelection = useCallback(
    (e: any) => {
      e?.stopPropagation();
      onChange?.(null);
      onOptionChange?.(null);
      onOptionsChange?.([]);
    },
    [onChange, onOptionChange, onOptionsChange],
  );

  const onSelect = useCallback(
    async (option?: Option) => {
      if (multiple) {
        if (hasAllOption && option && option.value === null) {
          const newValue = multiSelectToggleAllRow(value, _data);
          const newSelectedOptions = dataOptions().filter(
            item =>
              item.value != null && newValue.some(nv => String(nv) === String(item.value)),
          );
          if (handleChange) {
            setIsLoading(true);
            await handleChange(option);
            setIsLoading(false);
          } else {
            onChange?.(newValue);
            onOptionsChange?.(newSelectedOptions);
          }
          return;
        }
        // Handle multiple selection
        const newValue = Array.isArray(value) ? [...value] : [];
        const optionIndex = newValue.indexOf(option?.value);

        if (optionIndex > -1) {
          // Remove if already selected
          newValue.splice(optionIndex, 1);
        } else if (option?.value !== undefined && option.value !== null) {
          // Add if not selected and value exists (skip pseudo "All" row: value null)
          newValue.push(option.value);
        }

        // Calculate the new selected options
        const newSelectedOptions = dataOptions().filter(item => newValue.includes(item.value));

        if (handleChange) {
          setIsLoading(true);
          await handleChange(option);
          setIsLoading(false);
        } else {
          onChange?.(newValue);
          onOptionsChange?.(newSelectedOptions);
        }
      } else {
        // Handle single selection
        if (handleChange) {
          setIsLoading(true);
          await handleChange(option);
          setIsLoading(false);
        } else {
          onChange?.(option?.value);
          onOptionChange?.(option);
        }

        // Close popover if not in multiple selection mode
        if (!multiple) {
          setOpen(false);
        }
      }
    },
    [onChange, onOptionChange, onOptionsChange, handleChange, multiple, value, data, hasAllOption, _data],
  );

  // Handle removing a selected item in multiple mode
  const handleRemoveItem = useCallback(
    (optionToRemove: Option) => {
      if (!multiple || !Array.isArray(value) || disabled) return;

      const newValue = value.filter(v => v !== optionToRemove.value);
      const newSelectedOptions = dataOptions().filter(item => newValue.includes(item.value));

      onChange?.(newValue);
      onOptionsChange?.(newSelectedOptions);
    },
    [multiple, value, onChange, onOptionsChange, data],
  );

  const dataOptions = useCallback(() => {
    const merged = [...(selectedOptions || []), ...data];
    // Ensure uniqueness by value
    const unique = merged.filter((option, index, self) => self.findIndex(o => o.value === option.value) === index);
    return unique;
  }, [data, selectedOptions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: any) => {
      if (!isWeb) return;

      const availableOptions = dataOptions();

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(0);
          } else if (highlightedIndex >= 0 && highlightedIndex < availableOptions.length) {
            // Select the highlighted option
            const selectedOption = availableOptions[highlightedIndex];
            onSelect(selectedOption);

            // For single select, close the dropdown and reset highlight
            if (!multiple) {
              setOpen(false);
              setHighlightedIndex(-1);
            }
          }
          break;
        case ' ':
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(0);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex(prev => (prev < availableOptions.length - 1 ? prev + 1 : 0));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(Math.max(0, availableOptions.length - 1));
          } else {
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : availableOptions.length - 1));
          }
          break;
        case 'Escape':
          if (open) {
            e.preventDefault();
            setOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case 'Tab':
          // Allow normal tab behavior
          if (open) {
            setOpen(false);
            setHighlightedIndex(-1);
          }
          break;
      }
    },
    [open, setOpen, highlightedIndex, dataOptions, onSelect, multiple],
  );

  const _loading = loading || isLoading;

  return (
    <Wrapper {...restProps}>
      <Wrapper.Label type={type} {...labelProps}>
        {label}
      </Wrapper.Label>
      <IndiView full>
        <SelectPopover
          open={open}
          onOpenChange={setOpen}
          data={dataOptions()}
          value={value}
          multiple={multiple}
          onChange={onSelect}
          numberOfVisibleRow={numberOfVisibleRow}
          triggerWidth={triggerWidth || containerWidth}
          renderItem={renderItem}
          handleSearch={handleSearch}
          isSearchable={isSearchable}
          highlightedIndex={highlightedIndex}>
          <Wrapper.Container
            id={restProps.id}
            key={restProps.id ? String(restProps.id) : undefined}
            ref={aref}
            focused={open && !restProps.disableFocus}
            minHeight={'$inputHeight'}
            gap={'$2'}
            onLayout={handleLayout}
            {...{ error, disabled }}
            {...(multiple && { flexWrap: 'wrap', height: 'auto', py: '$2' })}
            {...(isWeb && {
              tabIndex: disabled ? -1 : 0,
              onKeyDown: handleKeyDown,
              role: 'combobox',
              'aria-expanded': open,
              'aria-haspopup': 'listbox',
              'aria-label': label || 'Select option',
              'aria-describedby': error ? `${label}-error` : undefined,
            })}
            {...(!isWeb && {
              focusable: !disabled,
            })}
            {...containerProps}>
            {multiple ? (
              // Render multiple selected items
              <IndiXStack flexWrap="wrap" gap="$2" style={{ flex: 1 }}>
                {multiSelectedOptions.length > 0 ? (
                  multiSelectedOptions.map(option =>
                    renderSelectedItem ? (
                      renderSelectedItem(option, () => handleRemoveItem(option))
                    ) : (
                      <IndiTags key={option.value} text={option.label} onRemove={() => handleRemoveItem(option)} />
                    ),
                  )
                ) : (
                  <Wrapper.Value
                    full
                    placeholderText="Select items"
                    numberOfLines={1}
                    disabled={disabled}
                    {...valueProps}>
                    {/* Show placeholder for multiple select when empty */}
                    {valueProps?.children ? String(valueProps.children) : undefined}
                  </Wrapper.Value>
                )}
              </IndiXStack>
            ) : // Render single selected item
            _renderSelectedItem && _selectedOption ? (
              _renderSelectedItem(_selectedOption)
            ) : (
              <Wrapper.Value flex={1} {...valueProps} disabled={disabled} numberOfLines={1} ellipsizeMode="tail">
                {selectedText}
              </Wrapper.Value>
            )}
            {_loading ? (
              <Spinner size="small" />
            ) : value && clearable && !disabled ? (
              <IndiButton size="xs" color="secondary" icon={<X />} onPress={handleClearSelection} />
            ) : (
              <Wrapper.Icon name={'ChevronDown'} />
            )}
          </Wrapper.Container>
        </SelectPopover>
        <Wrapper.Error secondary={!error} red={!!error}>
          {error || prompt}
        </Wrapper.Error>
      </IndiView>
    </Wrapper>
  );
};

export const renderSelectWithIndicator = (option?: Option) => {
  return (
    <IndiXStack style={{ flex: 1 }} ai="center" gap="$2">
      <IndiCircle bg={(option as OptionWithColor)?.color as string} size={'$2'} />
      <IndiText>{option?.label}</IndiText>
    </IndiXStack>
  );
};
