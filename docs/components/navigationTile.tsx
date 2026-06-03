import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable } from 'react-native-gesture-handler';
import { IndiParagraph } from './text';
import { IndiOutlineCard, IndiView, IndiViewProps, IndiXStack, IndiYStack } from './views';

type IndiNavigationTileProps = {
  href?: any;
  icon?: ReactNode;
  title: string;
  description: string;
} & IndiViewProps;

export function IndiNavigationTile({ href, icon, title, description, onPress, ...props }: IndiNavigationTileProps) {
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <IndiView onPress={e => (href ? router.navigate(href) : onPress?.(e))} {...props}>
      <IndiOutlineCard
        borderColor="$buttonOutlineSecondaryBorder"
        bg="$buttonOutlineSecondaryBg"
        p="$3"
        minHeight="$20"
        borderRadius="$default"
        {...props}
        width={'100%'}
        hoverStyle={{
          bg: '$buttonOutlineSecondaryBgHover',
        }}>
        <IndiXStack gap="$3" alignItems="flex-start">
          {icon && (
            <IndiXStack mt="$1" width="$6" height="$6">
              {icon}
            </IndiXStack>
          )}
          <IndiYStack full gap="$1">
            <IndiParagraph medium textAlign="left">
              {title}
            </IndiParagraph>
            <IndiParagraph color="$textSecondary" textAlign="left" numberOfLines={2}>
              {description}
            </IndiParagraph>
          </IndiYStack>
        </IndiXStack>
      </IndiOutlineCard>
    </IndiView>
  );
}
