import { useSearchDebounce } from '@/hooks';
import { Option } from '@/types';
import { X } from '@tamagui/lucide-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, TextInput } from 'react-native';
import { useAnimatedRef, useSharedValue } from 'react-native-reanimated';
import { Spinner, isWeb } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiInput } from '../inputs/base';
import { HorizontalInputWrapper, OverlappingInputWrapper, VerticalInputWrapper } from '../inputs/wrapper';
import { IndiTags } from '../miscellaneous/tags';
import { IndiView } from '../views';
import { IndiXStack } from '../views/base';
import { NUMBER_OF_VISIBLE_ROW } from './constant';
import { multiSelectToggleAllRow } from './multiSelectAllToggle';
import { SelectPopover } from './popover';
import { IndiSelectProps, Position } from './type';

export type IndiAutoCompleteProps = IndiSelectProps & {
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Filter function for options based on input text
   */
  onFilter?: (options: Option[], query: string) => Option[];
  /**
   * Initial input text value
   */
  inputValue?: string;
  /**
   * Allow creating custom entries when no results found
   */
  isCustomInput?: boolean;
};

export const IndiAutoComplete = ({
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
  placeholder,
  isCustomInput = false,
  inputProps,
  onFilter,
  inputValue: controlledInputValue,
  onChange,
  onOptionChange,
  onOptionsChange,
  handleChange,
  renderItem,
  renderSelectedItem,
  handleSearch,
  ...props
}: React.PropsWithChildren<IndiAutoCompleteProps>) => {
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
  const inputRef = useRef<TextInput>(null);
  const position = useSharedValue<Position>({ width: 0, height: 0, pageX: 0, pageY: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // Reset highlighted index when dropdown closes
  useEffect(() => {
    if (!open) {
      setHighlightedIndex(-1);
      setSearchText('');
    } else {
      // inputRef.current?.focus();
    }
  }, [open]);

  const handleContainerFocus = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const _renderSelectedItem = renderSelectedItem || renderItem;

  const _selectedOption = selectedOption || data?.find(i => i.value == value);

  const [inputText, setInputText] = useState(controlledInputValue || _selectedOption?.label || '');
  const [searchText, setSearchText] = useState('');

  const searchDebounce = useSearchDebounce(handleSearch, 500);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputText(text);
      setSearchText(text);
      setOpen(true);
    },
    [handleSearch],
  );
  useEffect(() => {
    searchDebounce?.({ query: searchText });
  }, [searchText]);
  // Handle single and multiple selection display
  const selectedText = !multiple ? selectedOption?.label || data?.find(i => i.value == value)?.label : undefined;

  useEffect(() => {
    if (selectedText) {
      setInputText(selectedText);
    } else {
      setInputText('');
    }
  }, [selectedText]);
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
    [onChange, onOptionChange],
  );

  const onSelect = useCallback(
    async (option?: Option) => {
      if (multiple) {
        if (hasAllOption && option && option.value === null) {
          const newValue = multiSelectToggleAllRow(value, _data);
          const newSelectedOptions = _data
            .filter(
              item =>
                item.value != null && newValue.some(nv => String(nv) === String(item.value)),
            )
            .map(item => ({ ...item, label: item.isCustom ? item.value : item.label }));
          if (handleChange) {
            setIsLoading(true);
            await handleChange(option);
            setIsLoading(false);
          } else {
            onChange?.(newValue);
            onOptionsChange?.(newSelectedOptions);
          }
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
          setInputText('');
          setSearchText('');
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
        const newSelectedOptions = dataOptions
          .filter(item => newValue.includes(item.value))
          .map(item => ({ ...item, label: item.isCustom ? item.value : item.label }));

        if (handleChange) {
          setIsLoading(true);
          await handleChange(option);
          setIsLoading(false);
        } else {
          onChange?.(newValue);
          onOptionsChange?.(newSelectedOptions);
        }

        // Refocus the input after selection in multiple mode
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
        setInputText('');
        setSearchText('');
      } else {
        // Handle single selection
        if (handleChange) {
          setIsLoading(true);
          await handleChange(option);
          setIsLoading(false);
        } else {
          onChange?.(option?.value);
          onOptionChange?.({ ...option, label: option?.isCustom ? option?.value : option?.label });
        }
        setInputText(option?.isCustom ? option?.value : option?.label || '');

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
      const newSelectedOptions = dataOptions.filter(item => newValue.includes(item.value));

      onChange?.(newValue);
      onOptionsChange?.(newSelectedOptions);
    },
    [multiple, value, onChange, onOptionsChange, data],
  );

  const dataOptions = useMemo(() => {
    const merged = [
      ...(selectedOptions || []),
      ...data.filter(item => !searchText || item.label.toLowerCase().includes(searchText.toLowerCase())),
    ];
    // Ensure uniqueness by value
    const unique = merged.filter(
      (option, index, self) => option.value !== undefined && self.findIndex(o => o.value === option.value) === index,
    );
    if (isCustomInput && !unique.length && searchText) {
      return [{ label: `Use "${searchText}"`, value: searchText, isCustom: true }];
    }
    return unique;
  }, [data, selectedOptions, searchText, isCustomInput]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: any) => {
      if (!isWeb) return;

      const availableOptions = dataOptions;

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
  const _placeholder = placeholder || inputProps?.placeholder || 'Select items';

  return (
    <Wrapper {...props}>
      <Wrapper.Label type={type} {...labelProps}>
        {label}
      </Wrapper.Label>
      <IndiView full>
        <SelectPopover
          key={props.id}
          open={open}
          onOpenChange={setOpen}
          data={dataOptions}
          value={value}
          multiple={multiple}
          onChange={onSelect}
          numberOfVisibleRow={numberOfVisibleRow}
          triggerWidth={triggerWidth || containerWidth}
          renderItem={renderItem}
          handleSearch={handleSearch}
          isSearchable={false}
          highlightedIndex={highlightedIndex}>
          <Wrapper.Container
            id={props.id}
            key={props.id ? String(props.id) : undefined}
            ref={aref}
            focused={open && !props.disableFocus}
            minHeight={'$inputHeight'}
            gap={'$2'}
            onLayout={handleLayout}
            {...{ error, disabled }}
            {...(multiple && { flexWrap: 'wrap', height: 'auto', py: '$2' })}
            {...(isWeb && {
              tabIndex: disabled ? -1 : 0,
              onKeyDown: handleKeyDown,
              onFocus: handleContainerFocus,
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
                {multiSelectedOptions.length > 0 &&
                  multiSelectedOptions
                    .filter(option => !option.hideTag)
                    .map(option =>
                      renderSelectedItem ? (
                        renderSelectedItem(option, () => handleRemoveItem(option))
                      ) : (
                        <IndiTags key={option.value} text={option.label} onRemove={() => handleRemoveItem(option)} />
                      ),
                    )}
                <IndiInput
                  ref={inputRef}
                  flex={1}
                  value={inputText}
                  placeholder={multiSelectedOptions.length > 0 ? undefined : _placeholder}
                  onChangeText={handleInputChange}
                  editable={!disabled}
                  minWidth={100}
                  {...(isWeb && {
                    autoComplete: 'off',
                  })}
                />
              </IndiXStack>
            ) : // Render single selected item
            _renderSelectedItem && _selectedOption ? (
              _renderSelectedItem(_selectedOption)
            ) : (
              <IndiInput
                ref={inputRef}
                flex={1}
                value={inputText}
                placeholder={selectedText || _placeholder}
                onChangeText={handleInputChange}
                editable={!disabled}
                minWidth={100}
                {...(isWeb && {
                  autoComplete: 'off',
                })}
              />
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
