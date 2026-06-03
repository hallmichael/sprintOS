import React from 'react';
import { IndiIcon } from '../icon';
import { IndiTooltip } from '../inputs';
import { IndiView, IndiViewProps, IndiXStack } from '../views';

type WithSortId = { sort_id?: number | null; id: string };

type IndiSortButtonProps<T extends WithSortId> = {
  element: T;
  elements: T[];
  onSort?: (elements: WithSortId[]) => Promise<void>;
  props?: IndiViewProps;
  disabled?: boolean;
};

export const IndiSortButton = <T extends WithSortId>({
  element,
  elements,
  onSort,
  props,
  disabled = false,
}: IndiSortButtonProps<T>) => {
  const listToNavigate = React.useMemo(() => {
    // 1. Sort the elements. Treat null/undefined as having a lower priority (sent to the end).
    const sortedElements = [...elements].sort((a, b) => {
      const aId = a.sort_id;
      const bId = b.sort_id;

      const aIsValid = aId !== null && aId !== undefined;
      const bIsValid = bId !== null && bId !== undefined;

      if (aIsValid && bIsValid) {
        // If both are valid, sort by value. If equal, keep original order (stable).
        return aId - bId;
      }
      if (aIsValid) return -1; // a comes first
      if (bIsValid) return 1; // b comes first
      return 0; // both are null/undefined, keep original order
    });

    // 2. Re-index the entire list to ensure unique, sequential sort_ids for navigation.
    // This creates a clean list where every item has a unique index from 0 to n-1.
    return sortedElements.map((e, index) => ({
      ...e,
      sort_id: index,
    }));
  }, [elements]);

  const currentIdx = listToNavigate.findIndex(g => g.id === element.id);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === listToNavigate.length - 1;

  const handleSort = async (direction: 'up' | 'down') => {
    // If for some reason the element is not found, do nothing
    if (currentIdx === -1) return;

    // Determine the target index
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;

    // If out of bounds, do nothing
    if (targetIdx < 0 || targetIdx >= listToNavigate.length) return;

    // Get the elements to swap
    const currentElement = listToNavigate[currentIdx];
    const targetElement = listToNavigate[targetIdx];

    const elementsToUpdate = [
      {
        id: currentElement.id,
        sort_id: targetElement.sort_id,
      },
      {
        id: targetElement.id,
        sort_id: currentElement.sort_id,
      },
    ];
    await onSort?.(elementsToUpdate);
  };

  return (
    <IndiXStack {...props}>
      <IndiTooltip tooltip="Move up">
        <IndiView
          disabled={disabled}
          onPress={() => !isFirst && !disabled && handleSort('up')}
          bg="$buttonOutlineSecondaryBg"
          bw={1}
          brw={0}
          bc="$buttonOutlineSecondaryBorder"
          bblr="$1.5"
          btlr="$1.5"
          width="$8"
          height="$8"
          hoverStyle={{
            backgroundColor: '$buttonOutlineSecondaryBgHover',
          }}
          alignItems="center"
          justifyContent="center">
          <IndiIcon name="ArrowUp" size="$4" color="$buttonOutlineSecondaryContent" />
        </IndiView>
      </IndiTooltip>
      <IndiView blw={1} bc="$buttonOutlineSecondaryBorder" />
      <IndiTooltip tooltip="Move down">
        <IndiView
          disabled={disabled}
          onPress={() => !isLast && !disabled && handleSort('down')}
          bg="$buttonOutlineSecondaryBg"
          bw={1}
          blw={0}
          bc="$buttonOutlineSecondaryBorder"
          bbrr="$1.5"
          btrr="$1.5"
          width="$8"
          height="$8"
          hoverStyle={{
            backgroundColor: '$buttonOutlineSecondaryBgHover',
          }}
          alignItems="center"
          justifyContent="center">
          <IndiIcon name="ArrowDown" size="$4" color="$buttonOutlineSecondaryContent" />
        </IndiView>
      </IndiTooltip>
    </IndiXStack>
  );
};
