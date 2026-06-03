import { Stack, StackProps, XStack } from 'tamagui';

export const Divider = (props: StackProps) => {
  return <Stack btw={1} bc="$border" {...props} />;
};

export const DividerFullWidth = (props: StackProps) => {
  return <XStack btw={1} bc="$border" {...props} />;
};
