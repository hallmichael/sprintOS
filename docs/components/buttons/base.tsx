import { forwardRef, useMemo, useState } from 'react';
import { Button, GetProps, Spinner, styled } from 'tamagui';

export const BaseButton = styled(Button, {
  bg: '$buttonPrimaryBg',
  color: '$buttonPrimaryContent',
  pressStyle: {
    opacity: 1,
  },
  borderRadius: '$default',
  px: '$4',
  cursor: 'pointer',
  height: '$buttonHeight',
  textProps: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '$body',
    pointerEvents: 'none',
  },
  // Add variants for different button types, colors, and sizes
  variants: {
    center: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    disabled: {
      true: {
        // pointerEvents: 'none',
        pointerEvents: 'auto',
        cursor: 'not-allowed',
        pressStyle: {
          opacity: 1, // Prevent opacity change on press when disabled
        },
        hoverStyle: {
          opacity: 1, // Prevent opacity change on hover when disabled
        },
      },
    },
    type: {
      solid: {
        borderWidth: 1,
      },
      outline: {
        borderWidth: 1,
      },
      ghost: {
        bg: 'transparent',
        borderWidth: 1,
      },
      link: {
        bg: 'transparent',
        borderWidth: 0,
        hoverStyle: {
          backgroundColor: 'transparent',
        },
        pressStyle: {
          backgroundColor: 'transparent',
        },
        textProps: {
          fontSize: 14,
          fontWeight: 500,
          hoverStyle: {
            textDecorationLine: 'underline',
          },
        },
      },
    },
    // Use variant groups to handle combinations
    solidPrimary: {
      true: {
        bg: '$buttonSolidPrimaryBg',
        color: '$buttonSolidPrimaryContent',
        hoverStyle: {
          backgroundColor: '$buttonSolidPrimaryBgHover',
          borderColor: '$buttonSolidPrimaryBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonSolidPrimaryBgHover',
          borderColor: '$buttonSolidPrimaryBgHover',
        },
        borderColor: '$buttonSolidPrimaryBg',
      },
    },
    solidRed: {
      true: {
        bg: '$buttonSolidRedBg',
        color: '$buttonSolidRedContent',
        hoverStyle: {
          backgroundColor: '$buttonSolidRedBgHover',
          borderColor: '$buttonSolidRedBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonSolidRedBgHover',
          borderColor: '$buttonSolidRedBgHover',
        },
        borderColor: '$buttonSolidRedBg',
      },
    },
    solidSecondary: {
      true: {
        bg: '$buttonSolidSecondaryBg',
        color: '$buttonSolidSecondaryContent',
        hoverStyle: {
          backgroundColor: '$buttonSolidSecondaryBgHover',
          borderColor: '$buttonSolidSecondaryBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonSolidSecondaryBgHover',
          borderColor: '$buttonSolidSecondaryBgHover',
        },
        borderColor: '$buttonSolidSecondaryBg',
      },
    },
    outlinePrimary: {
      true: {
        bg: '$buttonOutlinePrimaryBg',
        color: '$buttonOutlinePrimaryContent',
        borderColor: '$buttonOutlinePrimaryBorder',
        hoverStyle: {
          backgroundColor: '$buttonOutlinePrimaryBgHover',
          borderColor: '$buttonOutlinePrimaryBorder',
        },
        pressStyle: {
          backgroundColor: '$buttonOutlinePrimaryBgHover',
          borderColor: '$buttonOutlinePrimaryBorder',
        },
      },
    },
    outlineRed: {
      true: {
        bg: '$buttonOutlineRedBg',
        color: '$buttonOutlineRedContent',
        borderColor: '$buttonOutlineRedBorder',
        hoverStyle: {
          backgroundColor: '$buttonOutlineRedBgHover',
          borderColor: '$buttonOutlineRedBorder',
        },
        pressStyle: {
          backgroundColor: '$buttonOutlineRedBgHover',
          borderColor: '$buttonOutlineRedBorder',
        },
      },
    },
    outlineSecondary: {
      true: {
        bg: '$buttonOutlineSecondaryBg',
        color: '$buttonOutlineSecondaryContent',
        borderColor: '$buttonOutlineSecondaryBorder',
        hoverStyle: {
          backgroundColor: '$buttonOutlineSecondaryBgHover',
          borderColor: '$buttonOutlineSecondaryBorder',
        },
        pressStyle: {
          backgroundColor: '$buttonOutlineSecondaryBgHover',
          borderColor: '$buttonOutlineSecondaryBorder',
        },
      },
    },
    ghostPrimary: {
      true: {
        color: '$buttonGhostPrimaryContent',
        hoverStyle: {
          backgroundColor: '$buttonGhostPrimaryBgHover',
          borderColor: '$buttonGhostPrimaryBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonGhostPrimaryBgHover',
          borderColor: '$buttonGhostPrimaryBgHover',
        },
      },
    },
    ghostRed: {
      true: {
        color: '$buttonGhostRedContent',
        hoverStyle: {
          backgroundColor: '$buttonGhostRedBgHover',
          borderColor: '$buttonGhostRedBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonGhostRedBgHover',
          borderColor: '$buttonGhostRedBgHover',
        },
      },
    },
    ghostSecondary: {
      true: {
        color: '$buttonGhostSecondaryContent',
        hoverStyle: {
          backgroundColor: '$buttonGhostSecondaryBgHover',
          borderColor: '$buttonGhostSecondaryBgHover',
        },
        pressStyle: {
          backgroundColor: '$buttonGhostSecondaryBgHover',
          borderColor: '$buttonGhostSecondaryBgHover',
        },
      },
    },
    linkPrimary: {
      true: {
        color: '$buttonLinkPrimaryText',
      },
    },
    linkRed: {
      true: {
        color: '$buttonLinkRedText',
      },
    },
    linkSecondary: {
      true: {
        color: '$buttonLinkNeutralText',
      },
    },
    // Disabled states for different button types
    solidDisabled: {
      true: {
        bg: '$buttonSolidDisabledBg',
        borderColor: '$buttonSolidDisabledBg',
        color: '$buttonSolidDisabledContent',
        opacity: 1,
        hoverStyle: {
          bg: '$buttonSolidDisabledBg',
          borderColor: '$buttonSolidDisabledBg',
        },
        pressStyle: {
          bg: '$buttonSolidDisabledBg',
          borderColor: '$buttonSolidDisabledBg',
        },
      },
    },
    outlineDisabled: {
      true: {
        bg: '$buttonOutlineDisabledBg',
        color: '$buttonOutlineDisabledContent',
        borderColor: '$buttonOutlineDisabledBorder',
        opacity: 1,
        hoverStyle: {
          bg: '$buttonOutlineDisabledBg',
          borderColor: '$buttonOutlineDisabledBorder',
        },
        pressStyle: {
          bg: '$buttonOutlineDisabledBg',
          borderColor: '$buttonOutlineDisabledBorder',
        },
      },
    },
    ghostDisabled: {
      true: {
        color: '$buttonGhostDisabledContent',
        opacity: 1,
        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
    linkDisabled: {
      true: {
        color: '$buttonLinkDisabledText',
        opacity: 1,
        hoverStyle: {
          bg: '$buttonLinkDisabledBg',
          borderColor: '$buttonLinkDisabledBorder',
        },
        pressStyle: {
          bg: '$buttonLinkDisabledBg',
          borderColor: '$buttonLinkDisabledBorder',
        },
      },
    },

    ghostFileManager: {
      true: {
        bg: 'transparent',
        color: '$textNeutral',
        borderRadius: 4,
        px: 8,
        py: 10,
        height: 'auto',
        minHeight: 32,
        textProps: {
          fontSize: 15,
          fontWeight: 400,
          fontFamily: "Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
        hoverStyle: {
          backgroundColor: '#0000001f',
        },
        pressStyle: {
          backgroundColor: '#0000001f',
        },
        borderColor: 'transparent',
        borderWidth: 0,
      },
    },
    /** Plain muted text link: no background change, straight underline on hover. Use with type="ghost" color="secondary". */
    mutedLink: {
      true: {
        p: 0,
        height: 'auto',
        color: '$textSecondary',
        borderColor: 'transparent',
        textProps: {
          fontWeight: 400,
        },
        hoverStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: '$textSecondary',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        pressStyle: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

export type IndiButtonProps = GetProps<typeof BaseButton> & {
  type?: 'solid' | 'outline' | 'ghost' | 'link';
  color?: 'primary' | 'red' | 'secondary' | 'fileManager';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  handlePress?: (event?: any) => Promise<any> | void;
  text?: string;
  loading?: boolean;
  /** Plain muted text link styling (underline on hover, no color change). Use with type="ghost" color="secondary". */
  mutedLink?: boolean;
};

// Example usage component with proper variant handling
export const IndiButton = forwardRef(
  (
    {
      type = 'solid',
      color = 'primary',
      size = 'lg',
      disabled,
      handlePress,
      text,
      children,
      icon,
      loading,
      mutedLink,
      ...props
    }: IndiButtonProps,
    ref?: any,
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const isIconOnly = Boolean(icon && !text && !children);

    const sizeProps = (() => {
      if (type === 'link') return { px: 0, height: 'auto' };

      // Icon-only buttons should have equal width and height
      if (isIconOnly) {
        switch (size) {
          case 'xs':
            return { width: '$6', height: '$6', padding: '$1', borderRadius: '$1' };
          case 'sm':
            return { width: '$8', height: '$8', padding: '$1.5', borderRadius: '$2' };
          case 'md':
            return { width: '$9', height: '$9', padding: '$2', borderRadius: '$2' };
          case 'lg':
          default:
            return { width: '$10', height: '$10', padding: '$2.5', borderRadius: '$3' };
        }
      }

      // Regular buttons with text
      if (size === 'sm') return { px: 10, height: '$8', minWidth: '$10' };
      if (size === 'md') return { px: '$2', height: '$9', minWidth: '$10' };
      if (size === 'xs') return { width: '$7', height: '$7', borderRadius: '$1' };
      return { px: '$3', height: '$10', minWidth: '$10' };
    })();

    const onPress = async (event: any) => {
      if (disabled || isLoading) return;
      try {
        event.stopPropagation();
        if (handlePress) {
          // delay the setIsLoading to prevent the button from being disabled immediately
          setIsLoading(true);
          await handlePress(event);
        } else {
          props.onPress?.(event);
        }
      } catch (error: any) {
        console.log('Button callback error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const _loading = isLoading || loading;
    const variant = `${type}${color.charAt(0).toUpperCase() + color.slice(1)}`;
    const isDisabled = disabled || _loading;

    // Create dynamic variant props based on type and color
    const variantProps = {
      type,
      [variant]: true,
      mutedLink: !!mutedLink,
      disabled: isDisabled,
      // Apply type-specific disabled styling
      [`${type}Disabled`]: isDisabled,
      center: isIconOnly,
    };

    const renderIcon = useMemo(() => {
      if (_loading) return <Spinner />;
      return icon;
    }, [_loading, icon]);

    return (
      <BaseButton
        {...sizeProps}
        {...variantProps}
        ref={ref}
        disabled={isDisabled}
        onPress={onPress}
        {...props}
        icon={renderIcon}>
        {children || text}
      </BaseButton>
    );
  },
);
