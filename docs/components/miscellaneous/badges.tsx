import { IndiText } from '@/components/text';
import { IndiView, IndiViewProps } from '@/components/views/base';

type IndiBadgesProps = {
  text: string;
  color?: 'green' | 'red' | 'orange' | 'blue' | 'grey' | 'greyLight' | 'purple' | 'pink' | string;
  [key: string]: any;
} & IndiViewProps;

export const IndiBadges = ({ text, color = 'green', ...props }: IndiBadgesProps) => {
  const getBadgesStyle = (color: string) => {
    const styles = {
      backgroundColor: '$buttonSolidPrimaryBg',
      textColor: '$NeutralWhite',
    };
    switch (color) {
      case 'green':
        styles.backgroundColor = '$Green500';
        break;
      case 'red':
        styles.backgroundColor = '$Red500';
        break;
      case 'orange':
        styles.backgroundColor = '$Orange500';
        break;
      case 'blue':
        styles.backgroundColor = '$Blue500';
        break;
      case 'greyLight':
        styles.backgroundColor = '$Neutral200';
        styles.textColor = '$Neutral900';
        break;
      case 'grey':
        styles.backgroundColor = '$Neutral500';
        break;
      case 'purple':
        styles.backgroundColor = '$Purple500';
        break;
      case 'pink':
        styles.backgroundColor = '$Pink500';
        break;
      default:
        styles.backgroundColor = color;
    }
    return styles;
  };
  const { backgroundColor, textColor } = getBadgesStyle(color);

  return (
    <IndiView px={'$2'} py={'$1'} borderRadius="$small" backgroundColor={backgroundColor} width="auto" {...props}>
      <IndiText color={textColor} size="xs">
        {text}
      </IndiText>
    </IndiView>
  );
};
