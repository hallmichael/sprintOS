import AppUtils from '@/utils/AppUtils';
import React from 'react';
import { RefreshControlProps, ScrollView } from 'react-native';
import {
  KeyboardAwareScrollView as RNKeyboardAwareScrollView,
  KeyboardAwareScrollViewProps as RNKeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';
import { isWeb } from 'tamagui';
import { RefreshControl } from './refreshControl';
import { LoadingContainer } from './views';

export type KeyboardAwareScrollViewProps = {
  loading?: boolean;
  refetch?: (v?: any) => Promise<any>;
  refreshControlProps?: RefreshControlProps;
  ref?: any;
} & RNKeyboardAwareScrollViewProps;

export const KeyboardAwareScrollView = React.forwardRef(
  (
    { loading: isLoading, refetch: onReload, refreshControlProps, ...props }: KeyboardAwareScrollViewProps,
    ref?: any,
  ) => {
    const Container = isWeb ? ScrollView : RNKeyboardAwareScrollView;
    const [refreshing, setIsRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
      setIsRefreshing(true);
      await Promise.all([onReload?.(), AppUtils.delay(1000)]);
      setIsRefreshing(false);
    }, [onReload]);

    return (
      <Container
        ref={ref}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
        refreshControl={
          onReload ? (
            <RefreshControl
              {...{ onRefresh }}
              {...refreshControlProps}
              refreshing={refreshControlProps?.refreshing || refreshing}
            />
          ) : undefined
        }
        {...props}
        snapToOffsets={refreshing ? undefined : props.snapToOffsets}
        contentContainerStyle={[{ flexGrow: 1 }, props.contentContainerStyle]}>
        <LoadingContainer {...{ loading: isLoading }}>{props.children}</LoadingContainer>
      </Container>
    );
  },
);
