import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { IndiLabelInput, IndiLabelInputProps } from '../inputs/base';

export type FormNumberInputProps<TFormValues extends FieldValues = FieldValues> = IndiLabelInputProps &
  UseControllerProps<TFormValues> & {
    decimal?: boolean;
  };

export const CreateFormNumberInput = <T extends FieldValues>() =>
  React.forwardRef<any, FormNumberInputProps<T>>(
    ({ control, name, rules, decimal, ...props }: FormNumberInputProps<T>, ref?: any) => {
      return (
        <Controller
          {...{ control, name, rules }}
          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
            return (
              <IndiLabelInput
                {...props}
                error={error?.message || props.error}
                ref={ref}
                inputProps={{
                  keyboardType: decimal ? 'decimal-pad' : 'numeric',
                  ...props.inputProps,
                  onChangeText: text => {
                    if (text === '' || text === null || text === undefined) {
                      onChange(null);
                      return;
                    }
                    const parsed = decimal ? parseFloat(text) : parseInt(text, 10);
                    onChange(isNaN(parsed) ? null : parsed);
                  },
                  onBlur,
                  value: value != null ? value.toString() : '',
                }}
              />
            );
          }}
        />
      );
    },
  );
