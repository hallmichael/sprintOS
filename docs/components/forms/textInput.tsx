import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { IndiLabelInputProps, IndiLabelInput } from '../inputs/base';

export type FormTextInputProps<TFormValues extends FieldValues = FieldValues> = IndiLabelInputProps &
  UseControllerProps<TFormValues>;
export const CreateFormTextInput = <T extends FieldValues>() =>
  React.forwardRef<any, FormTextInputProps<T>>(
    ({ control, name, rules, ...props }: FormTextInputProps<T>, ref?: any) => {
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
                  onChangeText: onChange,
                  onBlur,
                  value: value?.toString(),
                  ...props.inputProps,
                }}
              />
            );
          }}
        />
      );
    },
  );
