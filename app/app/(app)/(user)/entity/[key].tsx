import EntityScreen from '@/features/crud/screens/EntityScreen';
import { useLocalSearchParams } from 'expo-router';

export default function EntityRoute() {
  const { key } = useLocalSearchParams<{ key: string }>();

  return <EntityScreen entityKey={key} />;
}
