import { X } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { isWeb } from 'tamagui';
import { IndiButton } from '../buttons';
import { IndiText } from '../text';
import { IndiXStack } from '../views';
import { IndiLabelInput, IndiLabelInputProps } from './base';

const EmailTag = ({ email, onRemove }: { email: string; onRemove: () => void }) => {
  return (
    <IndiXStack gap={'$1'} bg="$emailTagBg" pl="$2" borderRadius="$full" ai="center" overflow="hidden">
      <IndiText my={'$1'} color={'$tagContent'} numberOfLines={1}>
        {email}
      </IndiText>
      <IndiButton
        height={'100%'}
        type="ghost"
        color="secondary"
        size="sm"
        icon={<X size={18} />}
        onPress={onRemove}
        hoverStyle={{ bg: '$emailTagBgHover' }}
        borderWidth={0}
      />
    </IndiXStack>
  );
};

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type IndiEmailInputProps = {
  value: string[];
  onChange?: (emails: string[]) => void;
  multipleEmails?: boolean;
} & IndiLabelInputProps;

export const IndiEmailInput = React.forwardRef(
  ({ value: emails = [], inputProps, containerProps, onChange, ...props }: IndiEmailInputProps, ref?: any) => {
    const [currentInput, setCurrentInput] = useState('');
    const [inputError, setInputError] = useState('');

    const validateEmail = (email: string): boolean => {
      return EMAIL_REGEX.test(email);
    };

    const handleAddEmail = useCallback(() => {
      const trimmedEmail = currentInput.trim();

      if (!trimmedEmail) return;

      if (!validateEmail(trimmedEmail)) {
        setInputError('Please enter a valid email address');
        return;
      }

      if (emails.includes(trimmedEmail)) {
        setInputError('Email already added');
        return;
      }

      const newEmails = [...emails, trimmedEmail];
      onChange?.(newEmails);
      setCurrentInput('');
      setInputError('');
    }, [currentInput, emails, onChange]);

    const handleRemoveEmail = useCallback(
      (index: number) => {
        const newEmails = [...emails];
        newEmails.splice(index, 1);
        onChange?.(newEmails);
      },
      [emails, onChange],
    );

    const handleKeyPress = useCallback(
      (e: any) => {
        if (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ',') {
          e.preventDefault();
          handleAddEmail();
        }
      },
      [handleAddEmail],
    );

    const handleBlur = useCallback(
      (e: any) => {
        if (currentInput.trim()) {
          handleAddEmail();
        }
        inputProps?.onBlur?.(e);
      },
      [currentInput, handleAddEmail, inputProps],
    );

    const handleInputChange = useCallback(
      (text: string) => {
        // Remove commas as they're used as separators
        const sanitizedText = text.replace(/,/g, '');
        setCurrentInput(sanitizedText);
        setInputError('');
        inputProps?.onChangeText?.(sanitizedText);
      },
      [inputProps],
    );

    const EmailTags = useMemo(() => {
      if (!emails?.length) return null;

      return (
        <IndiXStack flex={0} flexWrap="wrap" gap="$2" ai="center">
          {emails.map((email, index) => (
            <EmailTag key={`${email}_${index}`} email={email} onRemove={() => handleRemoveEmail(index)} />
          ))}
        </IndiXStack>
      );
    }, [emails, handleRemoveEmail]);

    const containerHeight = emails?.length ? 'auto' : '$inputHeight';

    const combinedError = inputError || props.error;

    return (
      <IndiLabelInput
        {...props}
        inputProps={{
          placeholder: 'Please input',
          autoCapitalize: 'none',
          keyboardType: 'email-address',
          minWidth: '$10',
          height: 'auto',
          ...inputProps,
          value: currentInput,
          onChangeText: handleInputChange,
          onKeyPress: isWeb ? handleKeyPress : undefined,
          onSubmitEditing: handleAddEmail,
          onBlur: handleBlur,
        }}
        error={combinedError}
        disableClear
        renderLeft={EmailTags}
        containerProps={{
          fd: 'row',
          flexWrap: 'wrap',
          gap: '$2',
          height: containerHeight,
          py: '$2',
          ai: 'center',
          ...containerProps,
        }}
      />
    );
  },
);
