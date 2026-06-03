import { IndiButton, IndiParagraph, IndiView, IndiXStack, IndiYStack } from '@/components';
import { MenuChild, MenuItem } from '@/types/menu';
import { ChevronUp } from '@tamagui/lucide-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { IndiIcon } from '../icon';
import { IndiText } from '../text';
import { MenuPopOver } from './popover';

type MobileMenuButtonProps = {
  item: MenuItem;
  onPress?: (route: Href) => void;
  currentRoute?: string;
  isInMore?: boolean;
};

export const MobileMenuButton = ({ item, onPress, currentRoute, isInMore }: MobileMenuButtonProps) => {
  const [open, setOpen] = useState(false);
  const isActive = currentRoute === item.route;

  const handlePress = () => {
    if (item.children) setOpen(!open);
    else onPress?.(item.route);
  };

  if (isInMore) {
    return (
      <IndiButton bbw={1} bc="$border" mx="$4" pt="$4" pb="$2" jc="center">
        <IndiXStack onPress={handlePress} pb="$2" ai="center">
          <IndiIcon name={item.icon} mx="$3.5" color={'$sidebarContentDefault'} />
          <IndiParagraph color="$sidebarContentDefault">{item.title}</IndiParagraph>
        </IndiXStack>
        {open && (
          <IndiYStack>
            {item.children?.map((child, i) => (
              <MobileMenuButtonChild key={i} item={child} />
            ))}
          </IndiYStack>
        )}
      </IndiButton>
    );
  }

  return (
    <IndiView onPress={() => handlePress()} height={50}>
      <IndiView f={1} center>
        <IndiIcon name={item.icon} color={isActive ? '$sidebarContentActive' : '$iconMuted'} size={24} />
        <IndiText semibold col={isActive ? '$iconPrimary' : '$iconMuted'} mt="$1">
          {item.title}
        </IndiText>
        {item.children && (
          <MenuPopOver open={open} onOpenChange={setOpen} Icon={ChevronUp}>
            {item.children.map((child, i) => (
              <MobileMenuButtonChild key={i} item={child} />
            ))}
          </MenuPopOver>
        )}
      </IndiView>
    </IndiView>
  );
};

type MobileMenuButtonChildProps = {
  item: MenuChild;
};

const MobileMenuButtonChild = ({ item }: MobileMenuButtonChildProps) => {
  const router = useRouter();
  const path = usePathname();
  let isActive = path == item.route;

  return (
    <IndiView py="$2" w={'100%'} miw="$10">
      <IndiButton onPress={() => router.push(item.route)} jc="space-between" py="$0" bw={0}>
        <IndiParagraph col={isActive ? '$sidebarContentActive' : '$sidebarContentDefault'}>{item.title}</IndiParagraph>
      </IndiButton>
    </IndiView>
  );
};
