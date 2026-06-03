import { useState } from 'react';
import { ScrollView } from 'tamagui';
import { IndiView } from '../views';
import { IndiTableBody } from './TableBody';
import { TableProvider } from './TableContext';
import { IndiTableFooter } from './TableFooter';
import { IndiTableHeader } from './TableHeader';
import { IndiTableProps } from './type';

export function IndiTable<T>({
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
  emptyStateMessage,
  onChangeSort,
  onChange,
  onRow,
  onChangeSelection,
  fixedColumns = false,
  selectedRowKeys = [],
  headerProps,
  tableProps,
  ...props
}: IndiTableProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate minimum width for table content based on all column specifications
  const calculateTableMinWidth = () => {
    let totalMinWidth = 0;

    columns.forEach(col => {
      if (col.hidden) return;

      if (col.width) {
        const width = typeof col.width === 'string' ? parseInt(col.width) || 150 : col.width;
        totalMinWidth += width;
      } else if (col.minWidth) {
        const width = typeof col.minWidth === 'string' ? parseInt(col.minWidth) || 150 : col.minWidth;
        totalMinWidth += width;
      } else {
        totalMinWidth += 150; // Default minimum width
      }
    });

    return totalMinWidth;
  };

  const tableMinWidth = calculateTableMinWidth();
  // Ensure table content is at least as wide as the container to make right fixed columns stick to viewport edge
  const tableWidth = Math.max(tableMinWidth, containerWidth);

  const providerProps = {
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
    emptyStateMessage,
    onChangeSort,
    onChange,
    onRow,
    fixedColumns,
    selectedRowKeys,
    onChangeSelection,
    headerProps,
  };

  const renderTableContent = () => {
    // When fixedColumns is true OR scroll is true, use horizontal scroll
    const shouldScroll = fixedColumns || scroll;

    return shouldScroll ? (
      <ScrollView horizontal showsHorizontalScrollIndicator={true} width="100%">
        <IndiView minWidth={tableWidth}>
          <IndiTableHeader />
          <IndiTableBody />
        </IndiView>
      </ScrollView>
    ) : (
      <IndiView>
        <IndiTableHeader />
        <IndiTableBody />
      </IndiView>
    );
  };

  return (
    <TableProvider {...providerProps}>
      <IndiView {...props}>
        <IndiView
          border={bordered}
          {...tableProps}
          onLayout={event => {
            const { width } = event.nativeEvent.layout;
            if (width !== containerWidth) {
              setContainerWidth(width);
            }
          }}>
          {/* Table content */}
          {renderTableContent()}
        </IndiView>

        {/* Footer and Pagination - only show once */}
        <IndiTableFooter />
      </IndiView>
    </TableProvider>
  );
}
