import _ from 'lodash';
import { useMemo } from 'react';
import { IndiText } from '../text';
import { IndiView, IndiXStack } from '../views';
import { useTableContext } from './TableContext';
import { IndiColumn } from './type';
import { getAlignmentStyle, getCellProps, getSizeStyle } from './utils';

interface IndiTableCellProps<T> {
  column: IndiColumn<T>;
  record: T;
  index: number;
  isLastColumn?: boolean;
  showColumnTitle?: boolean;
  leftPosition?: number;
  rightPosition?: number;
  isRowSelected?: boolean;
}

export function IndiTableCell<T>({
  column,
  record,
  index,
  isLastColumn = false,
  showColumnTitle = false,
  leftPosition,
  rightPosition,
  isRowSelected = false,
}: IndiTableCellProps<T>) {
  const { bordered, size, fixedColumns, columns } = useTableContext<T>();

  // Get the value from the record using the dataIndex
  const value = _.get(record, column.dataIndex);

  // Determine the content to render
  const content = useMemo(() => {
    // If a custom render function is provided, use it
    if (column.render) {
      return column.render(value, record, index);
    }

    // Otherwise, render the value directly
    // If the value is null or undefined, render an empty string
    if (value === null || value === undefined) {
      return '';
    }

    // If the value is an object or array, convert it to a string
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    // Otherwise, render the value as is
    return value;
  }, [column.render, value, record, index]);

  // Get alignment styles
  const alignStyle = getAlignmentStyle(column.align);

  // Combine props
  const cellProps = getCellProps(column, bordered ?? false);

  // Add accessibility attributes if rowScope is provided
  const accessibilityProps: any = {};
  if (column.rowScope) {
    accessibilityProps.accessibilityRole = 'cell';
    accessibilityProps['aria-rowscope'] = column.rowScope;
  }

  const sizeStyle = getSizeStyle(size);

  // Create cell content component to reuse in both layouts
  const cellContent =
    typeof content === 'string' || typeof content === 'number' ? (
      <IndiText numberOfLines={1} textAlign={alignStyle.textAlign}>
        {content}
      </IndiText>
    ) : (
      content
    );

  // Fixed column positioning styles
  const leftFixedColumns = columns.filter(col => col.fixed === 'left');
  const rightFixedColumns = columns.filter(col => col.fixed === 'right');
  const isFixed = leftPosition !== undefined || rightPosition !== undefined;
  const isLeftFixed = leftPosition !== undefined;
  const isRightFixed = rightPosition !== undefined;
  const leftFixedIndex = isLeftFixed ? leftFixedColumns.findIndex(c => c === column) : -1;
  const rightFixedIndex = isRightFixed ? rightFixedColumns.findIndex(c => c === column) : -1;

  const fixedStyles = isFixed
    ? {
        position: 'sticky' as const,
        ...(leftPosition !== undefined && { left: leftPosition }),
        ...(rightPosition !== undefined && { right: rightPosition }),
        zIndex: 20,
        backgroundColor: '$accentBg', // Fixed columns have accent background
        height: '100%',
        ...(isLeftFixed && {
          shadowColor: '$shadowColor',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginRight: leftFixedIndex === leftFixedColumns.length - 1 ? 10 : 0,
          borderRightWidth: leftFixedIndex === leftFixedColumns.length - 1 ? 1 : 0,
          borderRightColor: '$border',
        }),
        ...(isRightFixed && {
          shadowColor: '$shadowColor',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginLeft: rightFixedIndex <= 0 ? 10 : 0,
          borderLeftWidth: rightFixedIndex <= 0 ? 1 : 0,
          borderLeftColor: '$border',
        }),
      }
    : {};

  return (
    <IndiView
      borderRight={bordered && !isLastColumn}
      {...accessibilityProps}
      {...sizeStyle}
      {...cellProps}
      {...(fixedColumns && isFixed && fixedStyles)}
      height="100%">
      {showColumnTitle ? (
        <IndiXStack gap="$2" jc="space-between" ai="center">
          <IndiText semibold size="sm">
            {column.title}:
          </IndiText>
          {cellContent}
        </IndiXStack>
      ) : (
        cellContent
      )}
    </IndiView>
  );
}
