import { IndiParagraph } from '@/components/text';
import { MenuChild, MenuItem } from '@/types/menu';
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { allIcons } from 'constants/icons';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { MenuPopOver } from './popover';

type WebMenuButtonProps = {
  item: MenuItem;
  onPress?: () => void;
  currentRoute: string;
  condensed?: boolean;
};
export const WebMenuButton = ({ item, onPress, currentRoute, condensed }: WebMenuButtonProps) => {
  const [open, setOpen] = useState(false);
  const isActive = currentRoute === item.route;
  const IconComponent = allIcons[item.icon];
  let iconColor = isActive ? '$sidebarContentActive' : '$sidebarContentDefault';
  let iconAfter = open ? <ChevronDown color={iconColor} /> : <ChevronRight color={iconColor} />;

  // Children condensed
  if (item.children && condensed) {
    return (
      <Button chromeless onPress={() => setOpen(!open)} jc="flex-start" py="$5">
        <XStack ai="center">
          <IconComponent size="$4" color={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'} />
          <MenuPopOver open={open} onOpenChange={setOpen} Icon={ChevronRight}>
            {item.children.map((child, i) => (
              <WebMenuButtonChild key={i} item={child} />
            ))}
          </MenuPopOver>
        </XStack>
      </Button>
    );
  }

  // Children but not condensed
  if (item.children && !condensed) {
    return (
      <YStack>
        <Button chromeless onPress={() => setOpen(!open)} jc="space-between" py="$5" iconAfter={iconAfter}>
          <XStack ai="center">
            <IconComponent size="$4" color={iconColor} />
            <IndiParagraph col={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'} ml="$3">
              {item.title}
            </IndiParagraph>
          </XStack>
        </Button>
        {open && (
          <YStack>
            {item.children.map((child, i) => (
              <WebMenuButtonChild key={i} item={child} />
            ))}
          </YStack>
        )}
      </YStack>
    );
  }

  return (
    <Button chromeless onPress={onPress} jc="flex-start" py="$5" bg={isActive ? '$menuBgSelected' : '$menuBgDefault'}>
      <XStack ai="center">
        <IconComponent size="$4" color={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'} />
        {!condensed && (
          <IndiParagraph col={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'} ml="$3">
            {item.title}
          </IndiParagraph>
        )}
      </XStack>
    </Button>
  );
};

type WebMenuButtonChildProps = {
  item: MenuChild;
};

const WebMenuButtonChild = ({ item }: WebMenuButtonChildProps) => {
  const router = useRouter();
  const path = usePathname();
  let isActive = path == item.route;

  return (
    <YStack py="$2" w={'100%'}>
      <Button chromeless onPress={() => router.push(item.route)} jc="space-between" py="$0" bw={0}>
        <IndiParagraph col={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'}>{item.title}</IndiParagraph>
      </Button>
    </YStack>
  );
};
