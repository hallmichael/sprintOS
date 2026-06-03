import type { DatePickerProviderProps } from '@rehookify/datepicker';
import { DatePickerProvider as _DatePickerProvider, useDatePickerContext } from '@rehookify/datepicker';
import { getFontSized } from '@tamagui/get-font-sized';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import type { PopoverProps } from 'tamagui';
import {
  AnimatePresence,
  Button,
  Popover,
  Text,
  View,
  createStyledContext,
  isWeb,
  styled,
  withStaticProperties,
} from 'tamagui';

import { useDateAnimation } from '@/components/bento/elements/datepickers/common/useDateAnimation';
import { useEffect, useRef, useState } from 'react';
import { IndiButton } from '../buttons';

/** rehookify internally return `onClick` and that's incompatible with native */
export function swapOnClick<D>(d: D) {
  //@ts-ignore
  d.onPress = d.onClick;
  return d;
}

const DatePickerProvider = _DatePickerProvider as React.ComponentType<DatePickerProviderProps>;

type DatePickerProps = PopoverProps & {
  config: DatePickerProviderProps['config'];
};

export const { Provider: HeaderTypeProvider, useStyledContext: useHeaderType } = createStyledContext({
  type: 'day',
  setHeader: (_: 'day' | 'month' | 'year') => {},
});

const DatePickerImpl = (props: DatePickerProps) => {
  const { children, config, ...rest } = props;
  const popoverRef = useRef<Popover>(null);

  // hide date picker on scroll (web)
  useEffect(() => {
    if (isWeb) {
      const controller = new AbortController();

      document.body.addEventListener(
        'scroll',
        () => {
          popoverRef.current?.close();
        },
        {
          signal: controller.signal,
        },
      );

      return () => {
        controller.abort();
      };
    }
  }, []);

  return (
    <DatePickerProvider config={config}>
      <Popover ref={popoverRef} size="$5" keepChildrenMounted={isWeb} stayInFrame {...rest}>
        {children}
      </Popover>
    </DatePickerProvider>
  );
};

const Trigger = Popover.Trigger;

const DatePickerContent = styled(Popover.Content, {
  animation: [
    '100ms',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
  zIndex: 200000001,
  variants: {
    unstyled: {
      false: {
        padding: 12,
        borderWidth: 1,
        borderColor: '$borderColor',
        enterStyle: { y: -10, opacity: 0 },
        exitStyle: { y: -10, opacity: 0 },
        elevate: true,
        backgroundColor: '$dropdownBgDefault',
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
});

export const IndiDatePartsPicker = withStaticProperties(DatePickerImpl, {
  Trigger,
  Content: withStaticProperties(DatePickerContent, {
    Arrow: styled(Popover.Arrow, {
      borderWidth: 1,
      borderColor: '$borderColor',
      backgroundColor: '$dropdownBgDefault',
      display: isWeb ? 'flex' : 'none', // Hide arrow on mobile platforms
    }),
  }),
});

export function MonthPicker({
  onChange = (_e, _date) => {
    'noop';
  },
}: {
  onChange?: (e: MouseEvent, date: Date) => void;
}) {
  const {
    data: { months },
    propGetters: { monthButton },
  } = useDatePickerContext();

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'year',
  });
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        flexDirection="row"
        flexWrap="wrap"
        gap="$2"
        animation="100ms"
        flexGrow={0}
        $platform-native={{
          justifyContent: 'space-between',
          width: '100%',
        }}>
        {months.map(month => (
          <Button
            borderRadius="$true"
            flexBasis="30%"
            backgroundColor={month.active ? '$buttonSolidPrimaryBg' : 'transparent'}
            onHoverIn={() => setHoveredMonth(month.$date.toString())}
            onHoverOut={() => setHoveredMonth(null)}
            hoverStyle={{
              backgroundColor: month.active ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
            }}
            pressStyle={{
              borderWidth: 0,
              backgroundColor: month.active ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
            }}
            key={month.$date.toString()}
            chromeless
            padding={0}
            {...swapOnClick(
              monthButton(month, {
                onClick: onChange as any,
              }),
            )}>
            <Button.Text
              color={
                hoveredMonth === month.$date.toString() && !month.active
                  ? '$buttonGhostSecondaryContentHover'
                  : month.active
                  ? '$buttonSolidPrimaryContent'
                  : '$buttonOutlineSecondaryContent'
              }>
              {month.month}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  );
}

export function IndiYearPicker({ onChange = () => {} }: { onChange?: (e: MouseEvent, date: Date) => void }) {
  const {
    data: { years, calendars },
    propGetters: { yearButton },
  } = useDatePickerContext();
  const selectedYear = calendars[0].year;

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'years',
  });
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <View
        {...prevNextAnimation()}
        animation={'quick'}
        flexDirection="row"
        flexWrap="wrap"
        gap="$2"
        width={'100%'}
        maxWidth={280}
        justifyContent="space-between">
        {years.map(year => (
          <Button
            borderRadius="$true"
            flexBasis="30%"
            flexGrow={1}
            backgroundColor={year.year === Number(selectedYear) ? '$buttonSolidPrimaryBg' : 'transparent'}
            key={year.$date.toString()}
            chromeless
            padding={0}
            {...swapOnClick(
              yearButton(year, {
                onClick: onChange as any,
              }),
            )}
            hoverStyle={{
              backgroundColor:
                year.year === Number(selectedYear) ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
            }}
            pressStyle={{
              borderWidth: 0,
              backgroundColor:
                year.year === Number(selectedYear) ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
            }}
            onHoverIn={() => setHoveredYear(year.$date.toString())}
            onHoverOut={() => setHoveredYear(null)}>
            <Button.Text
              color={
                hoveredYear === year.$date.toString() && year.year !== Number(selectedYear)
                  ? '$buttonGhostSecondaryContentHover'
                  : year.year === Number(selectedYear)
                  ? '$buttonSolidPrimaryContent'
                  : '$buttonOutlineSecondaryContent'
              }>
              {year.year}
            </Button.Text>
          </Button>
        ))}
      </View>
    </AnimatePresence>
  );
}
export function IndiYearRangeSlider() {
  const {
    data: { years },
    propGetters: { previousYearsButton, nextYearsButton },
  } = useDatePickerContext();

  return (
    <View flexDirection="row" width="100%" alignItems="center" justifyContent="space-between">
      <IndiButton type="ghost" color="secondary" size="sm" icon={ChevronLeft} {...swapOnClick(previousYearsButton())} />
      <View y={2} flexDirection="column" alignItems="center">
        <IndiSizableText size="$5">{`${years[0].year} - ${years[years.length - 1].year}`}</IndiSizableText>
      </View>
      <IndiButton type="ghost" color="secondary" size="sm" icon={ChevronRight} {...swapOnClick(nextYearsButton())} />
    </View>
  );
}

export function IndiYearSlider() {
  const {
    data: { calendars },
    propGetters: { subtractOffset },
  } = useDatePickerContext();
  const { setHeader } = useHeaderType();
  const { year } = calendars[0];
  return (
    <View flexDirection="row" width="100%" height={50} alignItems="center" justifyContent="space-between">
      <Button circular size="$3" {...swapOnClick(subtractOffset({ months: 12 }))}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronLeft />
        </Button.Icon>
      </Button>
      <IndiSizableText
        onPress={() => setHeader('year')}
        userSelect="text"
        tabIndex={0}
        size="$6"
        cursor="pointer"
        color="$color11"
        hoverStyle={{
          color: '$color12',
        }}>
        {year}
      </IndiSizableText>
      <Button circular size="$3" {...swapOnClick(subtractOffset({ months: -12 }))}>
        <Button.Icon scaleIcon={1.5}>
          <ChevronRight />
        </Button.Icon>
      </Button>
    </View>
  );
}

export const IndiSizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: 14,
  },
});
