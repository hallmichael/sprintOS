import {useState, useEffect} from 'react';
import {Spinner, View} from 'tamagui';

let showLoadingHud: () => void;
let hideLoadingHud: () => void;

export const LoadingHudProvider = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    showLoadingHud = () => setIsVisible(true);
    hideLoadingHud = () => setIsVisible(false);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center" zi={10}>
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
        <Spinner size="small" color="$buttonSolidPrimaryBg" />
      </View>
    </View>
  );
};

export const LoadingHud = {
  show: () => {
    if (showLoadingHud) {
      showLoadingHud();
    }
  },
  hide: () => {
    if (hideLoadingHud) {
      hideLoadingHud();
    }
  },
};
