import { GetProps, styled } from 'tamagui';
import { IndiImage } from './base';

export const IndiThumbnail = styled(IndiImage, {
  variants: {
    size: {
      sm: {
        width: 32,
        height: 32,
      },
      md: {
        width: 40,
        height: 40,
      },
      lg: {
        width: 48,
        height: 48,
      },
    },
  },
});

export type IndiThumbnailProps = GetProps<typeof IndiThumbnail>;
