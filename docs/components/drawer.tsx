import { IndiButton } from '@/components/buttons';
import { IndiText } from '@/components/text';
import { IndiXStack, IndiYStack } from '@/components/views';
import { X } from '@tamagui/lucide-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Platform, Pressable, StyleSheet } from 'react-native';

const DEFAULT_WIDTH = Math.min(480, Dimensions.get('window').width * 0.9);

export type IndiDrawerProps = {
  /** Whether the drawer is open */
  open: boolean;
  /** Called when the drawer should close (overlay press or close button) */
  onClose: () => void;
  /** Optional header title (node or string). When provided, a header row with title and close button is shown. */
  title?: React.ReactNode;
  /** Width of the panel. Defaults to min(480, 90% of window width). */
  width?: number;
  /** Panel content. Use ScrollView inside if content may overflow. */
  children: React.ReactNode;
};

/**
 * Reusable right-side drawer: overlay + slide-in panel from the right.
 * Use for secondary panels (e.g. notes, details) that don't need the full screen.
 */
export function IndiDrawer({ open, onClose, title, width = DEFAULT_WIDTH, children }: IndiDrawerProps) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 200,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [open, width, overlayOpacity, slideAnim]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => onClose());
  }, [onClose, width, overlayOpacity, slideAnim]);

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={handleClose}>
      <Pressable
        style={[StyleSheet.absoluteFill, Platform.OS === 'web' && styles.overlayCursor]}
        onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>
      <Pressable
        style={[StyleSheet.absoluteFill, Platform.OS === 'web' && styles.overlayCursor]}
        pointerEvents="box-none">
        <Animated.View
          style={[styles.drawerPanel, { width, transform: [{ translateX: slideAnim }] }]}
          onStartShouldSetResponder={() => true}>
          <IndiYStack flex={1} bg="$background" height="100%">
            {title != null && (
              <IndiXStack
                px="$4"
                py="$3"
                jc="space-between"
                ai="center"
                borderBottomWidth={1}
                borderBottomColor="$borderColor">
                {typeof title === 'string' ? (
                  <IndiText fontSize="$6" fontWeight="bold" flex={1}>
                    {title}
                  </IndiText>
                ) : (
                  title
                )}
                <IndiButton type="ghost" color="secondary" size="xs" icon={X} onPress={handleClose} />
              </IndiXStack>
            )}
            <IndiYStack flex={1} minHeight={0}>
              {children}
            </IndiYStack>
          </IndiYStack>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayCursor: {
    cursor: 'default',
  } as const,
  drawerPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    ...(Platform.OS === 'web'
      ? { boxShadow: '-2px 0 8px rgba(0,0,0,0.15)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
});
