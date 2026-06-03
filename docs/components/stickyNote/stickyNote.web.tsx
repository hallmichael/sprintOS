import { IndiParagraph } from '@/components/text';
import { useSizeRefresh } from '@/hooks/orientation';
import { Pin } from '@tamagui/lucide-icons';
import { useEffect, useRef, useState } from 'react';
import { Card, useTheme } from 'tamagui';
import { IndiAlertClose } from '../alerts/alert';
import { IndiButton } from '../buttons';
import { IndiXStack, IndiYStack } from '../views';

type IndiStickyNoteProps = {
  note: string;
};

export const IndiStickyNote = ({ note }: IndiStickyNoteProps) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReadMore, setShowReadMore] = useState(false);

  const paragraphRef = useRef<any>(null);
  const maxHeight = 48; // Approximate height for 2 lines of text (adjust based on font size and line height)
  const [isShown, setIsShown] = useState(true);

  const width = useSizeRefresh();

  useEffect(() => {
    if (paragraphRef.current) {
      // Allow a small delay for the text layout to complete
      const timeoutId = setTimeout(() => {
        paragraphRef.current.measure((_x, _y, _width, height, _pageX, _pageY) => {
          // Only show read more if text height exceeds maxHeight
          setShowReadMore(height > maxHeight);
          setIsExpanded(height <= maxHeight);
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [width, note]);

  return (
    <Card bg="$alertBg" p="$4" my="$4" br="$4" bc="$alertBorder" bw="$0.5" display={isShown ? 'flex' : 'none'}>
      <IndiXStack jc="space-between" ai="center" gap="$4">
        <IndiXStack flex={1}>
          <IndiYStack mr="$2">
            <Pin size="$5" color="$Yellow600" />
          </IndiYStack>
          <IndiYStack flex={1} width="100%">
            <IndiYStack
              mah={isExpanded ? undefined : maxHeight}
              textWrap="wrap"
              ref={paragraphRef}
              width="100%"
              overflow="hidden">
              <IndiParagraph color="$alertText" textWrap="wrap" width="100%" numberOfLines={isExpanded ? undefined : 2}>
                {note}
              </IndiParagraph>
            </IndiYStack>
            {showReadMore && (
              <IndiButton
                type="link"
                color="secondary"
                size="sm"
                alignSelf="flex-start"
                onPress={() => setIsExpanded(!isExpanded)}
                mt="$2"
                textProps={{ color: '$Yellow600', fontWeight: 'bold' }}>
                {isExpanded ? 'Show Less' : 'Read full note'}
              </IndiButton>
            )}
          </IndiYStack>
        </IndiXStack>
        <IndiAlertClose onPress={() => setIsShown(false)} />
      </IndiXStack>
    </Card>
  );
};
