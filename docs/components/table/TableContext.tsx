import { createContext, useContext } from 'react';
import { IndiTableProps } from './type';

// Define the shape of the context
interface TableContextType<T = any> extends IndiTableProps<T> {
  // Selected row keys
  selectedRowKeys?: React.Key[];
  // Selection change handler
  onChangeSelection?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
}

// Create the context with a default value
const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider<T>({
  children,
  bordered = false,
  columns = [],
  data = [],
  rowKey,
  footer,
  loading = false,
  error,
  paginationInfo,
  orderBy = [],
  scroll = false,
  showHeader = true,
  size = 'md',
  showRowSelection = false,
  showRowSortable = false,
  onChange,
  onChangeSort,
  onRow,
  headerProps,
  fixedColumns = false,
  selectedRowKeys = [],
  onChangeSelection,
}: TableContextType<T>) {
  // Create the context value
  const contextValue: TableContextType<T> = {
    bordered,
    columns,
    data,
    rowKey,
    footer,
    loading,
    error,
    paginationInfo,
    orderBy,
    scroll,
    showHeader,
    size,
    showRowSelection,
    showRowSortable,
    onRow,
    headerProps,
    onChange,
    onChangeSort,
    fixedColumns,
    selectedRowKeys,
    onChangeSelection,
  };

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
}

// Hook to use the table context
export function useTableContext<T = any>(): TableContextType<T> {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextType<T>;
}
