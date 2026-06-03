import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardTypeOptions, Platform } from 'react-native';

import { Nullable, Option, PhonePrefixOption } from '@/types';
import { getCountryCodeForRegionCode, getSupportedRegionCodes, parsePhoneNumber } from 'awesome-phonenumber';
import { countries } from 'countries-list';
import _ from 'lodash';

import { formatAustralianPhoneNumber, formatPhoneNumberForStorage } from '@/utils/PhoneUtils';
import { IndiImage } from '../images';
import { IndiSelect } from '../selects/base';
import { IndiText } from '../text';
import { IndiXStack } from '../views';
import { IndiLabelInput, IndiLabelInputProps } from './base';

// Type definitions
export type IndiPhoneInputProps = {
  prefix?: string;
  onPrefixChange?: (prefix: string) => void;
  onFullNumberChange?: (fullNumber: string) => void;
  value?: Nullable<string>;
  defaultRegionCode?: string;
  allowedCountries?: string[]; // List of allowed country codes (e.g. ['AU', 'US'])
} & Omit<IndiLabelInputProps, 'value'>;

// Helper function to get country name from region code
const getCountryName = (regionCode: string): string => {
  // The countries object from countries-list uses lowercase country codes
  const countryKey = regionCode.toUpperCase();
  return countries[countryKey as keyof typeof countries]?.name || regionCode;
};

// Generate region options dynamically
const generateRegionOptions = (allowedCountries?: string[]): PhonePrefixOption[] => {
  let options = _.chain(getSupportedRegionCodes())
    .map(regionCode => {
      const countryCode = getCountryCodeForRegionCode(regionCode);
      const countryName = getCountryName(regionCode);
      return {
        label: `${countryName} (+${countryCode})`,
        value: `+${countryCode}`,
        flag: regionCode,
      };
    })
    .uniqBy(option => option.value)
    .sortBy(option => option.label)
    .value();

  // Filter by allowed countries if specified
  if (allowedCountries && allowedCountries.length > 0) {
    options = options.filter(option => allowedCountries.includes(option.flag));
  }

  return options;
};

// Helper to extract the number portion from a full international number
const extractNumberWithoutPrefix = (fullNumber: string, prefix: string): string => {
  if (!fullNumber) return '';

  // Remove the prefix if it appears at the beginning
  if (fullNumber.startsWith(prefix)) {
    return fullNumber.substring(prefix.length).trim();
  }

  // If it has a different prefix format, try to extract the local number
  if (fullNumber.startsWith('+')) {
    const plusIndex = fullNumber.indexOf(' ');
    if (plusIndex > 0) {
      return fullNumber.substring(plusIndex).trim();
    }
  }

  return fullNumber;
};

/**
 * IndiPhoneInput - A customized phone input component with country code selection
 */
export const IndiPhoneInput = React.forwardRef<any, IndiPhoneInputProps>(
  (
    {
      inputProps,
      containerProps,
      prefix = '+61', // Default to Australia
      onPrefixChange,
      onFullNumberChange,
      value = '',
      defaultRegionCode = 'AU',
      allowedCountries,
      ...props
    },
    ref,
  ) => {
    // State management
    const [localValue, setLocalValue] = useState<string | null>(value);
    const [innerError, setInnerError] = useState<string>();

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Generate region options based on allowed countries
    const REGION_PREFIX_OPTIONS = useMemo(() => generateRegionOptions(allowedCountries), [allowedCountries]);

    // Find selected country option
    const selectedOption = useMemo(
      () =>
        REGION_PREFIX_OPTIONS.find(option => option.value === prefix) ||
        REGION_PREFIX_OPTIONS.find(option => option.flag === defaultRegionCode) ||
        REGION_PREFIX_OPTIONS[0],
      [REGION_PREFIX_OPTIONS, prefix, defaultRegionCode],
    );

    // Format phone value for display
    const formattedPhoneValue = useMemo(() => {
      if (!localValue) return '';

      // Special handling for Australia
      if (selectedOption?.flag === 'AU') {
        // For Australian numbers, use our specialized formatter
        // If the input starts with a 0, it's a complete Aus number
        if (localValue.startsWith('0')) {
          return formatAustralianPhoneNumber(localValue, '');
        }

        // Otherwise try to format with prefix
        if (selectedOption?.value === '+61') {
          // For mobile numbers (starting with 4)
          if (localValue.startsWith('4')) {
            return formatAustralianPhoneNumber('04', localValue.substring(1));
          }
          // For landlines (starting with area code 2,3,7,8)
          else if (/^[2378]/.test(localValue)) {
            return formatAustralianPhoneNumber(`0${localValue.charAt(0)}`, localValue.substring(1));
          }
        }
      }

      // First try to use the built-in formatter from awesome-phonenumber
      const parsedNumber = parsePhoneNumber(localValue, { regionCode: selectedOption?.flag });
      if (parsedNumber.valid) {
        return parsedNumber.number?.national || localValue;
      }

      // Fall back to our custom formatter if the number is not recognized by the library
      return localValue;
    }, [localValue, selectedOption?.flag, selectedOption?.value]);

    // Validation function
    const validatePhoneNumber = useCallback((input: string, countryCode?: string): boolean => {
      if (!input) return true; // Empty is considered valid (unless required is specified elsewhere)

      const parsedNumber = parsePhoneNumber(input, { regionCode: countryCode });
      return parsedNumber.valid;
    }, []);

    // Handle phone number input changes
    const handlePhoneChange = useCallback(
      (input: string) => {
        // For Australian numbers, handle special case
        if (selectedOption?.flag === 'AU') {
          // Check if it's a mobile number (starts with 04)
          if (input.startsWith('04')) {
            // For storage and mutation - remove spaces and leading 0
            const storageNumber = formatPhoneNumberForStorage('', input);

            // For display - keep the original input with proper formatting
            setLocalValue(input);
            inputProps?.onChangeText?.(input);
            onFullNumberChange?.(storageNumber);

            // Validate mobile number
            const isValid = validatePhoneNumber(input, 'AU');
            setInnerError(isValid ? undefined : 'Invalid mobile number');
            return;
          }
          // Landline number (starts with 02, 03, 07, 08)
          else if (/^0[2378]/.test(input)) {
            // Get the area code without the 0 (e.g., 7 from 07)
            const areaCode = input.substring(1, 2);
            // Get the rest of the number (e.g., 12341234)
            const restOfNumber = input.substring(2);

            // For storage - just concatenate the area code and rest of number without the 0
            const storageNumber = `${areaCode}${restOfNumber.replace(/\s+/g, '')}`;

            // For display - keep the original input with proper formatting
            setLocalValue(input);
            inputProps?.onChangeText?.(input);
            onFullNumberChange?.(storageNumber);

            // Validate landline number
            const isValid = validatePhoneNumber(input, 'AU');
            setInnerError(isValid ? undefined : 'Invalid landline number');
            return;
          }
        }

        // Default handling for non-Australian numbers or numbers in other formats
        // Clean input from potential prefixes
        let cleanedInput = extractNumberWithoutPrefix(input, prefix);

        // Update local state
        setLocalValue(cleanedInput);

        // For storage and mutation - remove any spaces
        const storageNumber = formatPhoneNumberForStorage('', cleanedInput);

        // Call parent handlers
        inputProps?.onChangeText?.(cleanedInput);
        onFullNumberChange?.(storageNumber);

        // Validate number
        if (cleanedInput) {
          const isValid = validatePhoneNumber(cleanedInput, selectedOption?.flag);
          setInnerError(isValid ? undefined : 'Invalid phone number');
        } else {
          setInnerError(undefined);
        }
      },
      [prefix, selectedOption?.flag, inputProps, onFullNumberChange, validatePhoneNumber],
    );

    // Handle country code changes
    const handlePrefixChange = useCallback(
      (option?: Nullable<Option>) => {
        if (option) {
          const newPrefix = option.value as string;
          const prefixOption = option as PhonePrefixOption;

          // Call parent handler
          onPrefixChange?.(newPrefix);

          // Re-validate with new prefix
          if (localValue) {
            const isValid = validatePhoneNumber(localValue, prefixOption.flag);
            setInnerError(isValid ? undefined : 'Invalid phone number');
          }
        }
      },
      [localValue, onPrefixChange, validatePhoneNumber],
    );

    // Render country option with flag
    const renderPhoneOption = (hideImage?: boolean) => (option?: Option) => {
      if (!option) return null;

      const prefixOption = option as PhonePrefixOption;

      return (
        <IndiXStack ai="center" gap="$2">
          {!hideImage && (
            <IndiImage
              width={24}
              height={18}
              src={`https://flagsapi.com/${prefixOption.flag}/flat/64.png`}
              alt={prefixOption.flag}
            />
          )}
          <IndiText>{option.label}</IndiText>
        </IndiXStack>
      );
    };

    // Determine keyboard type based on platform
    const keyboardType: KeyboardTypeOptions = Platform.OS === 'web' ? 'default' : 'phone-pad';

    // Country code selector component
    const PrefixSelector = useMemo(() => {
      return (
        <IndiXStack ai="center" overflow="visible" borderRight h="100%">
          <IndiSelect
            disabled={props.disabled}
            data={REGION_PREFIX_OPTIONS}
            triggerWidth={345}
            containerProps={{
              bg: '$buttonSolidSecondaryBg',
              bw: 0,
              hoverStyle: { borderWidth: 0, bg: '$buttonSolidSecondaryBgHover' },
              gap: '$1',
            }}
            inputProps={{
              minWidth: 345,
            }}
            value={prefix}
            selectedOption={selectedOption ? { label: selectedOption.value, value: selectedOption.value } : undefined}
            onOptionChange={handlePrefixChange}
            renderItem={renderPhoneOption(false)}
            renderSelectedItem={renderPhoneOption(true)}
            disableFocus
          />
        </IndiXStack>
      );
    }, [REGION_PREFIX_OPTIONS, prefix, handlePrefixChange, selectedOption, props.disabled]);

    // Combine errors
    const combinedError = innerError || props.error;

    return (
      <IndiLabelInput
        ref={ref}
        {...props}
        containerProps={{
          pl: 0,
          overflow: 'hidden',
          height: 'auto',
          ...containerProps,
        }}
        renderLeft={PrefixSelector}
        error={combinedError}
        inputProps={{
          keyboardType,
          returnKeyType: 'done',
          placeholder: 'Phone number',
          spellCheck: false,
          autoCorrect: false,
          autoCapitalize: 'none',
          ...inputProps,
          onChangeText: handlePhoneChange,
          value: formattedPhoneValue,
        }}
      />
    );
  },
);

// Add display name for React DevTools
IndiPhoneInput.displayName = 'IndiPhoneInput';
