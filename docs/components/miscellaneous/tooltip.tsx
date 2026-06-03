import { IndiLabel, IndiText, IndiTextProps } from '@/components/text';
import { IndiView, IndiXStack } from '@/components/views/base';
import { CircleHelp } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Popover, isWeb } from 'tamagui';

export interface TooltipProps {
  tooltip?: string;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const MAX_WIDTH = 300;

export const IndiTooltip: React.FC<TooltipProps> = ({
  tooltip,
  children = <CircleHelp color="$iconSecondary" size={14} />,
  placement = 'bottom',
}) => {
  const [open, setOpen] = useState(false);

  // For web, we control open state via hover events
  const webProps = isWeb
    ? {
        open,
        onOpenChange: setOpen,
      }
    : {};

  // Mouse events only needed for web
  const triggerProps = isWeb
    ? {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      }
    : {};

  if (!tooltip) {
    return children;
  }

  return (
    <Popover allowFlip stayInFrame resize {...webProps} placement={placement}>
      <Popover.Trigger asChild>
        <IndiView {...triggerProps}>{children}</IndiView>
      </Popover.Trigger>

      <Popover.Content
        maxWidth={MAX_WIDTH}
        py="$1"
        px="$2"
        borderRadius="$small"
        bg="$tooltipBg"
        enterStyle={{ y: -8, opacity: 0 }}
        exitStyle={{ y: -8, opacity: 0 }}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}>
        <Popover.Arrow size={10} bg="$tooltipBg" />
        <IndiText color="$tooltipColor" maxWidth={MAX_WIDTH - 8}>
          {tooltip}
        </IndiText>
      </Popover.Content>
    </Popover>
  );
};

export const IndiLabelWithTooltip = ({
  text,
  placement = 'bottom',
  ...props
}: {
  text: string;
  placement?: 'bottom' | 'left' | 'right' | 'top';
} & IndiTextProps) => {
  return (
    <IndiXStack gap="$1" alignItems="center" ac="center">
      <IndiXStack gap="$1">
        <IndiLabel {...props}>{text}</IndiLabel>
      </IndiXStack>
      <IndiTooltip tooltip={text} placement={placement} />
    </IndiXStack>
  );
};
