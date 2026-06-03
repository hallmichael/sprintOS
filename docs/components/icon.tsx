import { GetProps } from 'tamagui';

import * as icons from '@tamagui/lucide-icons';

export type IconName = keyof typeof icons;
export type IndiIconProps = GetProps<(typeof icons)[keyof typeof icons]> & {
  name: IconName;
};

export const IndiIcon = ({ name, color = '$textSecondary', ...props }: IndiIconProps) => {
  const IconComponent = icons[name as IconName];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent color={color} size={'$4'} {...props} />;
};
