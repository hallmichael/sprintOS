import { OrderByClause, PaginatorInfo, SortOrder } from '@/graphql/graphql';
import React from 'react';
import { IndiViewProps } from '../views';

export type IndiColumn<T> = {
  // The specify which way that column is aligned
  align?: 'left' | 'center' | 'right';
  // Span of this column's title
  colSpan?: number;
  // Whether to show sortable
  sortable?: boolean;
  // Display field of the data record, support nest path by string array
  dataIndex: string | string[];
  // Default order of sorted values
  defaultSortOrder?: SortOrder;
  // Current order of sorted values
  sortOrder?: SortOrder;
  // Custom column name to use for ordering (if different from dataIndex)
  orderByKey?: string;
  // Renderer of the table cell. value is the value of current cell; record is the value object of current row; index is the row number. The return value should be a ReactNode
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
  // Set scope attribute for all cells in this column
  rowScope?: 'row' | 'rowgroup';
  // Title of this column
  title?: string;
  // Custom column title
  titleComponent?: React.ReactNode;
  // Width of this column
  width?: number | string;
  // Minimum width of this column
  minWidth?: number | string;
  // Maximum width of this column
  maxWidth?: number | string;
  // Whether to hide this column
  hidden?: boolean;
  // apply a custom style to the column
  viewProps?: IndiViewProps;
  // Whether this column should be fixed (left or right)
  fixed?: 'left' | 'right';
};

// Base configuration shared between IndiTableProps and TableContextType
export type TableBaseConfig = {
  // Whether to show all table borders
  bordered?: boolean;
  // Whether to show loading status
  loading?: boolean;
  // Whether to show scrollbar
  scroll?: boolean;
  // Whether to show header
  showHeader?: boolean;
  // Size of table
  size?: 'xs' | 'sm' | 'md' | 'lg';
  // Empty state message
  emptyStateMessage?: string;
  // Whether to show row selection
  showRowSelection?: boolean;
  // Whether to allow row sorting via drag and drop
  showRowSortable?: boolean;
  // Footer of table
  footer?: React.ReactNode;
  // Error message to display
  error?: string;
  // Whether to enable fixed columns functionality
  fixedColumns?: boolean;
  // Selected row keys (for controlled component usage)
  selectedRowKeys?: React.Key[];
  // Set props on per table
  tableProps?: IndiViewProps;
};

// Pagination and sorting configuration
export type TableDataConfig<T> = {
  // Columns of table
  columns: IndiColumn<T>[];
  // Data record array to be displayed
  data: T[];
  // Key of row
  rowKey: keyof T | ((record: T) => string);
  // Pagination info
  paginationInfo?: PaginatorInfo;
  // Initial orderBy clauses
  orderBy?: OrderByClause[];
};

// Table event handlers
export type TableEventHandlers<T> = {
  // onChange handler with structured parameters
  onChange?: ({ first, page, orderBy }: { first: number; page: number; orderBy?: OrderByClause[] }) => void;
  // Callback when rows are reordered via drag and drop
  onChangeSort?: (params: { data: T[]; from: number; to: number }) => void;
  // Callback when row selection changes
  onChangeSelection?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  // Set props on per row
  onRow?: (record: T, index: number) => IndiViewProps;
  // Set props on per header row
  headerProps?: IndiViewProps;
};

// Full table props combining all configurations
export type IndiTableProps<T> = TableBaseConfig & TableDataConfig<T> & TableEventHandlers<T> & IndiViewProps;
