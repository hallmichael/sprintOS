import { IndiCheckbox, VerticalInputWrapper } from '@/components';
import { IndiView, IndiViewProps, IndiXStack } from '@/components/views';
import { useStateOptions } from '@/redux/app/selectors';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

type FormStateCheckboxesProps<TFormValues extends FieldValues> = Partial<IndiViewProps> &
  UseControllerProps<TFormValues> & {
    label?: string;
  };

export const FormStateCheckboxes = <T extends FieldValues>({
  control,
  name,
  rules,
  label,
  disabled,
  ...props
}: FormStateCheckboxesProps<T>) => {
  const stateOptions = useStateOptions();

  return (
    <Controller
      {...{ control, name, rules }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <VerticalInputWrapper {...props}>
          <VerticalInputWrapper.Label required>{label || 'Valid states:'}</VerticalInputWrapper.Label>
          <IndiView>
            <IndiXStack>
              <IndiCheckbox
                label={'All'}
                checked={value?.length === stateOptions.length}
                onChange={(checked: boolean) => {
                  onChange(checked ? stateOptions.map(s => s.id) : []);
                }}
                disabled={disabled}
              />
            </IndiXStack>
            <IndiXStack gap="$6" jc="space-between" $md={{ flexWrap: 'wrap', jc: 'flex-start', gap: '$4' }}>
              {stateOptions.map(state => (
                <IndiCheckbox
                  key={state.label}
                  label={state.label}
                  checked={value.includes(state.id)}
                  onChange={(checked: boolean) => {
                    onChange(checked ? [...value, state.id] : value.filter(id => id !== state.id));
                  }}
                  disabled={disabled}
                />
              ))}
            </IndiXStack>
          </IndiView>
          <VerticalInputWrapper.Error>{error?.message}</VerticalInputWrapper.Error>
        </VerticalInputWrapper>
      )}
    />
  );
};
