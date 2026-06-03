import {useState} from 'react';
import {Label, Stack, XStack, YStack} from 'tamagui';

interface ColorButtonProps {
  color: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
}

export const ColorButton = ({color, isSelected, onSelect}: ColorButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Stack
      width="$1.5"
      height="$1.5"
      borderRadius={40}
      borderColor={isSelected ? '$blue8' : isHovered ? '$inputBorderHover' : '$border'}
      borderWidth={2}
      padding={2}
      pressStyle={{scale: 0.97}}
      hoverStyle={{borderColor: '$gray8'}}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => onSelect?.(color || '')}>
      <Stack flex={1} backgroundColor={color} borderRadius={40} />
    </Stack>
  );
};

interface ColorSelectorProps {
  label: string;
  isRequired?: boolean;
  isError?: boolean;
}

export const ColorSelector = ({label, isRequired = false, isError = false}: ColorSelectorProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colors = [
    '$Red500', // Red
    '$Orange500', // Orange
    '$Green500', // Green
    '$Purple500', // Purple
    '$Blue500', // Blue
    '$Pink500', // Pink
    '$Neutral500', // Grey
  ];

  return (
    <YStack>
      <Label color={isError ? '$textRed' : '$textSecondary'} mb="$1">
        {label}
      </Label>
      <XStack space="$2">
        {colors.map((color, index) => (
          <ColorButton key={index} color={color} isSelected={selectedColor === color} onSelect={setSelectedColor} />
        ))}
      </XStack>
    </YStack>
  );
};
