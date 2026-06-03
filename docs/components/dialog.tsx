import EventEmitter, { EventTypes } from '@/utils/emitter';
import { useLayoutEffect, useMemo, useState } from 'react';

import { IndiButton, IndiButtonProps } from './buttons';
import { IndiModal } from './modal';
import { IndiXStack } from './views';

type IndiDialogProps = {
  title: string;
  message: string;
  buttons?: IndiButtonProps[];
};

const IndiDialogView = () => {
  const [props, setProps] = useState<IndiDialogProps>();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const showAlert = async (props: IndiDialogProps) => {
      setProps(props);
      setVisible(true);
    };
    EventEmitter.register(EventTypes.SHOW_ALERT, showAlert);
    return () => {
      EventEmitter.unregister(showAlert);
    };
  }, []);

  const footerComponent = useMemo(() => {
    if (!props?.buttons?.length) {
      return null;
    }
    return (
      <IndiXStack py={'$4'} px={'$6'} gap={'$4'} jc="flex-end">
        {props.buttons.map((button, index) => (
          <IndiButton
            key={index}
            color="secondary"
            {...button}
            {...(button.handlePress && {
              handlePress: async () => {
                await button.handlePress?.();
                await new Promise(resolve => setTimeout(resolve, 200));
                setVisible(false);
              },
            })}
            {...(button.onPress && {
              onPress: e => {
                button.onPress?.(e);
                setVisible(false);
              },
            })}
          />
        ))}
      </IndiXStack>
    );
  }, [props?.buttons]);

  return (
    <IndiModal
      isOpen={visible}
      onClose={() => setVisible(false)}
      title={props?.title}
      description={props?.message}
      footerComponent={footerComponent}
    />
  );
};

export const Dialog = {
  Provider: IndiDialogView,
  show: (props: IndiDialogProps) => {
    EventEmitter.notify(EventTypes.SHOW_ALERT, props);
  },
  warn: (props: IndiDialogProps) => {
    EventEmitter.notify(EventTypes.SHOW_ALERT, props);
  },
};
