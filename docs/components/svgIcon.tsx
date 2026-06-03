import { SvgXml, XmlProps } from 'react-native-svg';
import { XStack, useTheme } from 'tamagui';

type SvgIconProps = {
  icon?: string;
  size?: number;
  svgProps?: XmlProps;
  [key: string]: any;
};

export const SVGIcon = ({icon, size = 48, ...props}: SvgIconProps) => {
  const theme = useTheme();
  if (!icon) {
    return null;
  }
  return (
    <XStack {...props}>
      <SvgXml xml={icon} width={size} height={size} color={theme.navTileIcon.val} {...props} />
    </XStack>
  );
};
