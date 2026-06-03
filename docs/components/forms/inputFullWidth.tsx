import { IndiParagraph, IndiTextProps } from '../text';
import { IndiView } from '../views';

type InputFullWidthProps = {
  label: string;
  value: string;
  flexDirection?: 'row' | 'column';
  labelProps?: IndiTextProps;
};

export default function InputFullWidth({
  label,
  value,
  flexDirection = 'row',
  labelProps,
  ...props
}: InputFullWidthProps) {
  return (
    <IndiView gap="$2" f={1} w="100%" flexWrap="wrap" flexDirection={flexDirection}>
      <IndiParagraph w="$40" miw="$40" color="$textSecondary" {...labelProps}>
        {label}
      </IndiParagraph>
      <IndiParagraph f={1}>{value}</IndiParagraph>
    </IndiView>
  );
}
