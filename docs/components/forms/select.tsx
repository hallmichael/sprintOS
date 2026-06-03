import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import { IndiSelect, renderSelectWithIndicator } from '../selects/base';
import {
  IndiDepartmentSelect,
  IndiLicenseRoleSelect,
  IndiRoleSelect,
  IndiServiceTypeSelect,
  IndiStateSelect,
} from '../selects/common';
import { IndiSelectProps } from '../selects/type';

type FormSelect<TFormValues extends FieldValues> = Partial<IndiSelectProps> & UseControllerProps<TFormValues>;

export const FormSelectWithIndicator = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiSelect renderItem={renderSelectWithIndicator} error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormStateSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiStateSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormServiceTypeSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiServiceTypeSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormLicenseRoleSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiLicenseRoleSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormDepartmentSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiDepartmentSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};

export const FormRoleSelect = <T extends FieldValues>({ control, name, rules, ...props }: FormSelect<T>) => {
  return (
    <Controller
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <IndiRoleSelect error={error?.message} {...{ value, onChange }} {...props} />
      )}
      {...{ control, name, rules }}
    />
  );
};
