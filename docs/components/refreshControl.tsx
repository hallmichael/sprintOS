import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native';
import { useTheme } from 'tamagui';

export const RefreshControl = (props: RefreshControlProps) => {
  const theme = useTheme();
  return <RNRefreshControl tintColor={theme.Primary500?.val} {...props} />;
};
