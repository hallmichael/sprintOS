import { IndiParagraph } from '@/components/text';
import { Pin } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Card, XStack, YStack, useTheme } from 'tamagui';

type IndiStickyNoteProps = {
  note: string;
};

export const IndiStickyNote = ({ note }: IndiStickyNoteProps) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReadMore, setShowReadMore] = useState(false);

  const onTextLayout = (e: any) => {
    if (e.nativeEvent.lines.length > 2 && !showReadMore) {
      setShowReadMore(true);
      setIsExpanded(false);
    }
  };

  return (
    <Card bg="$alertBg" p="$4" my="$4" br="$4" bc="$alertBorder" bw="$0.5">
      <XStack>
        <YStack mr="$2">
          <Pin size="$5" color="$Yellow600" />
        </YStack>
        <YStack flex={1} overflow="hidden">
          <YStack mah={isExpanded ? undefined : '$5'}>
            <IndiParagraph color="$alertText" onTextLayout={onTextLayout} numberOfLines={isExpanded ? undefined : 2}>
              {note}
            </IndiParagraph>
          </YStack>
          {showReadMore && (
            <IndiParagraph color="$Yellow600" mt="$2" onPress={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show Less' : 'Read full note'}
            </IndiParagraph>
          )}
        </YStack>
      </XStack>
    </Card>
  );
};
