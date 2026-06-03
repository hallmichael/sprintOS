import { useEffect } from 'react';
import { IndiText } from '../text';
import { IndiYStack } from '../views';
import { useTableContext } from './TableContext';
import { IndiTableLoadingOverlay } from './TableLoadingOverlay';
import { IndiTableRow } from './TableRow';
import { useDraggableRows } from './hooks/useDraggableRows';
import { useRowHeightSync } from './hooks/useRowHeightSync';

export function IndiTableBody<T>() {
  const { data, rowKey, loading, showRowSortable, emptyStateMessage, fixedColumns } = useTableContext<T>();
  const heightSyncContext = useRowHeightSync();

  // We'll keep these props local to TableBody for now
  const selectedRowKeys: string[] = [];
  const onRowSelect = undefined;

  // Force height re-measurement after TableBody renders (helps with HTML content timing)
  useEffect(() => {
    if (fixedColumns && heightSyncContext && data.length > 0) {
      // Force a sync update after content has had time to render
      const syncTimeout = setTimeout(() => {
        // Force re-render by updating the trigger
        const currentHeights = { ...heightSyncContext.rowHeights.current };
        if (Object.keys(currentHeights).length > 0) {
          heightSyncContext.updateRowHeight('table-sync-trigger', Math.random());
        }
      }, 300); // 300ms delay for HTML content rendering

      return () => clearTimeout(syncTimeout);
    }
  }, [data, fixedColumns, heightSyncContext]);

  // Function to check if a row is selected
  const isRowSelected = (record: T) => {
    const key = typeof rowKey === 'function' ? rowKey(record) : (record as any)[rowKey];
    return selectedRowKeys.includes(key);
  };

  // // Handle drag end and reordering
  // const handleDragEnd = useCallback(
  //   ({ data: newData, from, to }: { data: T[]; from: number; to: number }) => {
  //     if (onChangeSort) {
  //       onChangeSort({
  //         data: newData,
  //         from,
  //         to,
  //       });
  //     }
  //   },
  //   [onChangeSort],
  // );

  // Initialize draggable rows hook if sorting is enabled
  const { DraggableRowWrapper, DragHandle } = showRowSortable
    ? useDraggableRows({ rowKey, fixedColumns: fixedColumns ?? false })
    : { DraggableRowWrapper: null, DragHandle: null };

  // Helper to get row key
  const getRowKey = (record: T) => {
    return typeof rowKey === 'function' ? rowKey(record) : (record as any)[rowKey];
  };

  return (
    <IndiYStack flex={1} bblr="$default">
      {data.map((record, index) => {
        const key = getRowKey(record);

        // Wrap with draggable wrapper if sorting is enabled
        if (showRowSortable && DraggableRowWrapper) {
          return (
            <DraggableRowWrapper key={key} itemKey={String(key)}>
              <IndiTableRow
                record={record}
                index={index}
                isLastRow={index === data.length - 1}
                isSelected={isRowSelected(record)}
                onRowSelect={onRowSelect}
                dragHandle={DragHandle ? <DragHandle itemKey={String(key)} /> : undefined}
              />
            </DraggableRowWrapper>
          );
        }

        return (
          <IndiTableRow
            key={key}
            record={record}
            index={index}
            isLastRow={index === data.length - 1}
            isSelected={isRowSelected(record)}
            onRowSelect={onRowSelect}
          />
        );
      })}

      {/* Empty state when no data */}
      {!data.length && !loading && (
        <IndiYStack p="$6" center>
          <IndiText secondary>{emptyStateMessage || 'No data'}</IndiText>
        </IndiYStack>
      )}
      {loading && (
        <IndiTableLoadingOverlay
          {...(!!data.length && {
            absoluteFillParent: true,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          })}
        />
      )}
    </IndiYStack>
  );
}
