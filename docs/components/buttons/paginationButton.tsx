import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { IndiParagraph } from '../text';
import { IndiXStack } from '../views';
type IndiPaginationButtonsProps = {
  paginatorInfo?: any;
  onPressLeft: (page: number) => void;
  onPressRight: (page: number) => void;
  isLoading?: boolean;
};

export const IndiPaginationButtons = ({
  paginatorInfo,
  onPressLeft,
  onPressRight,
  isLoading,
}: IndiPaginationButtonsProps) => {
  return (
    <IndiXStack gap="$2" alignItems="center">
      <IndiParagraph $md={{ dsp: 'none' }}>
        Showing {paginatorInfo?.firstItem || 0} to {paginatorInfo?.lastItem || 0} of {paginatorInfo?.total || 0} entries
      </IndiParagraph>
      <IndiXStack
        p="$1.5"
        br="$3"
        bg="$buttonSolidSecondaryBg"
        onPress={() => onPressLeft(paginatorInfo?.currentPage - 1)}
        disabled={paginatorInfo?.currentPage <= 1 || isLoading}>
        <ChevronLeft
          size={24}
          color={paginatorInfo?.currentPage <= 1 ? '$buttonSolidDisabledBg' : '$buttonSolidSecondaryContent'}
        />
      </IndiXStack>
      <IndiXStack
        p="$1.5"
        br="$3"
        bg="$buttonSolidSecondaryBg"
        onPress={() => onPressRight(paginatorInfo?.currentPage + 1)}
        disabled={!paginatorInfo?.hasMorePages || isLoading}>
        <ChevronRight
          size={24}
          color={paginatorInfo?.hasMorePages ? '$buttonSolidSecondaryContent' : '$buttonSolidDisabledBg'}
        />
      </IndiXStack>
    </IndiXStack>
  );
};
