import { Equal } from '@tamagui/lucide-icons';
import React, { useRef } from 'react';
import { useMedia } from 'tamagui';
import { IndiCheckbox } from '../checkbox';
import { IndiXStack } from '../views';
import { IndiTableCell } from './TableCell';
import { useTableContext } from './TableContext';

interface IndiTableRowProps<T> {
  record: T;
  index: number;
  isSelected?: boolean;
  isLastRow?: boolean;
  onRowSelect?: (selected: boolean, record: T) => void;
  dragHandle?: React.ReactNode;
}

export function IndiTableRow<T>({
  record,
  index,
  isSelected = false,
  isLastRow = false,
  onRowSelect,
  dragHandle,
}: IndiTableRowProps<T>) {
  const media = useMedia();
  const rowRef = useRef<any>(null);

  const {
    columns,
    rowKey,
    onRow,
    showRowSelection,
    showRowSortable,
    bordered,
    size,
    selectedRowKeys = [],
    onChangeSelection,
    data,
    fixedColumns,
  } = useTableContext<T>();

  // Separate columns into fixed left, scrollable, and fixed right
  const visibleColumns = columns.filter(column => !column.hidden);
  const leftFixedColumns = visibleColumns.filter(col => col.fixed === 'left');
  const rightFixedColumns = visibleColumns.filter(col => col.fixed === 'right');

  // Get the row key
  const getRowKey = () => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as any)[rowKey];
  };

  // Get the row key
  const rowKeyValue = getRowKey();
  const rowKeyString = String(rowKeyValue);

  // Check if row is selected
  const isRowSelected = selectedRowKeys.includes(rowKeyValue);

  // Get custom row props if provided
  const rowProps = onRow ? onRow(record, index) : {};

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

  // Apply synchronized height to row props
  const finalRowProps = {
    ...rowProps,
  };

  return (
    <IndiXStack
      ref={rowRef}
      key={rowKeyValue}
      borderBottom={!isLastRow || !bordered}
      bg={isRowSelected ? '$accentBg' : '$tableBgDefault'}
      hoverStyle={{ backgroundColor: '$tableBgHover' }}
      cursor="pointer"
      width="100%"
      {...finalRowProps}
      $xs={{ fd: 'column', ai: 'flex-start' }}
      testID={finalRowProps.testID || `table-row-${rowKeyValue}`}>
      {/* Drag handle for sortable rows */}
      {showRowSortable &&
        (dragHandle || (
          <IndiXStack
            width={'$14'}
            justifyContent="center"
            alignItems="center"
            cursor="grab"
            borderRight
            height="100%"
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
            <Equal size={16} color="$iconSecondary" />
          </IndiXStack>
        ))}

      {/* Row selection checkbox would go here if implemented */}
      {showRowSelection && (
        <IndiXStack width={40} justifyContent="center" alignItems="center">
          <IndiCheckbox
            checked={isRowSelected}
            onChange={checked => {
              if (!onChangeSelection) return;

              const newSelectedKeys = checked
                ? [...selectedRowKeys, rowKeyValue]
                : selectedRowKeys.filter(key => key !== rowKeyValue);

              const selectedRows = checked
                ? [
                    ...data.filter(item => {
                      const itemKey = typeof rowKey === 'function' ? rowKey(item) : (item as any)[rowKey];
                      return newSelectedKeys.includes(itemKey);
                    }),
                    record,
                  ]
                : data.filter(item => {
                    const itemKey = typeof rowKey === 'function' ? rowKey(item) : (item as any)[rowKey];
                    return newSelectedKeys.includes(itemKey);
                  });

              onChangeSelection(newSelectedKeys, selectedRows);
            }}
          />
        </IndiXStack>
      )}

      {/* Render cells for each visible column */}
      {visibleColumns.map((column, cellIndex) => {
        const isLeftFixed = fixedColumns && column.fixed === 'left';
        const isRightFixed = fixedColumns && column.fixed === 'right';
        const leftFixedIndex = isLeftFixed ? leftFixedColumns.findIndex(c => c === column) : -1;
        const rightFixedIndex = isRightFixed ? rightFixedColumns.findIndex(c => c === column) : -1;

        return (
          <IndiTableCell
            key={cellIndex}
            column={column}
            record={record}
            index={index}
            isLastColumn={cellIndex === visibleColumns.length - 1}
            showColumnTitle={media.xs && columns.length > 3}
            leftPosition={isLeftFixed ? getLeftPosition(leftFixedIndex) : undefined}
            rightPosition={isRightFixed ? getRightPosition(rightFixedIndex) : undefined}
            isRowSelected={isRowSelected}
          />
        );
      })}
    </IndiXStack>
  );
}
