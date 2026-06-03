import { IndiParagraph } from '@/components/text';
import { IndiViewProps, IndiXStack } from '@/components/views/base';
import { X } from '@tamagui/lucide-icons';
import React from 'react';
import { IndiTooltip } from './tooltip';

/** Figma (Linked file component): max width 220px; filename truncates with ellipsis; hover shows full name in tooltip. */
const FILE_ATTACHMENT_MAX_WIDTH = 220;

type IndiBadgesProps = {
  text: string | React.ReactNode;
  onRemove?: () => void;
  isReadonly?: boolean;
  icon?: React.ComponentType<{ size?: number; color?: string }> | React.ReactNode;
  onIconPress?: (e: any) => void;
  onIconHover?: (isHovering: boolean) => void;
  onTextPress?: (e: any) => void;
  onTextHover?: (isHovering: boolean) => void;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  fontStyle?: 'normal' | 'italic';
  /**
   * Linked file chip (SharePoint / AttachmentCell): single-line truncation within max width,
   * hover tooltip with full filename (see Figma PCG-Web-Admin Linked File documentation).
   */
  fileAttachment?: boolean;
} & IndiViewProps;

export const IndiTags = ({
  text,
  isReadonly = false,
  onRemove,
  icon,
  backgroundColor,
  borderColor,
  onIconPress,
  onIconHover,
  onTextPress,
  onTextHover,
  textDecorationLine,
  fontStyle,
  fileAttachment = false,
  ...props
}: IndiBadgesProps) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return (
        <IndiXStack alignItems="center" justifyContent="center">
          {icon}
        </IndiXStack>
      );
    }

    const iconAny = icon as any;
    if (iconAny?.$$typeof?.toString() === 'Symbol(react.memo)' && iconAny.type) {
      const IconComponent = iconAny.type as React.ComponentType<{ size?: number; color?: string }>;
      try {
        return (
          <IndiXStack alignItems="center" justifyContent="center">
            <IconComponent size={14} color="$iconSecondary" />
          </IndiXStack>
        );
      } catch (error) {
        console.error('Error rendering memoized icon component:', error);
        return null;
      }
    }

    if (typeof icon === 'function') {
      try {
        const result = (icon as any)();
        if (React.isValidElement(result)) {
          return (
            <IndiXStack alignItems="center" justifyContent="center">
              {result}
            </IndiXStack>
          );
        }
        const IconComponent = icon as React.ComponentType<{ size?: number; color?: string }>;
        return (
          <IndiXStack alignItems="center" justifyContent="center">
            <IconComponent size={14} color="$iconSecondary" />
          </IndiXStack>
        );
      } catch (error) {
        console.error('Error rendering icon component:', error);
        return null;
      }
    }

    return null;
  };

  const tagBg = backgroundColor || '$tagBg';
  const tagBorderColor = borderColor || (isReadonly ? '$tagBg' : '$border');

  const tooltipLabel = fileAttachment && typeof text === 'string' ? text : undefined;

  const textProps = fileAttachment
    ? {
        numberOfLines: 1 as const,
        ellipsizeMode: 'tail' as const,
        flexShrink: 1,
        minWidth: 0,
      }
    : {
        numberOfLines: 1 as const,
      };

  const renderFilename = () => {
    const inner = onTextPress ? (
      <IndiParagraph
        color="$tagContent"
        {...textProps}
        onPress={onTextPress}
        onHoverIn={() => onTextHover?.(true)}
        onHoverOut={() => onTextHover?.(false)}
        cursor="pointer"
        textDecorationLine={textDecorationLine}
        fontStyle={fontStyle}
        hoverStyle={{
          textDecorationLine:
            textDecorationLine === 'line-through' ? ('underline line-through' as const) : ('underline' as const),
        }}>
        {text}
      </IndiParagraph>
    ) : (
      <IndiParagraph
        color="$tagContent"
        {...textProps}
        pointerEvents="none"
        textDecorationLine={textDecorationLine}
        fontStyle={fontStyle}>
        {text}
      </IndiParagraph>
    );

    if (tooltipLabel) {
      return <IndiTooltip tooltip={tooltipLabel}>{inner}</IndiTooltip>;
    }
    return inner;
  };

  return (
    <IndiXStack
      backgroundColor={tagBg}
      borderWidth={1}
      h="$7"
      borderColor={tagBorderColor}
      br="$small"
      alignItems="center"
      overflow="hidden"
      {...(fileAttachment
        ? {
            w: '100%' as const,
            minWidth: 0,
            maxWidth: FILE_ATTACHMENT_MAX_WIDTH,
            flexShrink: 1,
            alignSelf: 'flex-start' as const,
          }
        : {})}
      {...props}>
      <IndiXStack
        px="$2"
        alignItems="center"
        ac="center"
        gap="$1.5"
        flex={fileAttachment ? 1 : undefined}
        minWidth={fileAttachment ? 0 : undefined}
        overflow="hidden">
        {icon && onIconPress ? (
          <IndiXStack
            flexShrink={0}
            onPress={onIconPress}
            onHoverIn={() => onIconHover?.(true)}
            onHoverOut={() => onIconHover?.(false)}
            cursor="pointer"
            alignItems="center"
            justifyContent="center">
            {renderIcon()}
          </IndiXStack>
        ) : icon ? (
          <IndiXStack flexShrink={0} alignItems="center" justifyContent="center">
            {renderIcon()}
          </IndiXStack>
        ) : (
          renderIcon()
        )}
        {renderFilename()}
      </IndiXStack>

      {!isReadonly && (
        <IndiXStack
          flexShrink={0}
          onPress={onRemove}
          bg={tagBg}
          blw={1}
          borderColor={tagBorderColor}
          minHeight="100%"
          p="$1"
          center
          hoverStyle={{
            backgroundColor: tagBg === 'transparent' ? '$tagBgHover' : tagBg,
          }}>
          <X size={16} color="$iconSecondary" hoverStyle={{ color: '$iconNeutral' }} />
        </IndiXStack>
      )}
    </IndiXStack>
  );
};
