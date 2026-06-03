import { CreateMediaInput, Media, useCreateMediaMutation, useDeleteMediaMutation } from '@/graphql/graphql';
import { Image } from '@tamagui/lucide-icons';
import { DocumentNode } from 'graphql/language/ast';
import { useCallback, useRef, useState } from 'react';
import { IndiButton } from '../buttons';
import { IndiImage } from '../images';
import { Toast } from '../toast';
import { IndiView, IndiXStack } from '../views';

type IndiProMediaSelectProps = {
  entityId: string;
  entityType: string;
  collectionName: string;
  value?: Media;
  onChange?: (value: Media) => void;
  acceptedFormats?: string[];
  refetchQueries?: DocumentNode[];
};

export function IndiProMediaSelect({
  entityId,
  entityType,
  collectionName,
  value,
  onChange,
  acceptedFormats = ['image/jpeg', 'image/png'],
  refetchQueries,
}: IndiProMediaSelectProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMedia] = useCreateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const media = files[0];

      if (!acceptedFormats.includes(media.type)) {
        Toast.error({ message: 'File type not supported' });
        return;
      }

      // Create media input
      const input: CreateMediaInput = {
        entity: entityType,
        entity_id: entityId,
        collection_name: collectionName,
      };

      setIsUploading(true);

      // Call the mutation
      return createMedia({
        variables: {
          input,
          media,
        },
        refetchQueries,
        onError: Toast.error,
        onCompleted: res => {
          onChange?.(res.createMedia as Media);
          setIsUploading(false);
        },
      });
    },
    [createMedia, entityId, entityType, collectionName, acceptedFormats, onChange],
  );

  const handleDelete = useCallback(() => {
    if (!value?.id) return;
    return deleteMedia({
      variables: { id: value.id },
      refetchQueries,
      onCompleted: () => {
        Toast.success({ message: 'Media deleted successfully' });
        onChange?.(undefined as unknown as Media);
      },
      onError: Toast.error,
    });
  }, [deleteMedia, value?.id]);

  return (
    <IndiView gap="$4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        style={{ display: 'none' }}
        onChange={e => handleFileChange(e.target.files)}
      />

      <IndiXStack gap={'$6'} ai="center">
        <IndiView
          size={'$24'}
          borderStyle="dashed"
          border
          center
          borderRadius={'$default'}
          overflow="hidden"
          bg={'$inputDropzoneBgDefault'}>
          {value?.downloadable_url ? (
            <IndiImage
              width="100%"
              height="100%"
              resizeMethod="auto"
              src={value.downloadable_url}
              alt="Uploaded media"
            />
          ) : (
            <Image color="$iconSecondary" size={14} />
          )}
        </IndiView>
        {value ? (
          <IndiButton type="link" color="red" handlePress={handleDelete} disabled={isUploading}>
            Reset to default
          </IndiButton>
        ) : (
          <IndiButton
            type="outline"
            color="secondary"
            onPress={() => fileInputRef.current?.click()}
            loading={isUploading}>
            Upload image
          </IndiButton>
        )}
      </IndiXStack>
    </IndiView>
  );
}
