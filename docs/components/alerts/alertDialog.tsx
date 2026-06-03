import { IndiButton } from '../buttons';
import { IndiModal } from '../modal';

type Props = {
  title: string;
  message?: string;
  buttonTitle: string;
  primary?: boolean;
  onPressAction?: () => void;
  actionButtonTitle: string;
};

export const IndiAlertDialogButton = ({
  title,
  message,
  buttonTitle,
  primary,
  onPressAction,
  actionButtonTitle,
}: Props) => {
  const onConfirm = async () => {
    await onPressAction?.();
    return true;
  };
  return (
    <IndiModal
      trigger={<IndiButton type="solid" color={primary ? 'primary' : 'red'} size="md" text={buttonTitle} />}
      title={title}
      description={message}
      confirmButtonText={actionButtonTitle}
      confirmButtonVariant={primary ? 'primary' : 'red'}
      onConfirm={onConfirm}
    />
  );
};
