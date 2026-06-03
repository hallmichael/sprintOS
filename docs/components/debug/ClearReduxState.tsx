import { toggleBreadcrumbs } from '@/redux/settings/reducer';
import { useShowBreadcrumbs } from '@/redux/settings/selectors';
import { clearPersistedState } from '@/redux/store';
import { dispatch } from '@/redux/utils';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { XStack } from 'tamagui';
import { IndiButton } from '../buttons';

export const ClearReduxState = () => {
  if (!__DEV__) return null;

  const showBreadcrumbs = useShowBreadcrumbs();

  return (
    <XStack position="absolute" top={10} right={80} zIndex={9999} gap="$2">
      <IndiButton
        onPress={() => {
          dispatch(toggleBreadcrumbs());
        }}
        type="outline"
        color="primary">
        {showBreadcrumbs ? <EyeOff size={16} color="$textSecondary" /> : <Eye size={16} color="$textSecondary" />}{' '}
        Breadcrumbs
      </IndiButton>

      <IndiButton
        onPress={async () => {
          await clearPersistedState();
          // Force reload the page
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
        type="outline"
        color="primary">
        Clear Cache
      </IndiButton>
    </XStack>
  );
};
