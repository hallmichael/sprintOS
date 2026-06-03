import { Toast } from '@/components/toast';
import { useSearchDebounce } from '@/hooks';
import { Option } from '@/types';
import AppUtils from '@/utils/AppUtils';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { TextInput } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Spinner } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiInput } from '../inputs/base';
import { HorizontalInputWrapper, VerticalInputWrapper } from '../inputs/wrapper';
import { IndiView } from '../views';
import { SelectPopover } from './popover';
import { IndiSelectInputProps, Position } from './type';

export const IndiSelectInput = React.forwardRef(
  (
    {
      value,
      selectedOption,
      labelProps,
      label,
      style,
      error,
      type = 'vertical',
      inputProps,
      initialOptions,
      disabled,
      onChange,
      onOptionChange,
      onSearch,
      numberOfVisibleRow,
      containerProps,
      ...props
    }: IndiSelectInputProps,
    ref?: any,
  ) => {
    const Wrapper = type === 'vertical' ? VerticalInputWrapper : HorizontalInputWrapper;
    const containerRef = React.useRef<any>();
    const inputRef = React.useRef<TextInput>();

    const position = useSharedValue<Position>({ width: 0, height: 0, pageX: 0, pageY: 0 });

    const [options, setOptions] = React.useState<Option[]>(initialOptions || []);
    const [open, setVisible] = React.useState(false);
    const [focused, setIsFocused] = React.useState(false);
    // const [searchText, setSearchText] = React.useState('');
    const selectedText = options.find(i => i.value === value)?.label || selectedOption?.label || value;

    const [isLoading, setIsLoading] = React.useState(false);
    const [triggerWidth, setTriggerWidth] = React.useState(0);

    const handleSearch = React.useCallback(
      async (query: string) => {
        try {
          setIsLoading(true);
          const [o] = await Promise.all([onSearch?.(query), AppUtils.delay(500)]);
          setOptions(o || []);
          containerRef.current.measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
              position.value = { width, height, pageX, pageY };
              setTriggerWidth(width);
            },
          );
          setVisible(true);
        } catch (err: any) {
          Toast.show(err);
          throw err;
        } finally {
          setIsLoading(false);
        }
      },
      [onSearch, position],
    );

    const searchDebounce = useSearchDebounce(handleSearch, 300);

    const onChangeText = React.useCallback(
      async (text: string) => {
        // setSearchText(text);
        inputProps?.onChangeText?.(text);
        if (text) {
          searchDebounce?.(text);
        } else {
          setOptions([]);
          onChange?.(null);
        }
      },
      [inputProps, onChange, searchDebounce],
    );

    const handleSelectOption = React.useCallback(
      (option?: Option) => {
        onChange?.(option?.value);
        onOptionChange?.(option);
        setVisible(false);
        // setSearchText('');
      },
      [onChange],
    );

    const onBlur = React.useCallback(
      (e: any) => {
        setIsFocused(false);
        inputProps?.onBlur?.(e);
      },
      [inputProps],
    );

    const onFocus = React.useCallback(
      async (e: any) => {
        setIsFocused(true);
        containerRef.current.measure(
          (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
            position.value = { width, height, pageX, pageY };
            setTriggerWidth(width);
          },
        );
        if (initialOptions && initialOptions.length > 0) {
          setOptions(initialOptions);
          setVisible(true);
        } else if (options.length > 0) {
          setVisible(true);
        }
        inputProps?.onFocus?.(e);
      },
      [inputProps, options.length, initialOptions, position],
    );

    const handleOpenChange = React.useCallback((open: boolean) => {
      setVisible(open);
    }, []);

    const handleClearSelection = React.useCallback(() => {
      onChange?.(null);
      inputRef.current?.focus();
    }, [onChange]);

    return (
      <Wrapper {...props} ref={containerRef}>
        <Wrapper.Label {...labelProps}>{label}</Wrapper.Label>
        <IndiView full>
          <SelectPopover
            open={open}
            onOpenChange={handleOpenChange}
            data={options}
            value={value}
            onChange={handleSelectOption}
            numberOfVisibleRow={numberOfVisibleRow}
            triggerWidth={triggerWidth}>
            <Wrapper.Container ref={ref} borderWidth={1} {...{ error, disabled, focused }} {...containerProps}>
              {selectedText ? (
                <Wrapper.Value full numberOfLines={1} mr="$1">
                  {selectedText}
                </Wrapper.Value>
              ) : (
                <IndiInput
                  ref={inputRef}
                  f={1}
                  height={'100%'}
                  placeholder={inputProps?.placeholder || 'Search...'}
                  editable
                  {...inputProps}
                  {...{ onChangeText, onBlur, onFocus }}
                />
              )}
              {isLoading ? (
                <Spinner />
              ) : selectedText ? (
                <IndiButton
                  color="secondary"
                  type="link"
                  size="xs"
                  width={'$6'}
                  height={'$7'}
                  icon={<X />}
                  disabled={inputProps?.disabled}
                  onPress={handleClearSelection}
                />
              ) : (
                <Wrapper.Icon name="ChevronDown" />
              )}
            </Wrapper.Container>
          </SelectPopover>
          <Wrapper.Error>{error}</Wrapper.Error>
        </IndiView>
      </Wrapper>
    );
  },
);
