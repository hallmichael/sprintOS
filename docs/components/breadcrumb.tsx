import { IndiParagraph } from '@/components/text';
import { IndiXStack } from '@/components/views';
import { ChevronRight } from '@tamagui/lucide-icons';
import { Href, Link } from 'expo-router';

interface IndiBreadcrumbProps {
  index: number;
  path: string;
  segment: string;
  isClickable?: boolean;
}

const breadcrumbMap: Record<string, string> = {
  'site-plan-types': 'Site Plan Types',
  nccs: 'NCC Editions',
  'site-zones': 'Site Zones',
  'building-classifications': 'Building Classifications',
  '[building_classifications_id]': 'Edit',
  'work-types': 'Work Types',
  users: 'User Management',
  'installation-certificates': 'Installation Certificates',
};

export const IndiBreadcrumb = ({ index, path, segment, isClickable = true }: IndiBreadcrumbProps) => {
  return (
    <IndiXStack key={index} ai="center">
      {index !== 0 && <ChevronRight size={15} b={-1} color={'$iconSecondary'} />}
      {isClickable ? (
        <Link href={path as Href}>
          <IndiParagraph
            color="$textSecondary"
            style={{ textTransform: 'capitalize' }}
            hoverStyle={{ textDecorationLine: 'underline', color: '$textNeutral' }}>
            {breadcrumbMap[segment] ?? decodeURIComponent(segment)}
          </IndiParagraph>
        </Link>
      ) : (
        <IndiParagraph color="$textSecondary" style={{ textTransform: 'capitalize' }}>
          {breadcrumbMap[segment] ?? decodeURIComponent(segment)}
        </IndiParagraph>
      )}
    </IndiXStack>
  );
};
