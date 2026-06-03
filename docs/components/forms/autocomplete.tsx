import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { IndiAutoComplete, IndiAutoCompleteProps } from '../selects/autocomplete';

type FormAutocompleteProps<TFormValues extends FieldValues> = Partial<IndiAutoCompleteProps> &
  UseControllerProps<TFormValues>;

export const FormAutocomplete = <T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: FormAutocompleteProps<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiAutoComplete error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};
