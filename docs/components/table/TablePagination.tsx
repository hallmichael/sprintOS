import { PaginatorInfo } from '@/graphql/graphql';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@tamagui/lucide-icons';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useMedia } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiSelect } from '../selects/base';
import { IndiText } from '../text';
import { IndiViewProps, IndiXStack, IndiYStack } from '../views';

// Default widths for initial rendering
const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : Dimensions.get('window').width;
const DEFAULT_CONTAINER_WIDTH = SCREEN_WIDTH * 0.9; // Assume container is 90% of screen width
const DEFAULT_CONTROLS_WIDTH = 250; // Reasonable default for controls
const DEFAULT_SELECTOR_WIDTH = 150; // Reasonable default for selector

type PaginationProps = {
  paginatorInfo?: PaginatorInfo;
  setPage: (page: number) => void | Promise<any>;
  hideEntryCount?: boolean;
  perPages?: number[];
  maxControlsWidth?: number;
  onPerPageChange?: (perPage?: number) => void;
  orderBy?: any;
  initialWidth?: number; // Optional prop to provide initial width
} & IndiViewProps;

export const IndiTablePagination = ({
  paginatorInfo,
  setPage,
  hideEntryCount = false,
  perPages = [3, 5, 10, 20, 50],
  maxControlsWidth = 450,
  onPerPageChange,
  initialWidth,
  ...props
}: PaginationProps) => {
  if (!paginatorInfo) return null;

  const containerRef = useRef<View>(null);
  const perPageSelectorRef = useRef<View>(null);
  const controlsRef = useRef<View>(null);
  const [containerWidth, setContainerWidth] = useState(initialWidth || DEFAULT_CONTAINER_WIDTH);
  const [perPageSelectorWidth, setPerPageSelectorWidth] = useState(DEFAULT_SELECTOR_WIDTH);
  const [controlsWidth, setControlsWidth] = useState(DEFAULT_CONTROLS_WIDTH);

  const { currentPage, firstItem, lastItem, total, hasMorePages, lastPage, perPage } = paginatorInfo;

  // Determine if we should use stacked layout based on available space
  const isWideLayout = containerWidth > controlsWidth + perPageSelectorWidth + 150; // Add buffer for show entries

  const measureWidths = () => {
    if (containerRef.current) {
      containerRef.current.measure((_, __, width) => {
        if (width && width > 0) {
          setContainerWidth(width);
        }
      });
    }
    if (controlsRef.current) {
      controlsRef.current.measure((_, __, width) => {
        if (width && width > 0) {
          setControlsWidth(width);
        }
      });
    }
    if (perPageSelectorRef.current) {
      perPageSelectorRef.current.measure((_, __, width) => {
        if (width && width > 0) {
          setPerPageSelectorWidth(width);
        }
      });
    }
  };

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    if (!lastPage || lastPage <= 5) {
      return Array.from({ length: lastPage || 1 }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // If current page is among first 2 pages
    if (currentPage <= 2) {
      pages.push(1, 2, 3, 'ellipsis', lastPage);
    }
    // If current page is 3
    else if (currentPage === 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', lastPage);
    }
    // If current page is among last 2 pages
    else if (currentPage >= lastPage - 1) {
      pages.push(1, 'ellipsis', lastPage - 2, lastPage - 1, lastPage);
    }
    // If current page is third from last
    else if (currentPage === lastPage - 2) {
      pages.push(1, 'ellipsis', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
    }
    // If current page is in the middle
    else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', lastPage);
    }

    return pages;
  }, [currentPage, lastPage]);

  const showFirstLastButtons = lastPage > 5;

  const handlePageSizeChange = useCallback((perPage?: number) => onPerPageChange?.(perPage), [onPerPageChange]);

  // Per page selector component
  const PerPageSelector = (
    <IndiXStack ai="center" gap="$2" ref={perPageSelectorRef}>
      <IndiText>Show</IndiText>
      <IndiSelect
        minWidth={undefined}
        miw={70}
        maxWidth={70}
        containerProps={{ borderRadius: '$default', size: '$sm', gap: 0, minHeight: '$8', h: '$8' }}
        data={perPages.map(page => ({ label: page.toString(), value: page }))}
        value={perPage}
        onChange={handlePageSizeChange}
      />
      <IndiText>per page</IndiText>
    </IndiXStack>
  );

  // Entry count component
  const EntryCount = !hideEntryCount && (
    <IndiText>
      {firstItem} to {lastItem} of {total} entries
    </IndiText>
  );

  // Pagination controls component
  const PaginationControls = (
    <IndiXStack ref={controlsRef} gap="$2" ai="center">
      {showFirstLastButtons && (
        <IndiButton
          color="secondary"
          icon={ChevronsLeft}
          size="sm"
          disabled={currentPage === 1}
          onPress={() => setPage(1)}
        />
      )}

      <IndiButton
        color="secondary"
        icon={ChevronLeft}
        size="sm"
        disabled={currentPage === 1}
        onPress={() => setPage(currentPage - 1)}
      />

      {lastPage > 0 &&
        pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <IndiButton key={`ellipsis-${index}`} type="ghost" size="sm" disabled onPress={() => {}} text="..." />
          ) : (
            <IndiButton
              key={`page-${page}`}
              type={currentPage === page ? 'solid' : 'outline'}
              color={currentPage === page ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => setPage(Number(page))}
              text={page.toString()}
            />
          ),
        )}

      <IndiButton
        color="secondary"
        icon={ChevronRight}
        size="sm"
        disabled={!hasMorePages}
        onPress={() => setPage(currentPage + 1)}
      />

      {showFirstLastButtons && (
        <IndiButton
          color="secondary"
          icon={ChevronsRight}
          size="sm"
          disabled={currentPage === lastPage || !hasMorePages}
          onPress={() => setPage(lastPage)}
        />
      )}
    </IndiXStack>
  );

  // Render based on layout
  return (
    <IndiYStack ref={containerRef} {...props}>
      {isWideLayout ? (
        <IndiXStack jc="space-between" ai="center" gap="$2">
          {PerPageSelector}
          <IndiXStack jc="flex-end" ai="center" gap="$2">
            {EntryCount}
            {PaginationControls}
          </IndiXStack>
        </IndiXStack>
      ) : (
        <IndiYStack>
          <IndiXStack jc="space-between" ai="center">
            {PerPageSelector}
            {EntryCount}
          </IndiXStack>
          <IndiXStack jc="flex-start" mt="$2">
            {PaginationControls}
          </IndiXStack>
        </IndiYStack>
      )}
    </IndiYStack>
  );
};
