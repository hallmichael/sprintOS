import { IndiView, IndiViewProps, LoadingContainer } from '../views';
import { useTableContext } from './TableContext';

export function IndiTableLoadingOverlay(props: IndiViewProps) {
  const { loading } = useTableContext();
  if (!loading) {
    return null;
  }

  return (
    <IndiView minHeight={'$20'} {...props}>
      <LoadingContainer loading={loading}></LoadingContainer>
    </IndiView>
  );
}
