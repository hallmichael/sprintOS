import { IndiParagraph } from '@/components/text';
import { XStack } from 'tamagui';

interface PopoverContentProps {
  onDialogOpen?: () => void;
  onSubmit?: () => void;
  dialogTitle?: string;
  dialogDescription?: string;
  buttonTitle: string;
  icon?: React.ReactNode;
  [key: string]: any;
  children?: React.ReactNode;
}

export function IndiPopoverSubButton({icon, buttonTitle, onPress, children, ...props}: PopoverContentProps) {
  return (
    <XStack ai="center" p="$2" onPress={onPress ?? undefined} cursor="pointer">
      {icon ?? <div />}
      <IndiParagraph ml="$2" {...props}>
        {buttonTitle}
      </IndiParagraph>
    </XStack>
  );
}
