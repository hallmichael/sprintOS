import { forwardRef } from 'react';
import { isWeb, TamaguiElement } from 'tamagui';
import { IndiView, IndiViewProps } from './base';

export const IndiCard = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  const pressProps = props.onPress
    ? {
        cursor: 'pointer',
        hoverStyle: { backgroundColor: '$backgroundHover', scale: 1.01 },
        pressStyle: { opacity: 0.8 },
      }
    : undefined;

  return (
    <IndiView bg={'$containerBg'} borderRadius={'$default'} overflow="hidden" {...pressProps} {...props} ref={ref} />
  );
});

export const IndiOutlineCard = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return (
    <IndiCard
      p="$6"
      bg={'$colorTransparent'}
      borderRadius={'$default'}
      border
      overflow="hidden"
      {...(isWeb && { flexWrap: 'wrap' })}
      {...props}
      $sm={{ flexDirection: 'column' }}
      ref={ref}
    />
  );
});
