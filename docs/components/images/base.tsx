import React from 'react';
import { Image, ImageProps } from 'tamagui';

export type IndiImageProps = ImageProps;

export const IndiImage = React.forwardRef<any, IndiImageProps>((props, ref) => {
  // We'll forward the ref to the container since the Tamagui Image doesn't directly support refs
  return <Image {...props} />;
});
