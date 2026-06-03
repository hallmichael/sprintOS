import { IndiButton } from '@/components/buttons';
import { IndiMenuSegment } from '@/components/text';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { router, useSegments } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { XStack, YStack } from 'tamagui';

type HeaderProps = {
  mobileTitle?: string;
  mobileButtons?: { title: string; onPress: () => void }[];
  sideButtons?: React.ReactNode;
};

export const IndiHeader = ({ mobileTitle, mobileButtons, sideButtons }: HeaderProps) => {
  const segments = useSegments().filter(route => !route.includes('(') && !route.includes(')'));
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  return (
    <XStack bg="$containerBg" px="$4" py="$2" bbw={1} bc={'$border'}>
      <XStack jc="space-between" f={1} pb="$2" bc="$border">
        <XStack f={1} ai="center">
          {segments.length > 1 && (
            <YStack jc="center" onPress={router.back} miw="$3">
              <ChevronLeft />
            </YStack>
          )}

          <YStack jc="center">
            <IndiMenuSegment color="$textNeutral" textTransform={mobileTitle ? 'unset' : 'capitalize'}>
              {mobileTitle || segments[segments.length - 1]}
            </IndiMenuSegment>
          </YStack>
        </XStack>
        <XStack miw={isMobile ? '$1' : '$3'} gap={isMobile ? '$1' : '$2'} scale={isMobile ? 0.8 : 1}>
          {sideButtons}
          {mobileButtons?.map((action, i) => (
            <IndiButton key={i} type="solid" color="primary" size="md" text={action.title} onPress={action.onPress} />
          ))}
        </XStack>
      </XStack>
    </XStack>
  );
};
