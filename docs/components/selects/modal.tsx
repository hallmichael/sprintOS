import { Option } from '@/types';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalProps, Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTokens } from 'tamagui';
import { IndiText } from '../text';
import { IndiView } from '../views';
import { DURATION, NUMBER_OF_VISIBLE_ROW } from './constant';
import { SelectList } from './list';
import { IndiSelectProps, Position } from './type';

const AnimatedView = Animated.createAnimatedComponent(IndiView);

export type SelectModalProps = Omit<IndiSelectProps, 'position'> & {
  onClose: () => void;
  position: SharedValue<Position>;
  disableAutoClose?: boolean;
  renderItem?: (option?: Option) => React.ReactNode;
} & ModalProps;

export const SelectModal = ({
  visible,
  position: positionShared,
  data = [],
  value,
  multiple,
  numberOfVisibleRow = NUMBER_OF_VISIBLE_ROW,
  disableAutoClose,
  onChange,
  onClose,
  renderItem,
  ...props
}: SelectModalProps) => {
  const position = positionShared.value;
  const [measuredWidth, setMeasuredWidth] = useState(0);

  // Use an empty option if no data is provided
  const safeData = useMemo(() => (data.length ? data : [{ value: '', label: '' }]), [data]);

  const animationProgress = useSharedValue(0);
  const leftPosition = useSharedValue(position.pageX);

  const bottom = useSafeAreaInsets()?.bottom || 0;
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const inputHeight = getTokens()?.size?.$inputHeight?.val || 40;

  // Calculate popup height based on number of rows
  const popupHeight = useMemo(() => {
    const itemCount = safeData.length;
    const visibleRows = Math.min(itemCount, numberOfVisibleRow);
    return Math.min(
      itemCount > numberOfVisibleRow ? visibleRows * inputHeight + 30 : itemCount * inputHeight,
      itemCount * inputHeight,
    );
  }, [safeData.length, numberOfVisibleRow, inputHeight]);

  // Determine if dropdown should appear above or below the trigger
  const topPosition = position.pageY + position.height + 4;
  const showAbove = topPosition + popupHeight + bottom + 16 > screenHeight;
  const top = showAbove ? position.pageY - popupHeight - 4 : topPosition;

  // Calculate optimal width for the dropdown
  const maxWidth = screenWidth * 0.8;
  const minWidth = position.width;

  const optimalWidth = _.clamp(minWidth, measuredWidth, maxWidth);

  // Update position and animation when visibility changes
  useEffect(() => {
    // Center dropdown or adjust within screen bounds
    if (optimalWidth > position.width) {
      leftPosition.value = Math.max(0, position.pageX - (optimalWidth - position.width) / 2);
    } else {
      leftPosition.value = position.pageX;
    }

    // Prevent dropdown from extending beyond screen edge
    if (leftPosition.value + optimalWidth > screenWidth) {
      leftPosition.value = Math.max(0, screenWidth - optimalWidth);
    }

    // Animate visibility
    animationProgress.value = withTiming(visible ? 1 : 0, { duration: DURATION });
  }, [visible, position, optimalWidth, leftPosition, screenWidth, animationProgress]);

  // Create animated styles for dropdown
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animationProgress.value, [0, 1], showAbove ? [10, 0] : [-10, 0], {
      extrapolateRight: 'clamp',
    });

    return {
      opacity: animationProgress.value,
      transform: [{ translateY }],
      left: leftPosition.value,
      width: optimalWidth,
      top,
      height: popupHeight,
    };
  }, [optimalWidth, popupHeight, showAbove, top]);

  // Handle selection of an item
  const handleItemSelection = useCallback(
    (item: Option) => {
      if (!disableAutoClose) {
        onClose();
      }
      onChange?.(item);
    },
    [disableAutoClose, onChange, onClose],
  );

  // Update measured width when text layout changes
  const onTextLayout = useCallback(
    (e: any) => {
      const layoutWidth = e.nativeEvent.layout.width;
      if (layoutWidth > 0) {
        setMeasuredWidth(layoutWidth + 70);
      }
    },
    [measuredWidth],
  );

  const longestOption = useMemo(() => {
    return data.reduce((acc, curr) => {
      return curr.label.length > acc.label.length ? curr : acc;
    }, data[0]);
  }, [data]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose} {...props}>
      <IndiText
        position="absolute"
        opacity={0}
        mx="$4"
        pointerEvents="none"
        overflow="visible"
        numberOfLines={1}
        onLayout={onTextLayout}>
        {longestOption?.label}
      </IndiText>
      <Pressable onPress={onClose} style={{ flex: 1, opacity: measuredWidth > 0 ? 1 : 0 }}>
        <AnimatedView
          shadow="popover"
          bg="$modalBg"
          position="absolute"
          borderRadius="$default"
          border
          overflow="hidden"
          minHeight="$inputHeight"
          zIndex={100}
          style={animatedStyle}>
          {/* Hidden text for width measurement */}

          <SelectList
            data={safeData}
            value={value}
            multiple={multiple}
            numberOfVisibleRow={numberOfVisibleRow}
            onPress={handleItemSelection}
            renderItem={renderItem}
          />
        </AnimatedView>
      </Pressable>
    </Modal>
  );
};
