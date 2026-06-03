import { useLogout } from '@/graphql';
import { useFetchData } from '@/hooks';
import { fetchSystemEntities } from '@/redux/app/actions';
import { logout as ReduxLogout } from '@/redux/app/reducer';
import { useUser } from '@/redux/app/selectors';
import { useMenuItems } from '@/redux/settings/actions';
import { ChevronDown, LogOut, User } from '@tamagui/lucide-icons';
import { images } from 'assets/images';
import { Link, useRouter, useSegments } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image, Popover, XStack, YStack } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiAvartarUser } from '../miscellaneous/avatarIcon';
import { IndiH4, IndiParagraph } from '../text';
import { IndiXStack } from '../views';
import { clearPersistedState } from '@/redux/store';

export const MainMenu = () => {
  const items = useMenuItems();
  const user = useUser();
  const { navigate } = useRouter();
  const segments = useSegments();
  const currentRoute = `/(app)/${segments[1]}`;
  const { logout } = useLogout();
  useFetchData(fetchSystemEntities());

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    clearPersistedState().then(() => {
      dispatch(ReduxLogout());
      logout();
      router.replace('/(auth)');
    });
  };

  const [isHovering, setIsHovering] = useState<Record<number, boolean>>({});

  return (
    <YStack>
      <XStack h={60} bg="$menuBgDefault" ai="center" jc="space-between" px="$4" bbc="$border" bbw={1}>
        {/* Logo and Navigation Links */}
        <XStack ai="center" gap="$6">
          <Image source={images.logo} h={40} w={120} resizeMode="contain" />

          {/* Navigation Links - Moved next to logo */}
          <XStack ai="center" gap="$4">
            {items.map((item, i) => {
              // Check if it's the Settings menu with children
              if (item.children && item.children.length > 0) {
                return (
                  <Popover key={i} open={settingsMenuOpen} onOpenChange={setSettingsMenuOpen} placement="bottom-start">
                    <Popover.Trigger asChild>
                      <XStack
                        ai="center"
                        gap="$1"
                        px="$3"
                        onMouseEnter={() => setIsHovering({ ...isHovering, [i]: true })}
                        onMouseLeave={() => setIsHovering({ ...isHovering, [i]: false })}
                        cursor="pointer">
                        <IndiParagraph
                          key={i}
                          h={60}
                          ac="center"
                          br={0}
                          medium
                          color={
                            isHovering[i]
                              ? '$textPrimary'
                              : currentRoute == item.route
                              ? '$textPrimary'
                              : '$textSecondary'
                          }>
                          {item.title}
                        </IndiParagraph>

                        <ChevronDown
                          size={16}
                          color={
                            isHovering[i]
                              ? '$textPrimary'
                              : currentRoute == item.route
                              ? '$textPrimary'
                              : '$textSecondary'
                          }
                        />
                      </XStack>
                    </Popover.Trigger>
                    <Popover.Content
                      borderWidth={1}
                      p={'$2'}
                      top="$-2"
                      borderColor="$borderColor"
                      bg="$dropdownBgDefault"
                      boxShadow="$dropdownShadow"
                      elevation={3}
                      enterStyle={{ y: -10, opacity: 0 }}
                      exitStyle={{ y: -10, opacity: 0 }}
                      elevate
                      animation={[
                        'quick',
                        {
                          opacity: {
                            overshootClamping: true,
                          },
                        },
                      ]}
                      minWidth={192}>
                      <YStack gap={0} minWidth={192}>
                        {item.children?.map((child, childIndex) => (
                          <Link key={childIndex} href={child.route as any}>
                            <IndiButton
                              f={1}
                              w="100%"
                              jc="flex-start"
                              bg="$menuBgDefault"
                              type="ghost"
                              color="secondary"
                              textProps={{ fontFamily: '$body', color: '$textNeutral' }}
                              text={child.title}
                              onPress={() => {
                                setSettingsMenuOpen(false);
                              }}
                            />
                          </Link>
                        ))}
                      </YStack>
                    </Popover.Content>
                  </Popover>
                );
              }
              // Regular menu item without children
              return (
                <Link key={i} href={item.route as any}>
                  <IndiParagraph
                    f={1}
                    h={60}
                    px="$3"
                    ac="center"
                    br={0}
                    medium
                    color={currentRoute == item.route ? '$textPrimary' : '$textSecondary'}
                    cursor="pointer"
                    hoverStyle={{
                      color: '$textPrimary',
                    }}>
                    {item.title}
                  </IndiParagraph>
                </Link>
              );
            })}
          </XStack>
        </XStack>

        {/* User Menu */}
        <XStack ai="center" gap="$2">
          <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen} placement="bottom-end">
            <Popover.Trigger asChild>
              <XStack ai="center" gap="$1" px="$3" cursor="pointer">
                <IndiAvartarUser user={user as any} isWithName={false} />
              </XStack>
            </Popover.Trigger>
            <Popover.Content
              borderWidth={1}
              p={'$2'}
              top="$2"
              borderColor="$borderColor"
              bg="$dropdownBgDefault"
              boxShadow="$dropdownShadow"
              elevation={3}
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              minWidth={192}>
              <YStack gap={0} minWidth={192}>
                <IndiXStack py="$3.5" px="$4">
                  <IndiH4>{`${user?.first_name} ${user?.last_name}` || 'User'}</IndiH4>
                </IndiXStack>
                <IndiButton
                  f={1}
                  w="100%"
                  jc="flex-start"
                  bg="$menuBgDefault"
                  type="ghost"
                  color="secondary"
                  icon={User}
                  text="Account"
                  onPress={() => {
                    setUserMenuOpen(false);
                  }}
                />
                <IndiButton
                  f={1}
                  w="100%"
                  jc="flex-start"
                  bg="$menuBgDefault"
                  type="ghost"
                  color="red"
                  icon={LogOut}
                  text="Logout"
                  onPress={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                />
              </YStack>
            </Popover.Content>
          </Popover>
        </XStack>
      </XStack>
    </YStack>
  );
};
