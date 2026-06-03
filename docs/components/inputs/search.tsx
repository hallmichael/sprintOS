import { useSearchDebounce } from '@/hooks';
import React, { useCallback, useState } from 'react';
import { Spinner } from 'tamagui';
import { IndiLabelInput, IndiLabelInputProps } from './base';

export type IndiSearchInputProps = {
  onSearchText?: (query: string) => void;
  handleSearch?: ({ query, page }: { query: string; page?: number }) => Promise<any>;
  searching?: boolean;
} & IndiLabelInputProps;

export const IndiSearchInput = React.forwardRef(
  ({ handleSearch, inputProps, onSearchText, searching, ...props }: IndiSearchInputProps, ref?: any) => {
  const [isSearching, setSearching] = useState(false);
    const [value, setValue] = useState<string>(inputProps?.defaultValue || '');

    const onSearch = useCallback(
      async (text: string) => {
        if (handleSearch) {
          try {
            setSearching(true);
            await handleSearch?.({ query: text, page: 1 });
          } catch (error) {
            console.log(error);
          } finally {
            setSearching(false);
          }
        } else {
          onSearchText?.(text);
        }
      },
      [handleSearch, props],
    );

    const searchDebounce = useSearchDebounce(onSearch, 500);

    const onChangeText = useCallback(
      (text: string) => {
        setValue(text);
        searchDebounce(text);
        inputProps?.onChangeText?.(text);
      },
      [inputProps, searchDebounce],
    );

    return (
      <IndiLabelInput
        ref={ref}
        rightIcon={isSearching ? undefined : 'Search'}
        inputProps={{
          placeholder: 'Search',
          returnKeyType: 'search',
          autoCapitalize: 'none',
          value,
          ...inputProps,
          onChangeText,
        }}
        renderRight={isSearching && <Spinner size="small" />}
        {...props}
      />
    );
  },
);
