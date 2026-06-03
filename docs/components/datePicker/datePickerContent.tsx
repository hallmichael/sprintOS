import { IndiButton } from '@/components/buttons';
import { IndiView, IndiYStack } from '@/components/views';
import type { DPDay, DatePickerProviderProps } from '@rehookify/datepicker';
import { DatePickerProvider, useDatePickerContext } from '@rehookify/datepicker';
import { ChevronDown, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, Button, ScrollView, View, isWeb } from 'tamagui';
import { useDateAnimation } from '../bento/elements/datepickers/common/useDateAnimation';
import { IndiParagraph } from '../text';
import {
  HeaderTypeProvider,
  IndiSizableText,
  IndiYearPicker,
  IndiYearRangeSlider,
  MonthPicker,
  swapOnClick,
  useHeaderType,
} from './dateParts';

function IndiCalendarHeader() {
  const {
    data: { calendars },
    propGetters: { subtractOffset },
  } = useDatePickerContext();
  const { type: header, setHeader } = useHeaderType();
  const { year, month } = calendars[0];

  if (header === 'year') {
    return <IndiYearRangeSlider />;
  }

  if (header === 'month') {
    return (
      <IndiParagraph width="100%" ta="center" userSelect="auto" tabIndex={0} size="lg">
        Select a month
      </IndiParagraph>
    );
  }
  return (
    <IndiView flexDirection="row" width="100%" height={50} alignItems="center" justifyContent="space-between">
      <IndiButton
        type="ghost"
        color="secondary"
        size="sm"
        icon={ChevronLeft}
        {...swapOnClick(subtractOffset({ months: 1 }))}
      />
      <IndiView flexDirection="row" alignItems="center">
        <IndiButton
          type="ghost"
          color="secondary"
          size="sm"
          iconAfter={ChevronDown}
          text={month}
          textProps={{
            color: '$buttonGhostSecondaryContentHover',
          }}
          onPress={() => setHeader('month')}
        />
        <IndiButton
          type="ghost"
          color="secondary"
          size="sm"
          iconAfter={ChevronDown}
          text={year}
          textProps={{
            color: '$buttonGhostSecondaryContentHover',
          }}
          onPress={() => setHeader('year')}
        />
      </IndiView>
      <IndiButton
        type="ghost"
        color="secondary"
        size="sm"
        icon={ChevronRight}
        {...swapOnClick(subtractOffset({ months: -1 }))}
      />
    </IndiView>
  );
}

function IndiDayPicker({
  isTimePicker = false,
  onTimeChange,
}: {
  isTimePicker?: boolean;
  onTimeChange?: (date: Date) => void;
}) {
  const {
    data: { calendars, weekDays, selectedDates },
    propGetters: { dayButton },
  } = useDatePickerContext();

  const { days } = calendars[0];

  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const { prevNextAnimation, prevNextAnimationKey } = useDateAnimation({
    listenTo: 'month',
  });

  // Check if a day is between the selected date range or if it's the first/last date
  const getRangeInfo = useMemo(() => {
    // Only process if we have exactly 2 selected dates (a range)
    if (selectedDates.length !== 2) {
      return (day: DPDay) => ({ isInRange: false, isRangeStart: false, isRangeEnd: false });
    }

    const [startDate, endDate] =
      selectedDates[0] < selectedDates[1] ? [selectedDates[0], selectedDates[1]] : [selectedDates[1], selectedDates[0]];

    return (day: DPDay) => {
      const date = day.$date;
      const isRangeStart = date.getDate() == startDate.getDate();
      const isRangeEnd = date.getDate() == endDate.getDate();
      const isInRange = date > startDate && date < endDate && day.inCurrentMonth;

      return { isInRange, isRangeStart, isRangeEnd };
    };
  }, [selectedDates]);

  // divide days array into sub arrays that each has 7 days, for better stylings
  const subDays = useMemo(
    () =>
      days.reduce((acc, day, i) => {
        if (i % 7 === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(day);
        return acc;
      }, [] as DPDay[][]),
    [days],
  );

  // Modified approach: we'll keep all 7 days in each week but replace non-current month days with null
  // This preserves the grid structure while showing only current month days
  const filteredSubDays = useMemo(() => {
    // Keep all weeks but replace days outside current month with null placeholders
    return subDays.map(week => week.map(day => (day.inCurrentMonth ? day : null)));
  }, [subDays]);

  return (
    <AnimatePresence key={prevNextAnimationKey}>
      <IndiView animation="medium" {...prevNextAnimation()}>
        <IndiView
          flexDirection={isTimePicker ? 'row' : 'column'}
          gap="$1"
          justifyContent="center"
          alignItems="flex-start">
          <IndiView paddingTop="$2">
            <IndiView flexDirection="row" justifyContent="space-between">
              {weekDays.map(day => (
                <IndiSizableText key={day} ta="center" width={38} size="$3">
                  {day}
                </IndiSizableText>
              ))}
            </IndiView>
            <IndiView flexDirection="column" gap={'$1'} flexWrap="wrap">
              {filteredSubDays.map((days, weekIndex) => {
                // Skip rendering empty weeks where all days are null
                if (days.every(day => day === null)) return null;

                return (
                  <IndiView flexDirection="row" key={`week-${weekIndex}`} justifyContent="space-between">
                    {days.map((d, dayIndex) => {
                      // Render empty space for null days (outside current month)
                      if (d === null) {
                        return <View key={`empty-${weekIndex}-${dayIndex}`} width={38} height={38} mx={3} />;
                      }

                      const { isInRange, isRangeStart, isRangeEnd } = getRangeInfo(d);

                      // Calculate border radius based on position in range
                      const getBorderRadius = () => {
                        if (!selectedDates || selectedDates.length !== 2) return { borderRadius: '$default' };
                        if (isRangeStart)
                          return {
                            borderTopLeftRadius: '$default',
                            borderBottomLeftRadius: '$default',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }; // round on left side only
                        if (isRangeEnd)
                          return {
                            borderTopRightRadius: '$default',
                            borderBottomRightRadius: '$default',
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }; // round on right side only
                        if (isInRange) return { borderRadius: 0 }; // no rounding for in-between days
                        return { borderRadius: '$default' }; // default rounding
                      };

                      return (
                        <Button
                          key={d.$date.toString()}
                          chromeless
                          circular
                          padding={0}
                          width={38}
                          height={38}
                          {...swapOnClick(dayButton(d))}
                          onHoverIn={() => setHoveredDay(d.$date.toString())}
                          onHoverOut={() => setHoveredDay(null)}
                          hoverStyle={{
                            backgroundColor: !d.selected ? '$buttonGhostSecondaryBgHover' : 'buttonSolidPrimaryBg',
                          }}
                          backgroundColor={
                            d.selected
                              ? '$buttonSolidPrimaryBg'
                              : isInRange
                              ? '$buttonGhostSecondaryBgHover'
                              : 'transparent'
                          }
                          color={
                            hoveredDay === d.$date.toString() && !d.selected
                              ? '$buttonGhostSecondaryContentHover'
                              : d.selected
                              ? '$buttonSolidPrimaryContent'
                              : isInRange
                              ? '$buttonGhostSecondaryContentHover'
                              : d.now
                              ? '$textPrimary'
                              : '$buttonOutlineSecondaryContent'
                          }
                          pressStyle={{
                            borderWidth: 0,
                            backgroundColor: d.selected ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
                          }}
                          {...getBorderRadius()}>
                          {d.day}
                        </Button>
                      );
                    })}
                  </IndiView>
                );
              })}
            </IndiView>
          </IndiView>

          {isTimePicker && <IndiTimePicker onTimeChange={onTimeChange} />}
        </IndiView>
      </IndiView>
    </AnimatePresence>
  );
}

function IndiTimePicker({ onTimeChange }: { onTimeChange?: (date: Date) => void }) {
  const {
    data: { selectedDates },
    propGetters: { dayButton },
  } = useDatePickerContext();

  // Add scroll view reference with proper typing for native ScrollView
  const scrollViewRef = useRef<any>(null);
  // Get a reference to the web container for scrolling
  const webScrollRef = useRef<HTMLElement>(null);

  const [selectedTime, setSelectedTime] = useState(() => {
    if (!selectedDates[0]) return '12:00';
    const hours = selectedDates[0].getHours();
    const minutes = selectedDates[0].getMinutes();
    // Round to nearest 15 min
    const roundedMinutes = Math.round(minutes / 15) * 15;
    return `${hours.toString().padStart(2, '0')}:${(roundedMinutes % 60).toString().padStart(2, '0')}`;
  });

  // Generate time options: 24 hours with 15 min intervals, starting from 00:00
  const timeOptions: string[] = useMemo(() => {
    const options: string[] = [];

    // Start with 00:00 to 11:45
    for (let hour = 0; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }

    // Then 12:00 to 23:45
    for (let hour = 12; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        options.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }

    return options;
  }, []);

  // Update time when a new time is selected
  const updateTime = (timeString: string) => {
    setSelectedTime(timeString);

    if (selectedDates[0]) {
      const [hourStr, minuteStr] = timeString.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      // Create a new date with the selected time
      const newDate = new Date(selectedDates[0]);
      newDate.setHours(hour);
      newDate.setMinutes(minute);

      // Use window.__indiDateTimeChangeHandler if available
      // (this will be set by the parent component)
      if (isWeb && (window as any).__indiDateTimeChangeHandler) {
        (window as any).__indiDateTimeChangeHandler(newDate);
      }

      if (onTimeChange) {
        onTimeChange(newDate);
      }
    }
  };

  // Find the selected time index
  const selectedTimeIndex = useMemo(() => {
    return timeOptions.findIndex(time => time === selectedTime);
  }, [selectedTime, timeOptions]);

  // Index of 12:00 for default positioning
  const noonIndex = useMemo(() => {
    return timeOptions.findIndex(time => time === '12:00');
  }, [timeOptions]);

  // Auto-scroll to the selected time when the component mounts or when the selected time changes
  useEffect(() => {
    // Delay the scroll operation slightly to ensure the component is fully rendered
    const scrollTimeout = setTimeout(() => {
      if (selectedTimeIndex >= 0) {
        // Calculate the scroll position: each time option is ~30px high
        const scrollPosition = selectedTimeIndex * 30;

        if (isWeb && webScrollRef.current) {
          // In web, we use the webScrollRef
          webScrollRef.current.scrollTop = scrollPosition;
        } else if (!isWeb && scrollViewRef.current?.scrollTo) {
          // In native, we use the scrollViewRef with scrollTo
          scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
        }
      }
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [selectedTimeIndex, isWeb]);

  // When selected dates change (date is selected), update the selected time
  useEffect(() => {
    if (selectedDates[0]) {
      const hours = selectedDates[0].getHours();
      const minutes = selectedDates[0].getMinutes();
      // Round to nearest 15 min
      const roundedMinutes = Math.round(minutes / 15) * 15;
      const newTimeString = `${hours.toString().padStart(2, '0')}:${(roundedMinutes % 60).toString().padStart(2, '0')}`;

      // Only update if the new time is different from the current selection
      if (newTimeString !== selectedTime) {
        setSelectedTime(newTimeString);
      }
    }
  }, [selectedDates, selectedTime]);

  // Render time options with equal width for all time labels
  const renderTimeOptions = () => {
    return timeOptions.map(time => (
      <Button
        key={`time-${time}`}
        height={30}
        size="$2"
        chromeless
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        marginVertical="$0.5"
        hoverStyle={{
          backgroundColor: selectedTime === time ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
        }}
        pressStyle={{
          borderWidth: 1,
          borderColor: selectedTime === time ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
          backgroundColor: selectedTime === time ? '$buttonSolidPrimaryBg' : '$buttonGhostSecondaryBgHover',
        }}
        backgroundColor={selectedTime === time ? '$buttonSolidPrimaryBg' : 'transparent'}
        borderRadius="$4"
        onPress={() => updateTime(time)}>
        <Button.Text
          textAlign="center"
          width="100%"
          fontWeight="$5"
          fontSize="$3"
          color={selectedTime === time ? 'white' : '$gray11'}>
          {time}
        </Button.Text>
      </Button>
    ));
  };

  return (
    <IndiView
      borderLeftWidth={1}
      borderLeftColor="$border"
      paddingLeft="$1"
      paddingTop="$2"
      width={80}
      $platform-web={{
        width: 80,
        paddingLeft: '$3',
      }}
      $platform-native={{
        width: 70,
        marginLeft: '$2',
      }}>
      <IndiSizableText
        $platform-native={{ paddingLeft: '$4' }}
        $platform-web={{ paddingLeft: '$3' }}
        ac="center"
        width="100%"
        size="$4"
        mb="$1">
        Time
      </IndiSizableText>

      {isWeb ? (
        // Web version with simplified styling
        <IndiYStack
          ref={webScrollRef}
          height={280}
          overflow="scroll"
          borderRadius="$4"
          position="relative"
          style={{
            overflowX: 'hidden',
            overflowY: 'scroll',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(150,150,150,0.5) transparent',
          }}>
          {renderTimeOptions()}
        </IndiYStack>
      ) : (
        // Native version with ScrollView for proper native scrolling
        <ScrollView
          ref={scrollViewRef}
          height={280}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
          alwaysBounceVertical={true}
          style={{
            flexGrow: 0,
            borderRadius: 8,
          }}
          contentContainerStyle={{
            paddingVertical: 4,
            paddingHorizontal: 2,
          }}
          scrollEventThrottle={16}>
          {renderTimeOptions()}
        </ScrollView>
      )}
    </IndiView>
  );
}

export function IndiDatePickerBody({
  isTimePicker = false,
  config,
  onTimeChange,
}: {
  isTimePicker?: boolean;
  config: DatePickerProviderProps['config'];
  onTimeChange?: (date: Date) => void;
}) {
  const [header, setHeader] = useState<'day' | 'month' | 'year'>('day');

  return (
    <HeaderTypeProvider type={header} setHeader={setHeader}>
      <View flexDirection="column" alignItems="center" gap="$2.5" maxWidth={isTimePicker ? 415 : 325}>
        <DatePickerProvider config={config}>
          <IndiCalendarHeader />
          {header === 'month' && <MonthPicker onChange={() => setHeader('day')} />}
          {header === 'year' && <IndiYearPicker onChange={() => setHeader('day')} />}
          {header === 'day' && <IndiDayPicker isTimePicker={isTimePicker} onTimeChange={onTimeChange} />}
        </DatePickerProvider>
      </View>
    </HeaderTypeProvider>
  );
}
