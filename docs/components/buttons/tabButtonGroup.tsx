import { useState } from 'react';
import { Button, ButtonProps } from 'tamagui';
import { IndiText } from '../text';
import { IndiViewProps, IndiXStack } from '../views';

type IndiTabButtonGroupProps = {
  items: string[];
  activeTab?: number;
  setActiveTab?: (value: number) => void;
  fullWidth?: boolean;
  props?: IndiViewProps;
  buttonBgColors?: string[];
  buttonProps?: ButtonProps[];
  disabled?: boolean;
};

export const IndiTabButtonGroup = ({
  items,
  activeTab,
  setActiveTab,
  fullWidth,
  props,
  buttonBgColors,
  buttonProps,
  disabled,
}: IndiTabButtonGroupProps) => {
  return (
    <IndiXStack {...props} cursor={disabled ? 'not-allowed' : 'pointer'}>
      {items.map((item, index) => {
        const [isHovering, setIsHovering] = useState(false);
        let _buttonProps: ButtonProps = { br: '$0' };
        if (index === 0) _buttonProps = { bbrr: '$0', btrr: '$0' };
        if (index === items.length - 1) _buttonProps = { bblr: '$0', btlr: '$0' };
        _buttonProps = { ..._buttonProps, ...buttonProps?.[index] };
        return (
          <IndiXStack key={index} f={fullWidth ? 1 : undefined}>
            <Button
              f={fullWidth ? 1 : undefined}
              onPress={() => !disabled && setActiveTab?.(index)}
              bg={activeTab === index ? buttonBgColors?.[index] ?? '$buttonSolidPrimaryBg' : '$buttonOutlinePrimaryBg'}
              blw={index <= items.length - 1 && index > 1 ? 0 : 1}
              brw={index == 0 ? 0 : 1}
              btw={1}
              bbw={1}
              bc="$border"
              br="$3"
              onHoverIn={() => setIsHovering(true)}
              onHoverOut={() => setIsHovering(false)}
              hoverStyle={{
                backgroundColor:
                  activeTab === index
                    ? buttonBgColors?.[index] ?? '$buttonSolidPrimaryBg'
                    : '$buttonOutlineSecondaryBgHover',
              }}
              {..._buttonProps}
              disabled={disabled}>
              <IndiText
                color={
                  activeTab === index
                    ? '$buttonSolidPrimaryContent'
                    : disabled
                    ? '$textDisabled'
                    : '$buttonOutlineSecondaryContent'
                }
                {...(isHovering && activeTab !== index && { color: '$buttonOutlineSecondaryContent' })}>
                {item}
              </IndiText>
            </Button>
          </IndiXStack>
        );
      })}
    </IndiXStack>
  );
};
