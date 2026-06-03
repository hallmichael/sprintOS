import { Dimensions } from 'react-native';
import { GetProps, styled, Text as TamaguiText } from 'tamagui';

export const IndiText = styled(TamaguiText, {
  lineHeight: 18,
  fontSize: 14,
  color: '$textNeutral',
  fontFamily: '$body',
  fontWeight: 400,
  variants: {
    full: {
      true: {
        flex: 1,
      },
    },
    brandPrimary: {
      true: {
        color: '$textPrimary',
      },
    },
    bold: {
      true: {
        fontWeight: '700',
      },
    },
    semibold: {
      true: {
        fontWeight: '600',
      },
    },
    medium: {
      true: {
        fontWeight: '500',
      },
    },
    secondary: {
      true: {
        color: '$textSecondary',
      },
    },
    placeholder: {
      true: {
        color: '$textPlaceholder',
      },
    },
    red: {
      true: {
        color: '$inputBorderError',
      },
    },
    white: {
      true: {
        color: '$white',
      },
    },
    size: {
      xxs: {
        fontSize: 10,
        lineHeight: 12,
      },
      xs: {
        fontSize: 12,
        lineHeight: 14,
      },
      sm: {
        fontSize: 14,
        lineHeight: 18,
      },
      md: {
        fontSize: 16,
        lineHeight: 20,
      },
      lg: {
        fontSize: 18,
        lineHeight: 24,
      },
      xl: {
        fontSize: 20,
        lineHeight: 24,
      },
      xxl: {
        fontSize: 24,
        lineHeight: 32,
      },
    },
    disabled: {
      true: {
        color: '$textDisabled',
        cursor: 'not-allowed',
      },
    },
  },
});

export type IndiTextProps = GetProps<typeof IndiText>;

export const IndiH1 = (props: IndiTextProps) => {
  return <IndiText size="xxl" fontWeight="600" {...props} />;
};

export const IndiH2 = (props: IndiTextProps) => {
  return <IndiText size="xl" fontWeight="600" {...props} />;
};

export const IndiH3 = (props: IndiTextProps) => {
  return <IndiText size="lg" fontWeight="600" {...props} />;
};

export const IndiH4 = (props: IndiTextProps) => {
  return <IndiText size="md" fontWeight="600" {...props} />;
};

export const IndiErrorText = (props: IndiTextProps) => {
  return <IndiText red size="xs" fontWeight={400} {...props} />;
};

export const IndiLabel = (props: IndiTextProps) => {
  return <IndiText numberOfLines={1} size="sm" {...props} />;
};

export const IndiHeaderText = (props: IndiTextProps) => {
  return <IndiText {...props} fontWeight="600" color="$textSecondary" />;
};

export const IndiParagraph = (props: IndiTextProps) => {
  return <IndiText {...props} size="sm" />;
};

export const IndiMenuSegment = (props: IndiTextProps) => {
  const { width, height } = Dimensions.get('window');
  return Math.min(width, height) >= 768 ? (
    <IndiH1 {...props} />
  ) : (
    <IndiText color="$textNeutral" fontWeight="600" {...props} />
  );
};

// export type {CustomTextProps as TextProps};
