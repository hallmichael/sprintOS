import { X } from '@tamagui/lucide-icons';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from 'tamagui';
// Import components directly from their source files instead of from index
import { IndiButton } from '@/components/buttons';
import { IndiH3, IndiParagraph } from '@/components/text';
import { IndiXStack, IndiYStack } from '@/components/views/base';
import modalSizes from '@/themes/modalSizes';
// Modal sizes from Figma design system

/** Base stacking for this modal. Menus/popovers portaled above the modal must use a higher z-index. */
export const INDI_MODAL_Z_INDEX = 200_000_000;

type ModalSize = keyof typeof modalSizes;

interface ModalProps {
  trigger?: ReactElement;
  title?: ReactElement | string;
  description?: string;
  children?: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  handleSubmit?: UseFormHandleSubmit<any>;
  onConfirm?: (data?: any) => Promise<any>;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  confirmButtonText?: string;
  confirmButtonVariant?: 'primary' | 'secondary' | 'red';
  tertiaryButton?: ReactElement;
  loading?: boolean;
  size?: ModalSize;
  /** When set, modal width is this fraction of the window width (e.g. 0.8 for 80%). Overrides size-based width. */
  widthPercent?: number;
  /** Scroll body horizontal padding (default 24). */
  contentPaddingHorizontal?: number;
  /** Scroll body vertical padding (default 16). */
  contentPaddingVertical?: number;
  footerComponent?: React.ReactNode;
  /** When set, replaces the default title + close header (e.g. custom multi-row toolbars). */
  customHeader?: React.ReactNode;
  /** Merged after base modal container styles (shadow, radius, etc.). */
  containerStyle?: ViewStyle;
  /** When true, modal spans the full window width and height (no max-size card). */
  fullScreen?: boolean;
  /**
   * When used with fullScreen: render body as a flex View instead of ScrollView so children
   * can use flex:1 and fill the viewport (e.g. PDF/image previews with zoom).
   */
  disableBodyScroll?: boolean;
  /** When true, no footer row (default Cancel/Save or footerComponent) is rendered. */
  hideFooter?: boolean;
  /** When true, header shows a bottom border even if the body is not scrollable. */
  showHeaderDivider?: boolean;
  /** When true, footer shows a top border even if the body is not scrollable. */
  showFooterDivider?: boolean;
}

export function IndiModal({
  trigger,
  title,
  description,
  children,
  onOpen,
  onClose,
  handleSubmit,
  onConfirm,
  isOpen: controlledIsOpen,
  setIsOpen: setControlledIsOpen,
  confirmButtonText = 'Save',
  confirmButtonVariant = 'primary',
  tertiaryButton,
  loading,
  footerComponent,
  size = 'md',
  widthPercent,
  contentPaddingHorizontal = 24,
  contentPaddingVertical = 16,
  customHeader,
  containerStyle,
  fullScreen = false,
  disableBodyScroll = false,
  hideFooter = false,
  showHeaderDivider = true,
  showFooterDivider = true,
}: ModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
  const [isContentScrollable, setIsContentScrollable] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate the modal width based on size prop and screen width
  const getModalWidth = () => {
    if (widthPercent != null && widthPercent > 0 && widthPercent <= 1) {
      return windowDimensions.width * widthPercent;
    }
    const maxWidth = modalSizes[size];
    const availableWidth = windowDimensions.width * 0.9; // 90% of screen width

    // Return the smaller of maxWidth or 90% of screen width
    return Math.min(maxWidth, availableWidth);
  };

  // Calculate the modal max height (75% of screen height)
  const getModalMaxHeight = () => {
    return windowDimensions.height * 0.75; // 75% of screen height
  };

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  // Check if content is scrollable
  useEffect(() => {
    setIsContentScrollable(contentHeight > scrollViewHeight && scrollViewHeight > 0);
  }, [contentHeight, scrollViewHeight]);

  // Measure content height
  const onContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  // Measure ScrollView height
  const onScrollViewLayout = (event: any) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  // Styles defined with constant properties
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: INDI_MODAL_Z_INDEX,
    },
    modalContainer: {
      backgroundColor: theme.modalBg.val,
      borderRadius: 8,
      width: getModalWidth(),
      maxWidth: widthPercent != null ? undefined : modalSizes[size],
      maxHeight: getModalMaxHeight(),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: INDI_MODAL_Z_INDEX,
      overflow: 'hidden', // Ensures content doesn't spill outside rounded corners
    },
    header: {
      paddingTop: 24,
      paddingRight: 24,
      paddingLeft: 24,
      paddingBottom: 16,
    },
    headerWithBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.border?.val,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
    },
    footer: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingRight: 24,
      paddingLeft: 24,
    },
    footerWithBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.border?.val,
    },
    overlayFullScreen: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
  });

  const onSaveModal = async () => {
    if (!handleSubmit || !onConfirm) {
      handleClose();
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await new Promise<boolean>(resolve => {
        handleSubmit(
          async data => {
            const submitResult = await onConfirm(data);
            resolve(submitResult);
          },
          data => {
            resolve(false);
          },
        )();
      });

      if (result) {
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // Add function to determine button component
  const getButton = () => {
    switch (confirmButtonVariant) {
      case 'secondary':
        return (
          <IndiButton
            aria-label="Close"
            type="solid"
            color="secondary"
            size="md"
            text={confirmButtonText}
            handlePress={onSaveModal}
          />
        );
      case 'red':
        return (
          <IndiButton
            aria-label="Close"
            type="solid"
            color="red"
            size="md"
            text={confirmButtonText}
            handlePress={onSaveModal}
          />
        );
      default:
        return (
          <IndiButton
            aria-label="Close"
            type="solid"
            color="primary"
            size="md"
            text={confirmButtonText}
            handlePress={onSaveModal}
          />
        );
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const open = controlledIsOpen ?? isOpen;
  const setOpen = setControlledIsOpen ?? setIsOpen;

  useEffect(() => {
    if (open) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      onOpen?.();
    }
  }, [open]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setOpen(false);
      onClose?.();
    });
  };

  const ModalTrigger = trigger
    ? React.cloneElement(trigger, {
        onPress: () => setOpen(true),
      })
    : null;

  return (
    <>
      {ModalTrigger}
      <Modal visible={open} transparent animationType="none" onRequestClose={handleClose}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.overlay,
              fullScreen && styles.overlayFullScreen,
              { opacity: fadeAnim },
            ]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  fullScreen && {
                    width: windowDimensions.width,
                    height: windowDimensions.height,
                    maxWidth: windowDimensions.width,
                    maxHeight: windowDimensions.height,
                    borderRadius: 0,
                    flex: 1,
                  },
                  containerStyle,
                ]}>
                {/* Header - Sticky */}
                {customHeader ? (
                  customHeader
                ) : (
                  <IndiYStack
                    style={[
                      styles.header,
                      (isContentScrollable || showHeaderDivider) && styles.headerWithBorder,
                    ]}>
                    <IndiXStack width="100%" justifyContent="space-between" alignItems="center">
                      {title && (
                        <IndiYStack space="$2" flex={1}>
                          <IndiH3 fontWeight="bold">{title}</IndiH3>
                        </IndiYStack>
                      )}
                      <IndiButton type="ghost" color="secondary" size="xs" icon={X} onPress={handleClose} />
                    </IndiXStack>
                  </IndiYStack>
                )}

                {/* Body — ScrollView by default; flex View when fullScreen + disableBodyScroll (flex layouts) */}
                {fullScreen && disableBodyScroll ? (
                  <View
                    style={[
                      styles.content,
                      { flex: 1, minHeight: 0 },
                      {
                        paddingVertical: contentPaddingVertical,
                        paddingHorizontal: contentPaddingHorizontal,
                      },
                    ]}>
                    {description && <IndiParagraph color="$textNeutral">{description}</IndiParagraph>}
                    {children}
                  </View>
                ) : (
                  <ScrollView
                    ref={scrollViewRef}
                    style={[styles.content, fullScreen && { flex: 1 }]}
                    contentContainerStyle={{
                      paddingVertical: contentPaddingVertical,
                      paddingHorizontal: contentPaddingHorizontal,
                      ...(fullScreen ? { flexGrow: 1 } : {}),
                    }}
                    onContentSizeChange={onContentSizeChange}
                    onLayout={onScrollViewLayout}>
                    {description && <IndiParagraph color="$textNeutral">{description}</IndiParagraph>}
                    {children}
                  </ScrollView>
                )}

                {/* Footer - Sticky */}
                {!hideFooter &&
                  (footerComponent ? (
                    React.isValidElement(footerComponent) &&
                    (isContentScrollable || showFooterDivider) ? (
                      React.cloneElement(footerComponent, {
                        ...footerComponent.props,
                        borderTop: true,
                      })
                    ) : (
                      footerComponent
                    )
                  ) : (
                    <IndiYStack
                      style={[
                        styles.footer,
                        (isContentScrollable || showFooterDivider) && styles.footerWithBorder,
                      ]}>
                      <IndiXStack jc="space-between">
                        <IndiXStack jc="flex-start">{tertiaryButton}</IndiXStack>

                        <IndiXStack gap="$4" justifyContent="flex-end">
                          <IndiButton type="outline" color="secondary" size="md" onPress={handleClose} text={'Cancel'} />
                          {getButton()}
                        </IndiXStack>
                      </IndiXStack>
                    </IndiYStack>
                  ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
