import { IndiSelect } from '@/components';
import { IndiParagraph } from '@/components/text';
import { PaginatorInfo } from '@/graphql/graphql';
import { Platform } from 'react-native';
import { XStack } from 'tamagui';
import { IndiPaginationButtons } from './buttons/paginationButton';

interface PaginationProps {
  paginatorInfo: PaginatorInfo;
  setPage: (page: number) => void;
  first: number;
  setFirst: (first: number) => void;
  isLoading?: boolean;
  isShowingBorder?: boolean;
}

export const Pagination = ({
  paginatorInfo,
  setPage,
  first,
  setFirst,
  isLoading,
  isShowingBorder = true,
}: PaginationProps) => {
  return (
    <XStack justifyContent="space-between" mx="$2" pt="$4" btw={isShowingBorder ? 1 : 0} bc="$border">
      <XStack ai="center">
        <IndiParagraph $md={{ dsp: 'none' }}>Show</IndiParagraph>
        <XStack px="$3" $md={{ px: '$0' }}>
          <IndiSelect
            label="Per Page"
            width={Platform.OS == 'web' ? 100 : 80}
            data={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '30', label: '30' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
              { value: '250', label: '250' },
            ]}
            value={first.toString()}
            onChange={v => setFirst(Number(v))}
          />
        </XStack>
        <IndiParagraph $md={{ dsp: 'none' }}>per page</IndiParagraph>
      </XStack>
      <IndiPaginationButtons
        paginatorInfo={paginatorInfo}
        onPressLeft={() => setPage(paginatorInfo?.currentPage - 1)}
        onPressRight={() => setPage(paginatorInfo?.currentPage + 1)}
        isLoading={isLoading}
      />
    </XStack>
  );
};
