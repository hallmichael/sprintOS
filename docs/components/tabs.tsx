import { IndiParagraph } from '@/components/text';
import { ScrollView } from 'tamagui';
import { IndiView, IndiViewProps, IndiXStack, IndiYStack } from './views';

export type IndiSectionProps = {
  title: string;
  component: JSX.Element;
} & IndiViewProps;

interface TabsInterface {
  sections: IndiSectionProps[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export const IndiTabs = ({ sections, tabIndex, setTabIndex }: TabsInterface) => {
  return (
    <IndiYStack gap="$6">
      <ScrollView
        contentContainerStyle={{ gap: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        bbw={1}
        bc="$border">
        {sections.map(({ title, component, ...props }, i) => (
          <IndiXStack
            key={i}
            ai="center"
            onPress={() => setTabIndex(i)}
            bbw={2}
            bc={tabIndex === i ? '$textPrimary' : 'transparent'}
            pb="$1"
            hoverStyle={{
              bc: 'transparent',
            }}
            {...props}>
            <IndiParagraph
              fontWeight={500}
              color={tabIndex === i ? '$textPrimary' : '$textSecondary'}
              hoverStyle={{ color: '$textPrimary' }}>
              {title}
            </IndiParagraph>
          </IndiXStack>
        ))}
      </ScrollView>

      {/* Render all tab content but only show the active one */}
      {sections.map((section, i) => (
        <IndiView key={i} style={{ display: tabIndex === i ? 'flex' : 'none' }}>
          {section.component}
        </IndiView>
      ))}
    </IndiYStack>
  );
};
