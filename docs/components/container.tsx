import { IndiH2 } from '@/components/text';
import React, { createContext, forwardRef, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { getTokens, isWeb, XStack, YStack } from 'tamagui';
import { IndiButton } from './buttons';
import { IndiHeader } from './header';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from './keyboardAwareScrollView';
import { IndiView, IndiViewProps, IndiYStack } from './views';

const ScrollContext = createContext<{ toggleScroll: (enable: boolean) => void } | undefined>(undefined);

const IndiContainer = ({
  mobileTitle,
  webTitle,
  mobileButtons,
  webButtons,
  sideButtons,
  children,
  customSegments,
  isHeaderSticky = false,
  ...props
}: {
  mobileTitle?: string;
  webTitle?: string;
  mobileButtons?: { title: string; onPress: Promise<void> | (() => void) }[];
  webButtons?: { title: string; onPress: Promise<void> | (() => void) }[];
  sideButtons?: React.ReactNode;
  children: React.ReactNode;
  scrollviewprops?: KeyboardAwareScrollViewProps;
  customSegments?: { [key: string]: string };
  isHeaderSticky?: boolean;
  [key: string]: any;
}) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleScroll = (enable: boolean) => {
    setScrollEnabled(enable);
  };

  return (
    <ScrollContext.Provider value={{ toggleScroll }}>
      <KeyboardAwareScrollView
        scrollEnabled={scrollEnabled}
        {...props.scrollviewprops}
        // contentContainerStyle={{ flexGrow: 1 }}
        // enableOnAndroid={true}
        // extraScrollHeight={20}
        // keyboardOpeningTime={0}
      >
        <YStack f={1} bg="$containerBg">
          <YStack
            f={1}
            bg="$containerBg"
            px={!props?.maxWidth ? '$6' : undefined}
            pb="$4"
            w="100%"
            $md={{ px: '$4' }}
            $xs={{ px: '$2' }}
            {...props}
            alignSelf="center">
            <IndiYStack
              gap="$2"
              position={isHeaderSticky ? 'sticky' : 'relative'}
              bg="$containerBg"
              pt="$4"
              pb={isHeaderSticky ? '$6' : '$4'}
              top={0}
              zIndex={1000}>
              {isWeb && (
                <IndiHeader
                  key={JSON.stringify(customSegments)}
                  mobileTitle={mobileTitle}
                  mobileButtons={mobileButtons}
                  sideButtons={sideButtons}
                  customSegments={customSegments}
                />
              )}

              {Platform.OS === 'web' && webTitle && (
                <XStack gap="$4" jc="space-between" ai="center">
                  <IndiH2>{webTitle}</IndiH2>
                  <XStack gap="$2">
                    {sideButtons}
                    {webButtons?.map((action, i) => (
                      <IndiButton
                        key={i}
                        type="solid"
                        color="primary"
                        size="md"
                        text={action.title}
                        onPress={() => typeof action.onPress === 'function' && action.onPress()}
                      />
                    ))}
                  </XStack>
                </XStack>
              )}
            </IndiYStack>
            {children}
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </ScrollContext.Provider>
  );
};

// Hook to consume the toggleScroll function from the context
const useIndiContainerScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollContext.Provider');
  }
  return context;
};

export { IndiContainer, useIndiContainerScrollContext };

export const ContainerContent = ({ children, ...props }: { children: React.ReactNode } & IndiViewProps) => {
  // return children;
  return (
    <IndiView
      flex={1}
      width={'100%'}
      // $gtMd={{
      //   alignSelf: 'center',
      //   width: '80%',
      //   maxWidth: 700,
      // }}
      // $gtLg={{
      //   width: '60%',
      // }}
      {...props}>
      {children}
    </IndiView>
  );
};

export type ContainerProps = {
  hasFooter?: boolean;
  statusBarProps?: IndiViewProps;
  header?: any;
  renderHeader?: React.ReactNode;
  tabHeader?: any;
  scrollable?: boolean;
  scrollviewprops?: KeyboardAwareScrollViewProps;
} & IndiViewProps;

export const Container = forwardRef(
  (
    {
      statusBarProps,
      hasFooter,
      header,
      scrollable,
      scrollviewprops,
      style,
      tabHeader,
      renderHeader,
      ...props
    }: ContainerProps,
    ref?: any,
  ) => {
    const tokens = getTokens();
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const toggleScroll = (enable: boolean) => {
      setScrollEnabled(enable);
    };

    return (
      <ScrollContext.Provider value={{ toggleScroll }}>
        <IndiView full bg={'$pageBg'} {...props}>
          {scrollable ? (
            <KeyboardAwareScrollView
              ref={ref}
              scrollEnabled={scrollEnabled}
              {...scrollviewprops}
              contentContainerStyle={[
                {
                  flexGrow: 1,
                  paddingHorizontal: tokens.space.$4.val,
                  paddingBottom: tokens.space.$8.val,
                },
                scrollviewprops?.contentContainerStyle,
              ]}>
              <ContainerContent>{props.children}</ContainerContent>
            </KeyboardAwareScrollView>
          ) : (
            <ContainerContent>{props.children}</ContainerContent>
          )}
        </IndiView>
      </ScrollContext.Provider>
    );
  },
);
