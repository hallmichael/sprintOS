import { Spinner } from 'tamagui';
import { IndiView, IndiViewProps } from './base';

type LoadingContainerProps = {
  loading?: boolean;
} & IndiViewProps;

export const LoadingContainer = ({ loading, children, ...props }: React.PropsWithChildren<LoadingContainerProps>) => {
  if (!loading) {
    return children;
  }
  return (
    <IndiView full center {...props}>
      <Spinner />
    </IndiView>
  );
};
