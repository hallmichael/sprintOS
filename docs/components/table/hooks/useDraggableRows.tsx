import { IndiView, IndiXStack } from '@/components/views';
import StringUtils from '@/utils/StringUtils';
import { Equal } from '@tamagui/lucide-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTableContext } from '../TableContext';

const AnimatedView = Animated.createAnimatedComponent(IndiView);
interface UseDraggableRowsProps<T> {
  rowKey: keyof T | ((record: T) => string);
  fixedColumns: boolean;
}

interface RowLayout {
  y: number;
  height: number;
}

const DURATION = 100;

export function useDraggableRows<T>({ rowKey, fixedColumns }: UseDraggableRowsProps<T>) {
  const { bordered, data, onChangeSort } = useTableContext<T>();
  const [refreshLayouts, setRefreshLayouts] = useState(StringUtils.uuid());
  // Shared values for animation and state management
  const activeRowKey = useSharedValue<string | null>(null);
  const startOrder = useSharedValue<T[]>(data);
  const currentOrder = useSharedValue<T[]>(data);
  const rowTranslationY = useSharedValue<Record<string, number>>({});
  const rowLayouts = useSharedValue<Record<string, RowLayout>>({});
  // Ref to store row layouts for layout updates, used for a weird bug on the mobile app
  const rowLayoutsRef = useRef<Record<string, RowLayout>>({});
  const isDragging = useSharedValue(false);
  const rowOffsets = useSharedValue<Record<string, number>>({});
  const lastReorderedIndices = useSharedValue<{ from: number; to: number } | null>(null);
  const isFinalizingDrag = useSharedValue(false); // New shared value to track when drag is finalizing

  useEffect(() => {
    setRefreshLayouts(StringUtils.uuid());
  }, [data]);

  // Update shared values when data changes
  useEffect(() => {
    if (isDragging.value) return; // Don't update if currently dragging

    startOrder.value = data;
    currentOrder.value = data;

    // Clean up rowLayouts by removing entries for rows that no longer exist
    const currentKeys = data.map(item =>
      typeof rowKey === 'function' ? rowKey(item) : String(item[rowKey as keyof T]),
    );

    const existingLayoutKeys = Object.keys(rowLayoutsRef.current);
    const keysToRemove = existingLayoutKeys.filter(key => !currentKeys.includes(key));

    if (keysToRemove.length > 0) {
      const updatedLayouts = { ...rowLayoutsRef.current };
      keysToRemove.forEach(key => {
        delete updatedLayouts[key];
      });
      rowLayouts.value = updatedLayouts;
      rowLayoutsRef.current = updatedLayouts;
    }

    // Reset any active dragging when data changes externally
    activeRowKey.value = null;
    rowTranslationY.value = {};
    rowOffsets.value = {};
    lastReorderedIndices.value = null;
  }, [data, isDragging]);

  // Find the index of a row by its key - worklet version for UI thread
  const findIndexByKeyWorklet = (array: T[], key: string): number => {
    'worklet';
    // We need to implement our own findIndex since we can't use the array method in a worklet
    for (let i = 0; i < array.length; i++) {
      // For worklets, we need to access the key directly since we can't call functions
      let itemKey: string;
      if (typeof rowKey === 'function') {
        // This is a simplified version for the worklet context
        // We directly access the property instead of calling the function
        itemKey = String(array[i][rowKey as unknown as keyof T]);
      } else {
        itemKey = String(array[i][rowKey as keyof T]);
      }

      if (itemKey === key) {
        return i;
      }
    }
    return -1;
  };

  // Create a new array with an item moved from one index to another - worklet version
  const moveItemWorklet = (array: T[], fromIndex: number, toIndex: number): T[] => {
    'worklet';
    if (fromIndex === toIndex) return array;

    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);

    return newArray;
  };

  // Calculate the new index based on current position - worklet version
  const calculateNewIndexWorklet = (itemKey: string, translation: number): number | null => {
    'worklet';
    if (!itemKey) return null;

    const activeRowIndex = findIndexByKeyWorklet(currentOrder.value, itemKey);
    const activeRowLayout = rowLayouts.value[itemKey];

    if (!activeRowLayout) return null;

    // Calculate the current position of the active row
    const activeRowPosition = activeRowLayout.y + translation;
    const activeRowMiddle = activeRowPosition + activeRowLayout.height / 2;

    // Create an array of all rows except the active one
    const otherRows = Object.entries(rowLayouts.value)
      .filter(([key]) => key !== itemKey)
      .map(([key, layout]) => {
        const index = findIndexByKeyWorklet(currentOrder.value, key);
        // Apply any current offset to get the actual visual position
        const offset = rowOffsets.value[key] || 0;
        const adjustedY = layout.y + offset;
        return { key, layout: { ...layout, y: adjustedY }, index };
      });

    // Sort other rows by their visual position (y coordinate)
    const sortedRows = [...otherRows].sort((a, b) => a.layout.y - b.layout.y);

    // Check if we're above the first row
    if (sortedRows.length > 0 && activeRowMiddle < sortedRows[0].layout.y + sortedRows[0].layout.height / 2) {
      return 0;
    }

    // Check if we're below the last row
    if (
      sortedRows.length > 0 &&
      activeRowMiddle > sortedRows[sortedRows.length - 1].layout.y + sortedRows[sortedRows.length - 1].layout.height / 2
    ) {
      return currentOrder.value.length - 1;
    }

    // Check between rows
    for (let i = 0; i < sortedRows.length - 1; i++) {
      const currentRow = sortedRows[i];
      const nextRow = sortedRows[i + 1];

      const currentRowBottom = currentRow.layout.y + currentRow.layout.height;
      const nextRowTop = nextRow.layout.y;

      // If we're between these rows
      if (activeRowMiddle >= currentRowBottom && activeRowMiddle <= nextRowTop) {
        // Determine which row we're closer to
        const distanceToCurrentBottom = Math.abs(activeRowMiddle - currentRowBottom);
        const distanceToNextTop = Math.abs(activeRowMiddle - nextRowTop);

        // Use the indices to determine the new position
        if (distanceToCurrentBottom <= distanceToNextTop) {
          // Closer to current row, place after it
          return currentRow.index < activeRowIndex ? currentRow.index + 1 : currentRow.index;
        } else {
          // Closer to next row, place before it
          return nextRow.index > activeRowIndex ? nextRow.index - 1 : nextRow.index;
        }
      }
    }

    // Check if we're inside any row's bounds
    for (let i = 0; i < sortedRows.length; i++) {
      const row = sortedRows[i];
      const rowTop = row.layout.y;
      const rowBottom = rowTop + row.layout.height;

      if (activeRowMiddle >= rowTop && activeRowMiddle <= rowBottom) {
        // We're inside this row's bounds
        // Place before or after based on whether we're in the top or bottom half
        if (activeRowMiddle < rowTop + row.layout.height / 2) {
          // Top half, place before
          return row.index;
        } else {
          // Bottom half, place after
          return row.index + 1 > currentOrder.value.length - 1 ? currentOrder.value.length - 1 : row.index + 1;
        }
      }
    }

    return null;
  };

  // Update row positions based on current order
  const updateRowPositions = (activeKey: string, fromIndex: number, toIndex: number, rowHeight: number) => {
    'worklet';

    // Reset all offsets first
    const newOffsets: Record<string, number> = {};

    // Calculate the direction of movement
    const direction = fromIndex < toIndex ? 1 : -1;

    // Update offsets for rows that need to move
    Object.entries(rowLayouts.value).forEach(([key]) => {
      'worklet';
      if (key === activeKey) {
        // The active row is handled by the pan gesture
        newOffsets[key] = 0;
        return;
      }

      const currentIndex = findIndexByKeyWorklet(currentOrder.value, key);

      // Handle special case for moving to the first position
      if (toIndex === 0 && currentIndex < fromIndex) {
        // Rows before the dragged row don't need to move
        newOffsets[key] = 0;
      } else if (direction > 0 && currentIndex > fromIndex && currentIndex <= toIndex) {
        // Moving down, so rows in between move up
        newOffsets[key] = -rowHeight;
      } else if (direction < 0 && currentIndex < fromIndex && currentIndex >= toIndex) {
        // Moving up, so rows in between move down
        newOffsets[key] = rowHeight;
      } else {
        // This row doesn't need to move
        newOffsets[key] = 0;
      }
    });

    // Update the shared value
    rowOffsets.value = newOffsets;
  };

  // Update visual positions of rows based on their current index in the data
  const updateVisualPositions = () => {
    'worklet';
    // First, get all rows sorted by their current index in the data
    const allRows = Object.entries(rowLayouts.value)
      .map(([key, layout]) => {
        const index = findIndexByKeyWorklet(currentOrder.value, key);
        return { key, layout, index };
      })
      .sort((a, b) => a.index - b.index);

    // Now, update the visual position of each row based on its index
    if (allRows.length > 0) {
      const newOffsets: Record<string, number> = {};

      // Calculate the expected Y position for each row based on its index
      let expectedY = 0;
      for (let i = 0; i < allRows.length; i++) {
        const { key, layout } = allRows[i];

        // Calculate the offset needed to move this row to its expected position
        newOffsets[key] = expectedY - layout.y;

        // Update expected Y for the next row
        expectedY += layout.height;
      }

      // Update the offsets
      rowOffsets.value = newOffsets;
    }
  };

  // Create a gesture for dragging rows
  const createDragGesture = useCallback(
    (itemKey: string) => {
      // Use a long press gesture to start dragging
      const longPress = Gesture.LongPress()
        .minDuration(DURATION)
        .onStart(() => {
          activeRowKey.value = itemKey;
          isDragging.value = true;
          startOrder.value = [...data];
          currentOrder.value = [...data];
          rowOffsets.value = {};
          lastReorderedIndices.value = null;
        });

      // Use a pan gesture for the actual dragging
      const pan = Gesture.Pan()
        .activateAfterLongPress(DURATION)
        .onUpdate(event => {
          if (activeRowKey.value !== itemKey) return;

          // Update the translation of the active row
          const translation = event.translationY;
          rowTranslationY.value = {
            ...rowTranslationY.value,
            [itemKey]: translation,
          };

          // Calculate new index based on current position
          const activeRowIndex = findIndexByKeyWorklet(currentOrder.value, itemKey);
          const newIndex = calculateNewIndexWorklet(itemKey, translation);

          // Update the current order and row positions in real-time if needed
          if (newIndex !== null) {
            const activeRowLayout = rowLayouts.value[itemKey];
            if (activeRowLayout) {
              // Check if this is a new reordering (different from the last one)
              const isNewReordering =
                lastReorderedIndices.value === null ||
                lastReorderedIndices.value.from !== activeRowIndex ||
                lastReorderedIndices.value.to !== newIndex;

              if (isNewReordering) {
                // Update row positions visually
                updateRowPositions(itemKey, activeRowIndex, newIndex, activeRowLayout.height);

                // Update the current order
                currentOrder.value = moveItemWorklet(currentOrder.value, activeRowIndex, newIndex);

                // Store the indices we just reordered
                lastReorderedIndices.value = { from: activeRowIndex, to: newIndex };

                // Update visual positions to match the new order
                updateVisualPositions();
              }
            }
          }
        })
        .onFinalize(() => {
          if (activeRowKey.value !== itemKey) return;

          const fromIndex = findIndexByKeyWorklet(startOrder.value, itemKey);
          const toIndex = findIndexByKeyWorklet(currentOrder.value, itemKey);

          // Set finalizing flag to true - this will freeze the positions of non-active rows
          isFinalizingDrag.value = true;

          // Only animate the active row to its final position
          rowTranslationY.value = {
            ...rowTranslationY.value,
            [itemKey]: 0,
          };

          lastReorderedIndices.value = null;

          // Update the data order and notify parent
          if (fromIndex !== toIndex && onChangeSort) {
            runOnJS(onChangeSort)({
              data: [...currentOrder.value], // Create a proper copy
              from: fromIndex,
              to: toIndex,
            });
            // Call our JS thread helper function
            runOnJS(handleDelayedRefresh)();
          } else {
            // Reset finalizing flag after animation duration if no changes
            runOnJS(setTimeout)(() => {
              isFinalizingDrag.value = false;
            }, DURATION);
          }

          // Reset the active row and dragging state regardless of whether the row was moved
          activeRowKey.value = null;
          isDragging.value = false;
        });
      // Combine the gestures
      return Gesture.Simultaneous(longPress, pan);
    },
    [activeRowKey, rowTranslationY, rowOffsets, data, refreshLayouts, startOrder, isDragging, lastReorderedIndices],
  );

  // Helper function to handle the timeout on JS thread
  const handleDelayedRefresh = useCallback(() => {
    setTimeout(() => {
      isFinalizingDrag.value = false;
      // Refresh layouts to reflect the new order
      setRefreshLayouts(StringUtils.uuid());
    }, DURATION);
  }, [isFinalizingDrag]);

  // Create animated styles for a row
  const getRowAnimatedStyle = useCallback(
    (itemKey: string) => {
      return useAnimatedStyle(() => {
        const isActive = activeRowKey.value === itemKey;
        const translation = rowTranslationY.value[itemKey] || 0;
        const offset = rowOffsets.value[itemKey] || 0;

        if (isActive) {
          return {
            zIndex: 999,
            transform: [
              { translateY: isFinalizingDrag.value ? withTiming(0, { duration: DURATION }) : translation },
              { scale: 1.01 },
            ],
            boxShadow: '2px 4px 10px 4px rgba(0,0,0,0.06)',
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 2,
          };
        }

        return {
          zIndex: 0,
          transform: [
            {
              translateY: isFinalizingDrag.value
                ? offset // Keep fixed at current position when finalizing
                : withTiming(offset, { duration: DURATION }), // Animate during dragging
            },
            { scale: withSpring(1) },
          ],
          boxShadow: 'none',
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        };
      });
    },
    [activeRowKey, rowTranslationY, rowOffsets, isFinalizingDrag],
  );

  const onLayout = useCallback(
    (itemKey: string) => (event: LayoutChangeEvent) => {
      const layout = event.nativeEvent.layout;
      const newLayouts = {
        ...rowLayoutsRef.current,
        [itemKey]: layout,
      };
      rowLayouts.value = newLayouts;
      rowLayoutsRef.current = newLayouts;
      // console.log({ [itemKey]: layout, rowLayoutsRef: rowLayoutsRef.current });
    },
    [rowLayouts],
  );

  // Wrapper component for draggable rows
  const DraggableRowWrapper = useCallback(
    ({ children, itemKey }: { children: React.ReactNode; itemKey: string }) => {
      // const gesture = createDragGesture(itemKey);
      const animatedStyle = getRowAnimatedStyle(itemKey);

      // This approach uses a separate drag handle instead of making entire row draggable
      return (
        <AnimatedView
          key={itemKey + refreshLayouts}
          width={'100%'}
          style={animatedStyle}
          bg="$tableBgDefault"
          onLayout={onLayout(itemKey)}
          br="inherit">
          {children}
        </AnimatedView>
      );
    },
    [getRowAnimatedStyle, refreshLayouts],
  );

  // Create a separate drag handle component that can be added to the row
  const DragHandle = useCallback(
    ({ itemKey }: { itemKey: string }) => {
      const gesture = createDragGesture(itemKey);

      // Handle press to prevent it from propagating to the parent row
      const handlePress = (e: any) => {
        // Stop propagation to prevent the row's onPress from firing
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }
      };

      return (
        <GestureDetector gesture={gesture}>
          <IndiXStack
            width={'$14'}
            justifyContent="center"
            alignItems="center"
            height={'100%'}
            cursor="grab"
            borderRight={bordered}
            pointerEvents="auto"
            onPress={handlePress} // Add onPress handler to stop propagation
            pressStyle={{ opacity: 1 }} // Ensure the press style doesn't change opacity
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
        </GestureDetector>
      );
    },
    [createDragGesture],
  );

  return {
    DraggableRowWrapper,
    DragHandle,
    activeRowKey,
    currentOrder,
  };
}
