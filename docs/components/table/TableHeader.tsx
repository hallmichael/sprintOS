import { OrderByClause, SortOrder } from '@/graphql/graphql';
import { ChevronDown, ChevronUp, ChevronsUpDown } from '@tamagui/lucide-icons';
import * as React from 'react';
import { styled, useMedia } from 'tamagui';
import { IndiText } from '../text';
import { IndiView, IndiXStack } from '../views';
import { useTableContext } from './TableContext';
import { IndiColumn } from './type';
import { getAlignmentStyle, getCellProps, getSizeStyle } from './utils';

export const HeaderText = styled(IndiText, {
  fontWeight: 700,
  fontFamily: '$body',
  color: '$textSecondary',
  size: 'xxs',
  letterSpacing: 1,
  textTransform: 'uppercase',
  pointerEvents: 'auto',
});

export function IndiTableHeader<T>() {
  const media = useMedia();
  const {
    columns,
    showHeader,
    size,
    paginationInfo,
    orderBy,
    bordered,
    showRowSortable,
    onChange,
    headerProps,
    fixedColumns,
  } = useTableContext<T>();

  if (!showHeader) {
    return null;
  }

  const setOrderBy = React.useCallback(
    (newOrderBy: OrderByClause[]) => {
      // Use the current pagination info or default to page 1 with default page size
      const currentPage = paginationInfo?.currentPage || 1;
      const currentPerPage = paginationInfo?.perPage || 10;

      // Call onChange with the new orderBy
      onChange?.({ page: currentPage, first: currentPerPage, orderBy: newOrderBy });
    },
    [onChange, paginationInfo],
  );

  const handleSort = React.useCallback(
    (column: IndiColumn<T>) => {
      if (!column.dataIndex || !column.sortable) return;

      // Convert dataIndex to string for comparison
      const columnName = Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex;

      // Use orderByKey if provided, otherwise use dataIndex
      const orderByColumn = column.orderByKey || columnName;

      // Find if this column is already being sorted
      const currentOrder = orderBy?.find(order => order.column === orderByColumn || order.column === columnName);

      if (!currentOrder) {
        // No current order, set to ASC
        setOrderBy([{ column: orderByColumn, order: SortOrder.Asc }]);
      } else if (currentOrder.order === SortOrder.Asc) {
        // Current order is ASC, change to DESC
        setOrderBy([{ column: orderByColumn, order: SortOrder.Desc }]);
      } else {
        // Current order is DESC, remove ordering
        setOrderBy([]);
      }
    },
    [setOrderBy],
  );

  const getSortIcon = React.useCallback(
    (column: IndiColumn<T>) => {
      // Convert dataIndex to string for comparison
      const columnName = Array.isArray(column.dataIndex) ? column.dataIndex.join('.') : column.dataIndex;

      // Use orderByKey if provided, otherwise use dataIndex
      const orderByColumn = column.orderByKey || columnName;

      // Find if this column is currently being sorted
      const currentOrder = orderBy?.find(order => order.column === orderByColumn || order.column === columnName);

      if (!currentOrder) {
        return <ChevronsUpDown size={16} color="$textSecondary" />;
      }

      return currentOrder.order === SortOrder.Asc ? (
        <ChevronUp size={16} color="$textPrimary" />
      ) : (
        <ChevronDown size={16} color="$textPrimary" />
      );
    },
    [orderBy],
  );

  const visibleColumns = columns.filter(column => !column.hidden);
  const leftFixedColumns = visibleColumns.filter(col => col.fixed === 'left');
  const rightFixedColumns = visibleColumns.filter(col => col.fixed === 'right');

  const sizeStyle = getSizeStyle(size);

  if (media.xs && columns.length > 3) {
    return null;
  }

  // Calculate cumulative left positions for fixed columns
  const getLeftPosition = (columnIndex: number) => {
    let position = 0;
    // Always start after the sort column if it exists and fixedColumns is enabled
    if (showRowSortable && fixedColumns) {
      position += 56; // Width of sort handle column ($14 = 56px)
    }
    for (let i = 0; i < columnIndex; i++) {
      const col = leftFixedColumns[i];
      const columnKey = Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex;
      const width = col.width || col.minWidth || 150;
      position += typeof width === 'string' ? parseInt(width) || 150 : width;
    }
    return position;
  };

  // Calculate cumulative right positions for fixed columns
  const getRightPosition = (columnIndex: number) => {
    let position = 0;
    for (let i = rightFixedColumns.length - 1; i > columnIndex; i--) {
      const col = rightFixedColumns[i];
      const columnKey = Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex;
      const width = col.width || col.minWidth || 150;
      position += typeof width === 'string' ? parseInt(width) || 150 : width;
    }
    return position;
  };

  return (
    <IndiXStack borderBottom bg={bordered ? '$contrastBg' : undefined} width="100%" {...headerProps}>
      {showRowSortable && (
        <IndiXStack
          width={'$14'}
          center
          borderRight={bordered}
          {...(fixedColumns && {
            position: 'sticky',
            left: 0,
            zIndex: 30,
            backgroundColor: '$accentBg',
            shadowColor: '$shadowColor',
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          })}>
          <HeaderText>Sort</HeaderText>
        </IndiXStack>
      )}
      {visibleColumns.map((column, index) => {
        const alignStyle = getAlignmentStyle(column.align);
        const cursor = column.sortable ? 'pointer' : undefined;

        const hasBorderRight = index !== visibleColumns.length - 1 && bordered;

        const cellProps = getCellProps(column, bordered ?? false);

        // Calculate positioning for fixed columns
        const isLeftFixed = fixedColumns && column.fixed === 'left';
        const isRightFixed = fixedColumns && column.fixed === 'right';
        const leftFixedIndex = isLeftFixed ? leftFixedColumns.findIndex(c => c === column) : -1;
        const rightFixedIndex = isRightFixed ? rightFixedColumns.findIndex(c => c === column) : -1;

        const fixedStyles = isLeftFixed
          ? {
              position: 'sticky' as const,
              left: getLeftPosition(leftFixedIndex),
              zIndex: 20,
              backgroundColor: '$accentBg',
              shadowColor: '$shadowColor',
              shadowOffset: { width: 2, height: 0 },
              marginRight: leftFixedIndex === leftFixedColumns.length - 1 ? 10 : 0,
              shadowOpacity: 0.1,
              shadowRadius: 3,
              borderRightWidth: leftFixedIndex === leftFixedColumns.length - 1 ? 1 : 0,
              borderRightColor: '$border',
            }
          : isRightFixed
          ? {
              position: 'sticky' as const,
              right: getRightPosition(rightFixedIndex),
              zIndex: 20,
              backgroundColor: '$accentBg',
              shadowColor: '$shadowColor',
              shadowOffset: { width: -2, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              marginLeft: rightFixedIndex <= 0 ? 10 : 0,
              borderLeftWidth: rightFixedIndex <= 0 ? 1 : 0,
              borderLeftColor: '$border',
            }
          : {};

        return (
          <IndiView
            key={index}
            {...sizeStyle}
            {...cellProps}
            {...fixedStyles}
            onPress={column.sortable ? () => handleSort(column) : undefined}
            borderRight={hasBorderRight}
            jc={alignStyle.justifyContent}
            cursor={cursor}>
            <IndiXStack gap="$1" {...(bordered && { p: '$3' })} jc={alignStyle.justifyContent}>
              {column.titleComponent ? column.titleComponent : <HeaderText>{column.title}</HeaderText>}
              {column.sortable && getSortIcon(column)}
            </IndiXStack>
          </IndiView>
        );
      })}
    </IndiXStack>
  );
}
