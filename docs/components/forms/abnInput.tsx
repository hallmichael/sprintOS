import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { IndiLabelInput, IndiLabelInputProps } from '../inputs/base';

// ABN formatting utility function
const formatABN = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Limit to 11 digits (ABN length)
  const limitedDigits = digits.slice(0, 11);
  
  // Format as "82 145 435 687"
  if (limitedDigits.length <= 2) {
    return limitedDigits;
  } else if (limitedDigits.length <= 5) {
    return limitedDigits.slice(0, 2) + ' ' + limitedDigits.slice(2);
  } else if (limitedDigits.length <= 8) {
    return limitedDigits.slice(0, 2) + ' ' + limitedDigits.slice(2, 5) + ' ' + limitedDigits.slice(5);
  } else {
    return limitedDigits.slice(0, 2) + ' ' + limitedDigits.slice(2, 5) + ' ' + limitedDigits.slice(5, 8) + ' ' + limitedDigits.slice(8);
  }
};

export type FormABNInputProps<TFormValues extends FieldValues = FieldValues> = 
  Omit<IndiLabelInputProps, 'inputProps'> & 
  UseControllerProps<TFormValues> & {
    onFormChange?: () => void;
    inputProps?: Omit<IndiLabelInputProps['inputProps'], 'onChangeText' | 'keyboardType' | 'value'>;
  };

export const CreateFormABNInput = <T extends FieldValues>() =>
  React.forwardRef<any, FormABNInputProps<T>>(
    ({ control, name, rules, onFormChange, inputProps, ...props }: FormABNInputProps<T>, ref?: any) => {
      return (
        <Controller
          {...{ control, name, rules }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <IndiLabelInput
              {...props}
              error={error?.message || props.error}
              ref={ref}
              inputProps={{
                ...inputProps,
                onChangeText: (text: string) => {
                  const formattedValue = formatABN(text);
                  onChange(formattedValue);
                  if (onFormChange) onFormChange();
                },
                onBlur,
                value: value || '',
                keyboardType: 'numeric',
              }}
            />
          )}
        />
      );
    },
  );

// Default export for common use cases
export const FormABNInput = CreateFormABNInput(); 