import { IndiParagraph } from '@/components/text';
import { X } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Button, Card, XStack, YStack } from 'tamagui';

type AlertProps = {
  note?: string;
  color?: 'yellow' | 'red' | 'green';
  children?: React.ReactNode;
  onClose?: () => void;
  isCloseable?: boolean;
};

export const IndiAlert = ({ note, color = 'yellow', children, isCloseable = true, onClose, ...props }: AlertProps) => {
  const [isShown, setIsShown] = useState(true);

  return (
    <Card
      bg={color == 'yellow' ? '$alertBg' : color == 'red' ? '$alertBgRed' : '$alertBgGreen'}
      p="$4"
      br="$4"
      bc={color == 'yellow' ? '$alertBorder' : color == 'red' ? '$alertBorderRed' : '$alertBorderGreen'}
      bw="$0.5"
      jc="space-between"
      display={isShown ? 'flex' : 'none'}>
      <XStack jc="space-between" ai="flex-start" gap="$4">
        <YStack flex={1} overflow="hidden">
          {children || <IndiParagraph color="$alertText">{note}</IndiParagraph>}
        </YStack>
        {isCloseable && (
          <IndiAlertClose
            onPress={() => {
              setIsShown(false);
              onClose?.();
            }}
          />
        )}
      </XStack>
    </Card>
  );
};

export const IndiAlertClose = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      w="$6"
      h="$6"
      bg="transparent"
      br="$2"
      onPress={onPress}
      p="$1"
      bw={0}
      bc=""
      hoverStyle={{
        backgroundColor: '$alertCloseBgHover',
      }}
      pressStyle={{
        backgroundColor: '$alertCloseBgHover',
      }}>
      <X color="$iconSecondary" size="$4" />
    </Button>
  );
};
