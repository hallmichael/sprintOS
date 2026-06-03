import { useCallback } from 'react';
import { IndiView, IndiYStack } from '../views';
import { useTableContext } from './TableContext';
import { IndiTablePagination } from './TablePagination';

interface IndiTableFooterProps {
  perPages?: number[];
}

export function IndiTableFooter({ perPages = [5, 10, 20, 50] }: IndiTableFooterProps = {}) {
  const { footer, paginationInfo, orderBy, onChange } = useTableContext();

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      onChange?.({ page, first: paginationInfo?.perPage || 10, orderBy });
    },
    [onChange, orderBy, paginationInfo?.perPage],
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (perPage?: number) => {
      onChange?.({ page: 1, first: perPage ?? 10, orderBy }); // Reset to first page when changing page size
    },
    [onChange, orderBy],
  );

  return (
    <IndiYStack>
      {/* Custom footer content if provided */}
      {footer && <IndiYStack>{footer}</IndiYStack>}

      {/* Pagination if paginationInfo is provided */}
      {paginationInfo && paginationInfo.firstItem && paginationInfo.firstItem > 0 && (
        <IndiView>
          <IndiTablePagination
            paginatorInfo={paginationInfo}
            setPage={handlePageChange}
            perPages={perPages}
            onPerPageChange={handlePageSizeChange}
            mt="$4"
            p="$2"
          />
        </IndiView>
      )}
    </IndiYStack>
  );
}
