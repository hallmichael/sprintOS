import DateUtils from '@/utils/DateUtils';
import { X } from '@tamagui/lucide-icons';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';
import { isWeb } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiLabelInputProps } from '../inputs';
import { HorizontalInputWrapper, OverlappingInputWrapper, VerticalInputWrapper } from '../inputs/wrapper';
import { IndiTextProps } from '../text';
import { IndiView } from '../views';
import { IndiDatePartsPicker } from './dateParts';
import { IndiDatePickerBody } from './datePickerContent';

// Define or import required types for @rehookify/datepicker
type DPDayInteger = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type DPDatesMode = 'single' | 'multiple' | 'range';

export type IndiDatePickerProps = {
  mode?: 'single' | 'range' | 'date-time';
  // For single mode
  value?: Date;
  // For range mode
  startDate?: Date;
  endDate?: Date;
  onChange?: ((date?: Date) => void) | ((startDate?: Date, endDate?: Date) => void);
  valueProps?: IndiTextProps;
  isClearable?: boolean;
  placement?: 'top' | 'bottom' | 'auto';
} & IndiLabelInputProps;

// Custom hook to determine optimal placement for date picker
const useDatePickerPlacement = (triggerRef: React.RefObject<any>, preferredPlacement: 'top' | 'bottom' | 'auto') => {
  const [placement, setPlacement] = useState<'top' | 'bottom'>(preferredPlacement === 'auto' ? 'bottom' : preferredPlacement);
  const calculatedRef = useRef(false);

  useEffect(() => {
    if (!triggerRef.current || preferredPlacement !== 'auto' || calculatedRef.current) return;

    const determinePlacement = () => {
      if (typeof window === 'undefined') return;

      const triggerElement = triggerRef.current;
      const rect = triggerElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const estimatedPopupHeight = 350; // Approximate height of date picker popup
      const margin = 20; // Margin from viewport edges

      // Check if there's enough space below
      const spaceBelow = viewportHeight - rect.bottom - margin;
      const spaceAbove = rect.top - margin;

      // If there's not enough space below but enough space above, show above
      if (spaceBelow < estimatedPopupHeight && spaceAbove >= estimatedPopupHeight) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
      
      calculatedRef.current = true;
    };

    // Call the function immediately
    determinePlacement();

    // Also set up a listener for window resize to recalculate placement
    const handleResize = () => {
      calculatedRef.current = false;
      determinePlacement();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [preferredPlacement]);

  return placement;
};

export function IndiDatePicker({
  mode = 'single',
  label,
  id,
  value,
  startDate,
  endDate,
  onChange,
  error,
  prompt,
  promptColor = error ? undefined : '$textSecondary',
  type = 'vertical',
  labelProps,
  disabled,
  containerProps,
  valueProps,
  isClearable = false,
  placement = 'auto',
  ...props
}: IndiDatePickerProps) {
  const Wrapper = useMemo(() => {
    if (type === 'vertical') {
      return VerticalInputWrapper;
    } else if (type === 'horizontal') {
      return HorizontalInputWrapper;
    }
    return OverlappingInputWrapper;
  }, [type]);
  const now = new Date();
  const [selectedDates, onDatesChange] = useState<Date[]>([]);
  const [offsetDate, onOffsetChange] = useState<Date>(now);
  const [open, setOpen] = useState(false);
  const isDateTimeMode = mode === 'date-time';

  // Set up global handler for time picker to access
  useEffect(() => {
    if (isDateTimeMode && isWeb) {
      (window as any).__indiDateTimeChangeHandler = (date: Date) => {
        // Update selected dates
        onDatesChange([date]);

        // Notify parent component
        if (onChange) {
          (onChange as (date: Date | null) => void)(date);
        }
      };

      return () => {
        // Clean up when component unmounts
        delete (window as any).__indiDateTimeChangeHandler;
      };
    }
  }, [isDateTimeMode]); // Removed onChange from dependencies

  // Handle value changes for single date mode
  useEffect(() => {
    if ((mode === 'single' || isDateTimeMode) && value && !open) {
      onDatesChange([value]);
    } else if ((mode === 'single' || isDateTimeMode) && !value && !open) {
      // Clear internal state when value is null and picker is closed
      onDatesChange([]);
    }
  }, [value, mode, isDateTimeMode, open]);

  // Handle value changes for range mode
  useEffect(() => {
    if (mode === 'range' && !open) {
      if (startDate && endDate) {
        onDatesChange([startDate, endDate]);
      } else if (startDate) {
        onDatesChange([startDate]);
      } else if (!startDate && !endDate) {
        // Clear internal state when both dates are null
        onDatesChange([]);
      }
    }
  }, [startDate, endDate, mode, open]);

  // When the picker is opened in date-time mode, initialize with current time if no date is selected
  useEffect(() => {
    if (open && isDateTimeMode && selectedDates.length === 0) {
      // Use current date-time as default when opening the picker
      const currentDate = new Date();
      onDatesChange([currentDate]);

      // Notify parent component of the change
      if (onChange) {
        (onChange as (date: Date | null) => void)(currentDate);
      }
    }
  }, [open, isDateTimeMode, selectedDates.length]); // Removed onChange from dependencies


  // Handle changes based on mode
  const handleReset = useCallback((e: GestureResponderEvent) => {
    e.stopPropagation();
    
    // Clear internal state first
    onDatesChange([]);
    
    // Call onChange to notify parent
    if (mode === 'single' || isDateTimeMode) {
      (onChange as (date: Date | null) => void)(null);
    } else {
      (onChange as (startDate: Date | null, endDate: Date | null) => void)(null, null);
    }
    
    // Close the picker
    setOpen(false);
  }, [mode, isDateTimeMode, onChange, onDatesChange]);

  // Handle onChange when selectedDates change
  useEffect(() => {
    if (selectedDates.length > 0 && (mode === 'single' || isDateTimeMode)) {
      (onChange as (date: Date | null) => void)(selectedDates[0]);
    } else if (mode === 'range' && selectedDates.length === 2) {
      (onChange as (startDate: Date | null, endDate: Date | null) => void)(selectedDates[0], selectedDates[1]);
    }
  }, [selectedDates, mode, isDateTimeMode]); // Removed onChange from dependencies

  // Handle time selection from the time picker
  const handleTimeChange = useCallback((date: Date) => {
    // Update selected dates
    onDatesChange([date]);

    // Notify parent component
    if (onChange) {
      (onChange as (date: Date | null) => void)(date);
    }
  }, [onDatesChange]); // Removed onChange from dependencies

  // Configure picker based on mode with proper typing
  const config = useMemo(() => 
    mode === 'single' || isDateTimeMode
      ? {
          selectedDates,
          onDatesChange,
          calendar: {
            startDay: 1 as DPDayInteger,
          },
        }
      : {
          selectedDates,
          onDatesChange,
          offsetDate,
          onOffsetChange,
          dates: {
            mode: 'range' as DPDatesMode,
          },
          calendar: {
            startDay: 1 as DPDayInteger,
            offsets: [-1, 1],
          },
        },
    [mode, isDateTimeMode, selectedDates, onDatesChange, offsetDate, onOffsetChange]
  );

  // Format date for display including time when in date-time mode
  const formatDisplayValue = (date: Date): string => {
    if (!date) return '';

    if (isDateTimeMode) {
      return DateUtils.localDisplayDateTime(date);
    }

    return DateUtils.localDisplayDate(date);
  };

  // Determine display value based on mode
  const displayValue =
    mode === 'single' || isDateTimeMode
      ? selectedDates[0]
        ? formatDisplayValue(selectedDates[0])
        : ''
      : selectedDates[0] && selectedDates[1]
      ? `${DateUtils.localDisplayDate(selectedDates[0])} - ${DateUtils.localDisplayDate(selectedDates[1])}`
      : '';

  // Add refs for date picker triggers
  const datePickerTriggerRef = useRef<any>(null);

  // Get optimal placement for the date picker
  const datePickerPlacement = useDatePickerPlacement(datePickerTriggerRef, placement);

  return (
    <Wrapper {...props}>
      <Wrapper.Label {...labelProps}>{label}</Wrapper.Label>

      <IndiDatePartsPicker open={open} onOpenChange={setOpen} config={config} placement={datePickerPlacement}>
        <IndiView flex={1} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <IndiDatePartsPicker.Trigger asChild>
            <Wrapper.Container
              ref={datePickerTriggerRef}
              focused={open}
              minHeight={'$inputHeight'}
              gap={'$2'}
              {...{ error, disabled }}
              {...containerProps}>
              <Wrapper.Value placeholderText={'Select'} full {...valueProps} numberOfLines={1} ellipsizeMode="tail">
                {displayValue}
              </Wrapper.Value>
              {(isClearable &&
                (mode === 'single' || isDateTimeMode ? (
                  value ? (
                    <IndiButton size="xs" color={'secondary'} type="ghost" icon={X} onPress={handleReset} />
                  ) : (
                    <Wrapper.Icon name="ChevronDown" />
                  )
                ) : startDate || endDate ? (
                  <IndiButton size="xs" color={'secondary'} type="ghost" icon={X} onPress={handleReset} />
                ) : (
                  <Wrapper.Icon name="ChevronDown" />
                ))) ||
                (!isClearable && <Wrapper.Icon name="ChevronDown" />)}
            </Wrapper.Container>
          </IndiDatePartsPicker.Trigger>
          <IndiDatePartsPicker.Content>
            <IndiDatePartsPicker.Content.Arrow />
            <IndiDatePickerBody isTimePicker={isDateTimeMode} config={config} onTimeChange={handleTimeChange} />
          </IndiDatePartsPicker.Content>

          <Wrapper.Error red={!!error} color={promptColor}>
            {error || prompt}
          </Wrapper.Error>
        </IndiView>
      </IndiDatePartsPicker>
    </Wrapper>
  );
}
