import {Spinner, View, YStack} from 'tamagui';

export function LoadingIndicator() {
  return (
    <YStack f={1} jc="center" ai="center">
      <View
        style={{
          backgroundColor: '',
          padding: 20,
          borderRadius: 10,
          shadowColor: '$buttonOutlinePrimaryBgHover',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Spinner size="large" />
      </View>
    </YStack>
  );
}
