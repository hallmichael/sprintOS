import { Nullable, Option } from '@/types';
import { IconName } from '../icon';
import { IndiLabelInputProps } from '../inputs/base';
import { IndiTextProps } from '../text';

export type Position = {
  height: number;
  width: number;
  pageX: number;
  pageY: number;
};

export type IndiSelectProps = {
  data?: Option[];
  value?: any | any[];
  selectedOption?: Option;
  selectedOptions?: Option[];
  onChange?: (value?: any) => void;
  onOptionChange?: (option?: Nullable<Option>) => void;
  onOptionsChange?: (options?: Option[]) => void;
  handleChange?: (option?: Option) => Promise<any>;
  valueProps?: IndiTextProps;
  numberOfVisibleRow?: number;
  multiple?: boolean;
  clearable?: boolean;
  renderItem?: (option?: Option) => React.ReactNode;
  renderSelectedItem?: (option: Option, onRemove?: () => void) => React.ReactNode;
  dropdonwIcon?: IconName;
  disableFocus?: boolean;
  triggerWidth?: number;
  handleSearch?: ({ query, page }: { query: string; page?: number }) => Promise<any>;
  isSearchable?: boolean;
  hasAllOption?: boolean;
  loading?: boolean;
} & IndiLabelInputProps;

export type IndiSelectInputProps = {
  value?: any;
  selectedOption?: Option;
  initialOptions?: Option[];
  onChange?: (value?: any) => void;
  onOptionChange?: (option?: Option) => void;
  onSearch?: (query: string) => Promise<Option[]>;
  maxModalHeight?: number;
  numberOfVisibleRow?: number;
} & IndiLabelInputProps;
