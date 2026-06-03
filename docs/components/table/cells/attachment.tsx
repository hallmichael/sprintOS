import { IndiParagraph, IndiText, IndiTooltip, IndiXStack, Toast } from '@/components';
import { IndiButton } from '@/components/buttons';
import { Media } from '@/graphql/graphql';
import { Paperclip } from '@tamagui/lucide-icons';
import { useState } from 'react';

import { Linking } from 'react-native';

// Attachment cell component to handle state
export const TableAttachmentCell = ({ media }: { media: Media[] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayMedia = showAll || (media && media.length <= 2) ? media : media?.slice(0, 2);

  if (!media.length) {
    return <IndiText>No attachments</IndiText>;
  }

  return (
    <IndiXStack gap="$1" flexWrap="wrap" maxWidth={200}>
      {displayMedia.map((item, index) => (
        <IndiTooltip tooltip={item.name || 'Attachment'}>
          <IndiButton
            key={index}
            text={item.name || 'Attachment'}
            size="sm"
            type="outline"
            color="secondary"
            icon={Paperclip}
            jc="flex-start"
            flex={1}
            onPress={() => {
              if (item.downloadable_url) {
                Linking.openURL(item.downloadable_url);
              } else {
                Toast.error({ message: 'Attachment not found' });
              }
            }}
          />
        </IndiTooltip>
      ))}
      {!showAll && media.length > 2 && (
        <IndiParagraph color="$blue10" onPress={() => setShowAll(true)} cursor="pointer">
          Show {media.length - 2} more
        </IndiParagraph>
      )}
      {showAll && media.length > 2 && (
        <IndiParagraph color="$blue10" onPress={() => setShowAll(false)} cursor="pointer">
          Show less
        </IndiParagraph>
      )}
    </IndiXStack>
  );
};
