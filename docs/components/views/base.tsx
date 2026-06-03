import { forwardRef } from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { GetProps, isWeb, styled, TamaguiElement, View as TView } from 'tamagui';

const BaseView = styled(TView, {
  variants: {
    disabled: {
      true: {
        style: {
          cursor: 'not-allowed',
        },
        cursor: 'not-allowed',
        // pointerEvents: 'none',
      },
    },
    center: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    full: {
      true: {
        flex: 1,
      },
    },
    size: {
      '...size': (size, { tokens }) => {
        // if size is a number, return the size
        if (typeof size === 'number') {
          return {
            width: size,
            height: size,
          };
        }
        return {
          width: tokens.size[size] ?? size,
          height: tokens.size[size] ?? size,
        };
      },
    },
    border: {
      true: {
        borderWidth: 1,
        borderColor: '$border',
      },
    },
    borderBottom: {
      true: {
        borderBottomWidth: 1,
        borderColor: '$border',
      },
    },
    borderTop: {
      true: {
        borderTopWidth: 1,
        borderColor: '$border',
      },
    },
    borderRight: {
      true: {
        borderRightWidth: 1,
        borderColor: '$border',
      },
    },
    borderLeft: {
      true: {
        borderLeftWidth: 1,
        borderColor: '$border',
      },
    },
    absoluteFillParent: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    rounded: {
      true: {
        borderRadius: '$4',
      },
      sm: {
        borderRadius: '$2',
      },
      md: {
        borderRadius: '$4',
      },
      lg: {
        borderRadius: '$6',
      },
      xl: {
        borderRadius: '$8',
      },
      full: {
        borderRadius: 999999,
      },
    },
    shadow: {
      popover: {
        boxShadow: '2px 4px 10px 4px rgba(0,0,0,0.06)',
      },
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
      sm: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      },
    },
  } as const,
});

export type IndiViewProps = GetProps<typeof BaseView>;

export const IndiView = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  const handlePress = (e: GestureResponderEvent) => {
    // Only stop propagation on web platforms to avoid issues with touch events on mobile
    if (isWeb) {
      e.stopPropagation();
    }
    props.onPress?.(e);
  };

  const onPress = props.onPress && !props.disabled ? handlePress : undefined;

  const cursor = props.disabled ? 'not-allowed' : onPress ? 'pointer' : undefined;

  const pressStyle = onPress
    ? {
        opacity: 0.8,
        ...props.pressStyle,
      }
    : undefined;

  return <BaseView {...props} ref={ref} onPress={onPress} cursor={cursor} $platform-web={{ pressStyle }} />;
});

IndiView.displayName = 'View';

export const IndiXStack = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return <IndiView flexDirection="row" {...props} ref={ref} />;
});

export const IndiXStackResponsive = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return (
    <IndiXStack gap="$6" $md={{ gap: '$4', fd: 'column' }} $xs={{ gap: '$2', fd: 'column' }} {...props} ref={ref} />
  );
});

export const IndiYStack = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return <IndiView flexDirection="column" {...props} ref={ref} />;
});

export const IndiYStackResponsive = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return (
    <IndiYStack gap="$6" $md={{ gap: '$4', fd: 'column' }} $xs={{ gap: '$2', fd: 'column' }} {...props} ref={ref} />
  );
});

export const IndiCircle = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return <BaseView ref={ref} borderRadius={'$full'} {...props} />;
});

export const IndiSeparator = forwardRef<TamaguiElement, IndiViewProps>((props, ref) => {
  return <BaseView ref={ref} height={isWeb ? 1 : StyleSheet.hairlineWidth} bg={'$border'} {...props} />;
});
