import { IndiParagraph } from '@/components/text';
import { useUser } from '@/redux/app/selectors';
import { sprint_assets } from 'assets/images';
import { Image, XStack } from 'tamagui';
import { IndiAvatarIcon } from '../miscellaneous/avatarIcon';

type UserTabProps = {
  onPress?: () => void;
  hideName?: boolean;
};

export const UserTab = ({ onPress, hideName }: UserTabProps) => {
  const user = useUser();
  if (!user) return null;
  return (
    <XStack ai="center" p="$3" onPress={onPress} bbw={1} bc="$border">
      <IndiAvatarIcon text={(user.first_name?.slice(0, 1) ?? '') + (user.last_name?.slice(0, 1) ?? '')} fontSize="$4" />

      {!hideName && (
        <IndiParagraph color="$sidebarContentDefault" numberOfLines={1} mx="$3">
          {user.full_name}
        </IndiParagraph>
      )}
    </XStack>
  );
};

export const PoweredBySprint = () => {
  return (
    <XStack jc="center" ai="center" py="$3">
      <IndiParagraph>Powered by</IndiParagraph>
      <Image ml="$2" source={sprint_assets.logo} />
    </XStack>
  );
};

type MobileUserTabProps = {
  onPress?: () => void;
  currentRoute: string;
};

export const MobileUserTab = ({ onPress, currentRoute }: MobileUserTabProps) => {
  const user = useUser();
  if (!user) return null;
  const isActive = currentRoute === '/profile';
  return (
    <XStack ai="center" onPress={onPress}>
      <IndiAvatarIcon
        backgroundColor={isActive ? '$iconPrimary' : '$avatarBg'}
        text={(user.first_name?.slice(0, 1) ?? '') + (user.last_name?.slice(0, 1) ?? '')}
        size={'$3'}
        fontSize="$4"
      />
    </XStack>
  );
};
