import { useMenuItems } from '@/redux/settings/actions';
import { MenuItem } from '@/types/menu';
import { Href, useRouter, useSegments } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { XStack } from 'tamagui';
import { MobileMenuButton } from './button.native';
import { MobileUserTab } from './extras';

const MORE_MENU_ITEM: MenuItem = {
  title: 'More',
  icon: 'Menu',
  route: '/more',
} as const;

const ITEM_WIDTH = 120; // pixels per menu item

interface MenuCalculation {
  visibleMenuItems: MenuItem[];
  hiddenMenuItems: MenuItem[];
  hasMoreItems: boolean;
}

export const calculateMenuItems = (items: MenuItem[], width: number): MenuCalculation => {
  const maxVisibleItems = Math.floor(width / ITEM_WIDTH);
  const hasMoreItems = items.length > maxVisibleItems;

  const visibleMenuItems = hasMoreItems ? items.slice(0, maxVisibleItems - 1) : items.slice(0, maxVisibleItems);

  const hiddenMenuItems = hasMoreItems ? items.slice(maxVisibleItems - 1) : [];

  return {
    visibleMenuItems,
    hiddenMenuItems,
    hasMoreItems,
  };
};

export const MainMenu = () => {
  const items = useMenuItems();
  const { navigate } = useRouter();
  const segments = useSegments();
  const { width } = useWindowDimensions();

  const currentRoute = useMemo(() => `/${segments[1] || ''}`, [segments]);

  const { visibleMenuItems, hiddenMenuItems, hasMoreItems } = useMemo(() => calculateMenuItems(items, width), [width]);

  const handleNavigation = useCallback(
    (route: Href) => {
      if (route === '/more') {
        navigate({
          pathname: route,
          params: { hiddenMenuItems: JSON.stringify(hiddenMenuItems) },
        });
      } else {
        navigate(route || '/(app)');
      }
    },
    [navigate, hiddenMenuItems],
  );

  return (
    <XStack btw={1} bc="$border" bg="$menuBgDefault">
      <XStack f={1} jc="space-around">
        {visibleMenuItems.map((item, i) => (
          <MobileMenuButton key={i} item={item} onPress={handleNavigation} currentRoute={currentRoute} />
        ))}
        {hasMoreItems ? (
          <MobileMenuButton item={MORE_MENU_ITEM} onPress={handleNavigation} currentRoute={currentRoute} />
        ) : (
          <MobileUserTab onPress={() => navigate('/profile')} currentRoute={currentRoute} />
        )}
      </XStack>
    </XStack>
  );
};
