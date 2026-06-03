import { IndiText } from '@/components/text';
import { useLocationDetails } from '@/graphql';
import { useFetchGooglePlaces } from '@/hooks';
import { useStateOptions } from '@/redux/app/selectors';
import { Option } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, View, useWindowDimensions } from 'react-native';
import { useKeyboardState } from 'react-native-keyboard-controller';
import { Popover, ScrollView, Spinner, isWeb } from 'tamagui';
import * as yup from 'yup';
import { IndiButton } from '../buttons';
import { IndiInputLabelProps } from '../inputs';
import { IndiLabelInput } from '../inputs/base';
import { IndiSearchInput } from '../inputs/search';
import { IndiSelect } from '../selects/base';
import { IndiView, IndiViewProps, IndiXStack } from '../views';

// Address validation schema
export const addressSchema = yup.object().shape({
  addressLine1: yup.string().required('Address Line 1 is required'),
  addressLine2: yup.string().optional(),
  unit: yup.string().optional(),
  suburb: yup.string().required('Suburb is required'),
  state: yup.string().required('State is required'),
  postcode: yup.string().required('Postcode is required'),
});

// Type for the validated address data
export type AddressFormData = yup.InferType<typeof addressSchema>;

interface AddressData {
  address: string;
  addressLine1: string;
  addressLine2: string;
  unit?: string;
  suburb: string;
  state: string;
  postcode: string;
  country?: string;
  state_id?: string;
}

// Define types for location details and search functionality that were previously provided by hooks
export interface LocationDetailsResponse {
  success: boolean;
  data?: {
    formatted_address?: string | null;
    address_components?: Array<{
      long_name?: string | null;
      short_name?: string | null;
      types?: (string | null)[] | null;
    }> | null;
  };
}

// Default field labels
export const DEFAULT_FIELD_LABELS = {
  addressLine1: 'Address line 1',
  addressLine2: 'Address line 2 (optional)',
  unit: 'Unit, suite, etc. (optional)',
  suburb: 'Suburb',
  state: 'State',
  postcode: 'Postcode',
};

type AddressFieldsProps = {
  onChange?: (address: AddressData) => void;
  initialAddress?: AddressData;
  onValidationError?: (errors: Record<string, string>) => void;
  formErrors?: Record<string, string>;
  fieldsName?: Partial<typeof DEFAULT_FIELD_LABELS>;
  showUnit?: boolean;
  labelProps?: IndiInputLabelProps;
  // Props for functionality previously provided by hooks
} & IndiViewProps;

export const IndiAddressForm = ({
  initialAddress,
  onValidationError,
  onChange,
  formErrors,
  fieldsName = {},
  showUnit = true,
  labelProps,
  ...props
}: AddressFieldsProps) => {
  const defaultAddress = {
    address: '',
    addressLine1: '',
    addressLine2: '',
    unit: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    state_id: '',
  };

  // Merge default field labels with custom ones
  const fieldLabels = { ...DEFAULT_FIELD_LABELS, ...fieldsName };

  const [address, setAddress] = useState<AddressData>(defaultAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Fetch states data
  const stateOptions = useStateOptions().map(state => ({ ...state, value: state.code }));

  const { data: suggestions, loading: searchLoading, handleSearch: onSearch, variables } = useFetchGooglePlaces();
  const { loading: locationLoading, fetchLocationDetails } = useLocationDetails('');

  // Handle switching between manual entry and suggestions
  const handleToggleManualEntry = (manualMode: boolean) => {
    setIsManualEntry(manualMode);
    // Clear suggestions modal when switching to manual mode
    if (manualMode) {
      setIsAddressModalOpen(false);
      setSelectedPlaceId(null);
    }
  };

  // Initialize with initial address if provided
  useEffect(() => {
    if (initialAddress) {
      const newAddress = { ...initialAddress };

      if (initialAddress.state || initialAddress.state_id) {
        newAddress.state_id =
          stateOptions.find(state => state.value === initialAddress.state || state.id === initialAddress.state_id)
            ?.id || '';

        // Correct state based on state_id
        if (newAddress.state_id) {
          newAddress.state = stateOptions.find(state => state.id === newAddress.state_id)?.value || newAddress.state;
        }
      }

      setAddress(newAddress);
    }
  }, [initialAddress]);

  // Open address suggestion modal when loading
  useEffect(() => {
    if (searchLoading && variables?.query?.trim()) {
      setIsAddressModalOpen(true);
    }
  }, [searchLoading, variables?.query]);

  // Validate address data
  const validateAddress = async (addressData: AddressData) => {
    try {
      await addressSchema.validate(addressData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        validationError.inner.forEach(error => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
        onValidationError?.(newErrors);
      }
      return false;
    }
  };

  useEffect(() => {
    if (formErrors) {
      setErrors(formErrors);
    }
  }, [formErrors]);

  // Handle address selection from Google Places API
  const handleAddressSelect = useCallback(
    async (placeId: string) => {
      if (!placeId) {
        return handleAddressInputSelect();
      }

      setSelectedPlaceId(placeId);

      try {
        const response = await fetchLocationDetails({ placeId });
        if (!response.success || !response.data?.address_components) return;

        const addressComponents = response.data.address_components;
        let streetNumber = '';
        let route = '';
        let newAddress = { ...defaultAddress };

        addressComponents.forEach(component => {
          const types = component.types;
          if (!types) return;

          if (types.includes('subpremise')) {
            newAddress.addressLine2 =
              String(component.long_name || '')
                .charAt(0)
                .toUpperCase() + String(component.long_name || '').slice(1);
          }

          if (types.includes('street_number')) {
            streetNumber = component.long_name || '';
          }
          if (types.includes('route')) {
            route = component.long_name || '';
          }
          if (types.includes('locality') || types.includes('suburb')) {
            newAddress.suburb = component.long_name || '';
          }
          if (types.includes('administrative_area_level_1')) {
            newAddress.state = component.short_name || '';
          }
          if (types.includes('postal_code')) {
            newAddress.postcode = component.long_name || '';
          }
          if (types.includes('country')) {
            newAddress.country = component.long_name || '';
          }
        });

        // Only save the street address in addressLine1, not the full address
        newAddress.addressLine1 = `${streetNumber} ${route}`.trim();
        newAddress.address =
          `${newAddress.addressLine2 ? newAddress.addressLine2 + '/' : ''}${streetNumber} ${route},`.trim() +
          ' ' +
          newAddress.suburb +
          ' ' +
          newAddress.state +
          ' ' +
          newAddress.postcode;
        if (newAddress.state) {
          newAddress.state_id = stateOptions.find(state => state.value === newAddress.state)?.id || '';
        }
        setAddress(newAddress);
        const isValid = await validateAddress(newAddress);
        if (isValid) {
          onChange?.(newAddress);
        }

        setSelectedPlaceId(null);
        setIsAddressModalOpen(false);
      } catch (error) {
        console.error('Error fetching location details:', error);
        setSelectedPlaceId(null);
      }
    },
    [defaultAddress, fetchLocationDetails, onChange],
  );

  // Handle manual address input
  const handleAddressInputSelect = async () => {
    let newAddress = { ...defaultAddress };
    newAddress.addressLine1 = address.addressLine1;
    setAddress(newAddress);
    const isValid = await validateAddress(newAddress);
    onChange?.(newAddress);
    setIsAddressModalOpen(false);
  };

  // Handle input changes for all fields
  const handleInputChange = (field: keyof AddressData) => async (value: string) => {
    let processedValue = value;

    // Capitalize first letter of address line 2
    if (field === 'addressLine2' && value) {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    const newAddress = { ...address, [field]: processedValue };
    if (field === 'state') {
      newAddress.state_id = stateOptions.find(state => state.value === processedValue)?.id || '';
    }
    newAddress.address =
      `${newAddress.addressLine2 ? newAddress.addressLine2 + '/' : ''}${newAddress.addressLine1},`.trim() +
      ' ' +
      newAddress.suburb +
      ' ' +
      newAddress.state +
      ' ' +
      newAddress.postcode;
    setAddress(newAddress);
    const isValid = await validateAddress(newAddress);
    if (isValid) {
      onChange?.(newAddress);
    }
  };

  useEffect(() => {
    // Set formatted address if available
    let formattedAddress = address['address'];
    if (!formattedAddress.includes('/') && address['address_line_2']) {
      let finalAddress = address['address_line_2'] + '/' + formattedAddress;
      setAddress({
        ...address,
        address: finalAddress,
      });

      const validate = async () => {
        const isValid = await validateAddress(address);
        if (isValid) {
          onChange?.(address);
        }
      };
      validate();
    }
  }, [address]);

  return (
    <IndiView gap="$6" {...props}>
      {/* Address Line 1 with autocomplete */}
      {!isManualEntry ? (
        <IndiAddressSuggestions
          suggestions={suggestions}
          searchQuery={variables?.query}
          open={isAddressModalOpen}
          setOpen={setIsAddressModalOpen}
          selectedPlaceId={selectedPlaceId}
          loading={locationLoading}
          searchLoading={searchLoading}
          onAddressSelect={address => {
            if (address?.value) handleAddressSelect(address.value);
            else handleAddressInputSelect();
          }}>
          <IndiSearchInput
            label={fieldLabels.addressLine1}
            labelProps={{
              ...labelProps,
              rightButton: (
                <IndiButton
                  type="link"
                  color="primary"
                  size="xs"
                  text="Manual Entry"
                  onPress={() => handleToggleManualEntry(true)}
                />
              ),
            }}
            inputProps={{
              placeholder: 'Enter your address',
              value: address.addressLine1,
              onChangeText: handleInputChange('addressLine1'),
            }}
            handleSearch={onSearch}
            searching={searchLoading}
            error={errors.addressLine1}
          />
        </IndiAddressSuggestions>
      ) : (
        <IndiLabelInput
          label={fieldLabels.addressLine1}
          labelProps={{
            ...labelProps,
            rightButton: (
              <IndiButton
                type="link"
                color="primary"
                size="xs"
                text="Use Suggestions"
                onPress={() => handleToggleManualEntry(false)}
              />
            ),
          }}
          inputProps={{
            placeholder: 'Enter your address manually',
            value: address.addressLine1,
            onChangeText: handleInputChange('addressLine1'),
          }}
          error={errors.addressLine1}
        />
      )}

      {/* Address Line 2 */}
      <IndiLabelInput
        label={fieldLabels.addressLine2}
        inputProps={{
          value: address.addressLine2,
          placeholder: 'Apartment, building, floor, etc.',
          onChangeText: handleInputChange('addressLine2'),
        }}
        error={errors.addressLine2}
      />

      {/* Unit/Suite */}
      {showUnit && (
        <IndiLabelInput
          label={fieldLabels.unit}
          labelProps={labelProps}
          inputProps={{
            value: address.unit,
            placeholder: 'Unit or suite number',
            onChangeText: handleInputChange('unit'),
          }}
          error={errors.unit}
        />
      )}
      <IndiXStack gap="$4">
        {/* State as Select dropdown */}
        <IndiSelect
          style={{ flex: 1 }}
          label={fieldLabels.state}
          labelProps={labelProps}
          value={address.state}
          onOptionChange={option => {
            handleInputChange('state')(option?.value);
          }}
          data={stateOptions}
          error={errors.state}
        />

        {/* Suburb */}
        <IndiLabelInput
          style={{ flex: 1 }}
          label={fieldLabels.suburb}
          labelProps={labelProps}
          inputProps={{
            value: address.suburb,
            placeholder: 'Enter suburb',
            onChangeText: handleInputChange('suburb'),
          }}
          error={errors.suburb}
        />

        {/* Postcode */}
        <IndiLabelInput
          style={{ flex: 1 }}
          label={fieldLabels.postcode}
          labelProps={labelProps}
          inputProps={{
            value: address.postcode,
            placeholder: 'Enter postcode',
            onChangeText: handleInputChange('postcode'),
          }}
          error={errors.postcode}
        />
      </IndiXStack>
    </IndiView>
  );
};

interface AddressSuggestionsProps {
  suggestions: Option[];
  searchQuery: string;
  onAddressSelect: (value: Option | null) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedPlaceId?: string | null;
  loading?: boolean;
  searchLoading?: boolean;
}

export const IndiAddressSuggestions = ({
  suggestions,
  searchQuery,
  onAddressSelect,
  open,
  setOpen,
  selectedPlaceId,
  loading,
  searchLoading,
  children,
}: React.PropsWithChildren<AddressSuggestionsProps>) => {
  const viewRef = useRef<View>(null);
  const shouldOpen = open && !!searchQuery && !searchLoading;
  const [triggerWidth, setTriggerWidth] = useState<number>(0);
  const { placement } = usePopoverPlacement(shouldOpen, 'bottom-start', viewRef);

  // Handle layout measurement to get trigger width
  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0) {
      setTriggerWidth(width);
    }
  }, []);

  return (
    <Popover open={shouldOpen} onOpenChange={setOpen} placement={placement} allowFlip stayInFrame>
      <Popover.Trigger asChild>
        <IndiView onLayout={handleLayout} width="100%">
          {children}
        </IndiView>
      </Popover.Trigger>

      <Popover.Content
        bg="$containerBg"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$border"
        elevation={4}
        zIndex={100000002}
        p={0}
        ai="stretch"
        width={triggerWidth || '100%'}
        maxHeight={300}>
        <IndiView ref={viewRef}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" width="100%">
            <IndiText secondary size="xs" textTransform="uppercase" fontWeight={400} px="$2" py="$3">
              {suggestions?.length > 0 ? 'Suggestions' : 'Address not found'}
            </IndiText>
            {suggestions?.length > 0 ? (
              suggestions.map(suggestion => (
                <IndiXStack
                  key={suggestion.value}
                  onPress={() => onAddressSelect(suggestion)}
                  px="$3"
                  py={'$2.5'}
                  gap={'$2'}
                  hoverStyle={{
                    backgroundColor: '$listBgHover',
                  }}
                  jc="space-between"
                  ai="center">
                  <IndiText>{suggestion.label}</IndiText>
                  {selectedPlaceId === suggestion.value && loading && <Spinner />}
                </IndiXStack>
              ))
            ) : searchQuery && !searchLoading ? (
              <IndiXStack
                onPress={() => onAddressSelect({ label: searchQuery, value: '' })}
                px="$3"
                py={'$2.5'}
                hoverStyle={{
                  backgroundColor: '$listBgHover',
                }}>
                <IndiText>Use "{searchQuery}"</IndiText>
              </IndiXStack>
            ) : null}

            <IndiText secondary px="$2" py="$3" size="xs" fontWeight={400}>
              Powered by Google
            </IndiText>
          </ScrollView>
        </IndiView>
      </Popover.Content>
    </Popover>
  );
};

export const usePopoverPlacement = (
  open: boolean,
  defaultPlacement: 'bottom-start' | 'top-start',
  contentRef: React.RefObject<View>,
) => {
  const [placement, setPlacement] = useState<any>('bottom-start');
  const [contentLayout, setContentLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const keyboardState = useKeyboardState();
  const screenHeight = useWindowDimensions().height;

  useEffect(() => {
    if (isWeb) return;
    if (open) {
      setTimeout(() => {
        contentRef.current?.measure(
          (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
            setContentLayout({ x: pageX, y: pageY, width, height });
          },
        );
      }, 200);
    } else {
      setContentLayout({ x: 0, y: 0, width: 0, height: 0 });
      setPlacement(defaultPlacement);
    }
  }, [open]);

  useEffect(() => {
    if (isWeb || !open || !contentLayout.height) return;
    const keyboardHeight = keyboardState.height;

    const isKeyboardVisible = keyboardState.isVisible;

    const isShowAbove = contentLayout.y + contentLayout.height + keyboardHeight > screenHeight;

    if (isKeyboardVisible && isShowAbove) {
      // If keyboard is visible but not enough space above or below
      setPlacement('top-start'); // Default to top when keyboard is visible
    } else {
      // Default to the preferred placement if enough space
      setPlacement(defaultPlacement);
    }
  }, [open, keyboardState.height, contentLayout.y, defaultPlacement]);

  return {
    placement,
  };
};
