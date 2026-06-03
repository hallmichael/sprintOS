import { IndiParagraph } from '@/components/text';
import { User } from '@/graphql/graphql';
import { ImageSourcePropType } from 'react-native';
import { Circle } from 'tamagui';
import { IndiImage } from '../images';
import { IndiViewProps, IndiXStack } from '../views';

interface AvatarIconProps {
  text?: string;
  size?: string;
  fontSize?: string;
  backgroundColor?: string;
  imageSource?: ImageSourcePropType | string;
}

export const IndiAvatarIcon = ({
  text,
  size = '$8',
  fontSize = '$5',
  backgroundColor,
  imageSource,
}: AvatarIconProps) => {
  return (
    <Circle
      size={size}
      backgroundColor={backgroundColor || '$avatarBg'}
      elevation="$4"
      boxShadow="none"
      overflow="hidden">
      {imageSource ? (
        <IndiImage src={imageSource as string} width="100%" height="100%" />
      ) : (
        <IndiParagraph color="$textWhite" textTransform="uppercase" fontSize={fontSize}>
          {text}
        </IndiParagraph>
      )}
    </Circle>
  );
};

export const IndiAvartarUser = ({
  user,
  isWithName = true,
  ...props
}: { user?: User; isWithName?: boolean } & IndiViewProps) => {
  const twoFirstLetters = [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('') || '';
  const imageUrl = user?.media?.[0]?.downloadable_url || user?.media_url;
  return (
    <IndiXStack gap="$2" ai="center" {...props}>
      <IndiAvatarIcon text={twoFirstLetters} imageSource={imageUrl ? { uri: imageUrl } : undefined} />
      {isWithName && (
        <IndiParagraph>{user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ')}</IndiParagraph>
      )}
    </IndiXStack>
  );
};
