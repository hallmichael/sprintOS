import React, { useEffect, useState } from 'react';

import EventEmitter, { EventTypes } from '@/utils/emitter';
import StringUtils from '@/utils/StringUtils';
import { CircleAlert, CircleCheck, TriangleAlert, X } from '@tamagui/lucide-icons';
import { Toast as TamaguiToast, ToastProvider as TamaguiToastProvider, ToastViewport } from '@tamagui/toast';
import { Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { isWeb, XStack } from 'tamagui';
import { IndiText } from './text';
import { IndiView } from './views';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const MAX_VISIBLE_TOASTS = 4;

type ToastProps = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  index: number;
  hideToast?: (id: string) => void;
};

const toastConfig: Record<ToastType, { icon: any; backgroundColor: string }> = {
  success: {
    icon: CircleCheck,
    backgroundColor: '$Green500',
  },
  error: {
    icon: TriangleAlert,
    backgroundColor: '$Red500',
  },
  warning: {
    icon: CircleAlert,
    backgroundColor: '$Orange500',
  },
  info: {
    icon: CircleAlert,
    backgroundColor: '$Blue500',
  },
};

// Calculate animation offset based on index
const getAnimationOffset = (index: number) => {
  const baseOffset = isWeb ? 12 : 0; // Base offset in logical pixels
  const spacing = 8; // Spacing between toasts
  return baseOffset + (index + 1) * spacing;
};

export const ToastMessage = ({ id, title, message, type, index, hideToast }: ToastProps) => {
  const config = toastConfig[type];
  const offset = getAnimationOffset(index);
  const Icon = config.icon;

  // console.log({ id, title, message, type, config });
  return (
    <TamaguiToast
      key={id}
      bg={config.backgroundColor}
      y={offset}
      p="$4"
      borderRadius={'$default'}
      animation="quick"
      onOpenChange={isOpen => {
        !isOpen && hideToast?.(id);
      }}
      enterStyle={{
        opacity: 0,
        scale: 0.9,
        y: -20 - offset,
      }}
      exitStyle={{
        opacity: 0,
        scale: 0.95,
        y: -10 - offset,
      }}>
      <XStack ai="center" jc="space-between" minWidth={230}>
        <XStack ai="center" flex={1}>
          <Icon color={'$iconWhite'} size={20} />
          <IndiView gap="$1" ml="$3" flex={1}>
            <IndiText color={'$iconWhite'}>{message}</IndiText>
          </IndiView>
        </XStack>
        <Pressable onPress={() => hideToast?.(id)}>
          <XStack
            p="$1"
            br="$default"
            ac="center"
            hoverStyle={{
              backgroundColor: '$NeutralWhiteAlpha8',
            }}>
            <X color={'$iconWhite'} size={16} />
          </XStack>
        </Pressable>
      </XStack>
    </TamaguiToast>
  );
};

// <Toast
//       key={currentToast.id}
//       duration={currentToast.duration}
//       viewportName={currentToast.viewportName}
//       enterStyle={{opacity: 0, scale: 0.5, y: -25}}
//       exitStyle={{opacity: 0, scale: 1, y: -20}}
//       y={isWeb ? '$12' : '$1'}
//       br={8}
//       animation="quick"
//       backgroundColor={config.backgroundColor}
//       borderColor={config.borderColor}
//       borderWidth={1}
//       px={16}
//       pr={10}>
//       <XStack ai="center" maxWidth={320} minWidth={220}>
//         <XStack ai="center" flex={1}>
//           <IconComponent color={config.color} size={20} />
//           <YStack ai="flex-start" pl="$3">
//             <Toast.Title maxWidth={320} fow="bold" color={config.color} flexWrap="wrap">
//               {currentToast.title}
//             </Toast.Title>
//             {!!currentToast.message && (
//               <Toast.Description color={config.color} flexWrap="wrap">
//                 {currentToast.message}
//               </Toast.Description>
//             )}
//           </YStack>
//         </XStack>
//         <Toast.Close asChild>
//           <XStack
//             p="$1"
//             br="$3"
//             ac="center"
//             hoverStyle={{
//               backgroundColor: '$alertCloseBgHover',
//             }}>
//             <X color={config.color} size={18} />
//           </XStack>
//         </Toast.Close>
//       </XStack>
//     </Toast>

export const ToastProvider = () => {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const Wrapper = Platform.OS === 'ios' ? FullWindowOverlay : React.Fragment;

  useEffect(() => {
    const onAdd = (item: ToastProps) => {
      setToasts(t => [item, ...t]);
    };
    EventEmitter.register(EventTypes.SHOW_TOAST, onAdd);
    return () => {
      EventEmitter.unregisterType(EventTypes.SHOW_TOAST);
    };
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <Wrapper>
      <TamaguiToastProvider swipeDirection="horizontal" duration={3000} native={[]}>
        {toasts.slice(0, MAX_VISIBLE_TOASTS).map((toast, index) => (
          <ToastMessage {...toast} key={toast.id} {...{ hideToast, index }} />
        ))}
        <ToastViewport top={insets.top} left={0} right={0} multipleToasts />
      </TamaguiToastProvider>
    </Wrapper>
  );
};

export const Toast = {
  Provider: ToastProvider,
  show: ({
    title = 'Success',
    message = '',
    type = 'success',
  }: {
    title?: string;
    message: string;
    type?: ToastType;
  }) => {
    const toast = {
      id: StringUtils.uuid(),
      type,
      title,
      message,
    };
    EventEmitter.notify(EventTypes.SHOW_TOAST, toast);
  },
  success: ({ title = 'Success', message = '' }: { title?: string; message: string }) => {
    Toast.show({ title, message, type: 'success' });
  },
  error: ({ title = 'Error', message = '' }: { title?: string; message: string }) => {
    Toast.show({ title, message, type: 'error' });
  },
  warning: ({ title = 'Warning', message = '' }: { title?: string; message: string }) => {
    Toast.show({ title, message, type: 'warning' });
  },
  info: ({ title = 'Info', message = '' }: { title?: string; message: string }) => {
    Toast.show({ title, message, type: 'info' });
  },
};
