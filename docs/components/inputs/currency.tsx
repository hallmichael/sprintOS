import React from 'react';

import AppUtils from '@/utils/AppUtils';
import { IndiLabelInput } from './base';
import { IndiLabelInputProps } from './base';

export type CurrencyInputProps = {
  currency?: string;
} & IndiLabelInputProps;

export const IndiCurrencyInput = React.forwardRef(
  ({ inputProps, currency = '$', ...props }: CurrencyInputProps, ref?: any) => {
    const inputValue = inputProps?.value || '';

    // Handle both number and decimal string inputs
    const formattedValue = inputValue
      ? // Check if it's a decimal entry in progress (ending with '.')
        inputValue.endsWith('.')
        ? `${AppUtils.formatNumber(parseFloat(inputValue.slice(0, -1)))}.`
        : // Check if it contains decimal part
        inputValue.includes('.') && inputValue.split('.')[1] === ''
        ? `${AppUtils.formatNumber(parseFloat(inputValue.split('.')[0]))}.`
        : AppUtils.formatNumber(parseFloat(inputValue))
      : '';

    const value = formattedValue ? `${currency}${formattedValue}` : '';

    const onChangeText = React.useCallback(
      (input: string) => {
        // Remove currency symbol before converting
        const valueWithoutCurrency = input.replace(currency, '');

        // Handle decimal input cases
        let processedValue = AppUtils.reverseFormatNumber(valueWithoutCurrency);

        // If the user is typing a decimal, preserve it
        if (valueWithoutCurrency.endsWith('.')) {
          processedValue = processedValue + '.';
        }
        // If there's a decimal part being entered
        else if (valueWithoutCurrency.includes('.')) {
          const parts = valueWithoutCurrency.split('.');
          if (parts.length > 1 && parts[1] === '') {
            processedValue = processedValue + '.';
          }
        }

        inputProps?.onChangeText?.(processedValue);
      },
      [inputProps, currency],
    );

    return (
      <IndiLabelInput
        ref={ref}
        {...props}
        // leftIcon={'DollarSign'}
        inputProps={{
          keyboardType: 'numeric',
          returnKeyType: 'done',
          ...inputProps,
          onChangeText,
          value,
        }}
      />
    );
  },
);
