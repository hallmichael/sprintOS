// SignaturePad.tsx
import { IndiButton } from '@/components/buttons';
import { IndiParagraph } from '@/components/text';
import { IterationCw } from '@tamagui/lucide-icons';
import { useEffect, useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Spinner, useTheme } from 'tamagui';
import { IndiXStack, IndiYStack } from './views';
type Point = { x: number; y: number };

type SignaturePadProps = {
  maxWidth?: number;
  maxHeight?: number;
  toggleScroll?: (isDrawing: boolean) => void;
};

export const IndiSignaturePad = ({ maxWidth, maxHeight, toggleScroll }: SignaturePadProps) => {
  const theme = useTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentPoints = useRef<Point[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        toggleScroll?.(false);
        const { locationX, locationY } = evt.nativeEvent;
        currentPoints.current = [{ x: locationX, y: locationY }];
      },
      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPoints.current.push({ x: locationX, y: locationY });
        const path = pointsToSvgPath(currentPoints.current);
        setPaths(prev => [...prev.slice(0, -1), path]);
      },
      onPanResponderRelease: () => {
        toggleScroll?.(true);
        if (currentPoints.current.length > 1) {
          const path = pointsToSvgPath(currentPoints.current);
          setPaths(prev => [...prev, path]);
        }
      },

      onPanResponderTerminate: () => {
        toggleScroll?.(true);
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  useEffect(() => {
    setIsLoading(false); // workraround for tamagui / pan responder
  }, [theme]);

  const pointsToSvgPath = (points: Point[]) => {
    if (points.length < 2) return '';
    const d = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
    return d;
  };

  const clearSignature = () => {
    setPaths([]);
    currentPoints.current = [];
  };

  return (
    <IndiYStack maxWidth={maxWidth || '100%'}>
      {isLoading && <Spinner />}
      <IndiParagraph>Signature</IndiParagraph>
      <IndiYStack
        my="$1"
        backgroundColor="$inputBgDefault"
        borderColor="$inputBorderDefault"
        borderWidth={1}
        borderRadius="$4"
        overflow="hidden"
        width="100%"
        height={maxHeight || 300}
        {...panResponder.panHandlers}>
        <Svg height="100%" width="100%">
          {paths.map((d, idx) => (
            <Path key={idx} d={d} stroke={theme?.signaturePadStroke?.val} strokeWidth={2} fill="none" />
          ))}
        </Svg>
      </IndiYStack>
      <IndiXStack justifyContent="space-between" alignItems="center">
        <IndiParagraph color="$textSecondary">Draw in the box to digitally sign</IndiParagraph>
        <IndiButton type="link" color="primary" size="sm" iconAfter={IterationCw} onPress={clearSignature}>
          Clear
        </IndiButton>
      </IndiXStack>
    </IndiYStack>
  );
};
