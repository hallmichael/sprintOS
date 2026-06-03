import { IndiBreadcrumb } from '@/components/breadcrumb';
import { useShowBreadcrumbs } from '@/redux/settings/selectors';
import { usePathname } from 'expo-router';
import { isWeb, XStack, YStack } from 'tamagui';

type HeaderProps = {
  mobileTitle?: string;
  mobileButtons?: { title: string; onPress: (() => void) | Promise<void> }[];
  sideButtons?: React.ReactNode;
  // Custom breadcrumb segments to override default ones
  customSegments?: { [key: string]: string };
};

export const IndiHeader = ({ customSegments = {} }: HeaderProps) => {
  if (!isWeb) {
    return null;
  }
  return <BreadCrumbs customSegments={customSegments} />;
};

// List of directory names that don't have index.tsx files and should be skipped in breadcrumbs
const DIRECTORIES_WITHOUT_INDEX = ['branches'];

const BreadCrumbs = ({ customSegments = {} }: { customSegments?: { [key: string]: string } }) => {
  const pathname = usePathname();
  const showBreadcrumbs = useShowBreadcrumbs();

  if (!showBreadcrumbs) {
    return null;
  }

  // Remove hash fragment from pathname if present
  const cleanPathname = pathname.split('#')[0];

  // Filter out router-specific segments and empty segments
  const pathParts = cleanPathname.split('/').filter(part => part && !part.includes('(') && !part.includes(')'));

  if (pathParts.length === 0) {
    return null;
  }

  // Filter out segments that are in the DIRECTORIES_WITHOUT_INDEX list
  const filteredPathParts = pathParts.filter(segment => !DIRECTORIES_WITHOUT_INDEX.includes(segment));

  return (
    <YStack>
      <XStack bg="$containerBg" bbw={0} bc={'$border'}>
        {filteredPathParts.map((segment, index) => {
          // For the path, we need to consider where this segment would fall in the original path
          // We want to keep the original routing structure with the original paths
          const originalPathIndex = pathParts.indexOf(segment);
          const path = '/' + pathParts.slice(0, originalPathIndex + 1).join('/');

          // Use custom segment name if provided, otherwise use the URL segment
          const displayName = customSegments[segment] || segment;

          return <IndiBreadcrumb key={index} index={index} path={path} segment={displayName} />;
        })}
      </XStack>
    </YStack>
  );
};
