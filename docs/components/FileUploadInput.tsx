import { CreateMediaInput, Media } from '@/graphql/graphql';
import { gql, useMutation } from '@apollo/client';
import { Paperclip, Trash2, Upload, XCircle } from '@tamagui/lucide-icons';
import { useCallback, useRef, useState } from 'react';
import { IndiButton } from './buttons';
import { IndiParagraph, IndiText } from './text';
import { IndiXStack, IndiYStack } from './views';

const CREATE_MEDIA = gql`
  mutation createMedia($input: CreateMediaInput!, $media: Upload!) {
    createMedia(input: $input, media: $media) {
      id
      name
      downloadable_url
      file_name
      mime_type
      size
      uuid
    }
  }
`;

const DELETE_MEDIA = gql`
  mutation deleteMedia($id: ID!) {
    deleteMedia(id: $id) {
      id
    }
  }
`;

export type UploadedFile = {
  id?: string;
  name: string;
  size: number;
  file?: File;
  downloadable_url?: string;
};

type FileUploadInputProps = {
  entityId?: string;
  entityType?: string;
  collectionName?: string;
  existingFiles?: Media[];
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  showUploadButton?: boolean;
};

export function FileUploadInput({
  entityId,
  entityType,
  collectionName,
  existingFiles = [],
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'application/pdf'],
  showUploadButton = true,
}: FileUploadInputProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    existingFiles.map(file => ({
      id: file.id,
      name: file.name || file.file_name || 'Unknown file',
      size: file.size || 0,
      downloadable_url: file.downloadable_url || undefined,
    })),
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMedia] = useMutation(CREATE_MEDIA);
  const [deleteMedia] = useMutation(DELETE_MEDIA);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const webFiles = Array.from(files);
      if (uploadedFiles.length + webFiles.length > maxFiles) {
        setError(`You can upload a maximum of ${maxFiles} files`);
        return;
      }

      // Validate file size and type
      const validFiles = webFiles.filter(file => {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`);
          return false;
        }

        if (!acceptedFormats.includes(file.type)) {
          setError(`File ${file.name} is not an accepted format`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      const newFiles = validFiles.map(file => ({
        name: file.name,
        size: file.size,
        file,
      }));

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);

      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }

      // Auto-upload files if entityId and entityType are provided
      if (entityId && entityType) {
        setUploading(true);

        Promise.all(
          newFiles.map(async fileData => {
            if (!fileData.file) return fileData;

            try {
              const input: CreateMediaInput = {
                entity: entityType,
                entity_id: entityId,
                collection_name: collectionName,
              };

              const result = await createMedia({
                variables: {
                  input,
                  media: fileData.file,
                },
              });

              // If upload successful, update the file with server data
              if (result.data?.createMedia) {
                const mediaData = result.data.createMedia;
                return {
                  id: mediaData.id,
                  name: mediaData.file_name || fileData.name,
                  size: mediaData.size || fileData.size,
                  downloadable_url: mediaData.downloadable_url,
                };
              }

              return fileData;
            } catch (error) {
              console.error('Error uploading file:', error);
              setError(`Failed to upload file: ${fileData.name}`);
              return fileData;
            }
          }),
        )
          .then(updatedFileList => {
            // Combine updated files with existing files
            const newFilesList = [
              ...uploadedFiles.filter(
                file => !newFiles.some(newFile => newFile.name === file.name && newFile.size === file.size),
              ),
              ...updatedFileList,
            ];

            setUploadedFiles(newFilesList);

            if (onFilesChange) {
              onFilesChange(newFilesList);
            }
          })
          .finally(() => {
            setUploading(false);
          });
      }
    },
    [
      uploadedFiles,
      maxFiles,
      maxSizeMB,
      acceptedFormats,
      onFilesChange,
      entityId,
      entityType,
      collectionName,
      createMedia,
    ],
  );

  const handleRemoveFile = useCallback(
    async (index: number) => {
      const fileToRemove = uploadedFiles[index];
      let serverDeletionSuccessful = false;

      // If the file has an ID, it exists on the server and should be deleted
      if (fileToRemove.id) {
        try {
          const response = await deleteMedia({
            variables: {
              id: fileToRemove.id,
            },
          });

          // Check if we have a successful response
          if (response.data && response.data.deleteMedia) {
            serverDeletionSuccessful = true;
          } else if (response.errors) {
            console.error('Error deleting file:', response.errors);
            setError('Failed to delete file from server');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          setError('Failed to delete file from server');
        }
      }

      // Always remove from local state, even if server deletion failed
      // This ensures the UI remains responsive
      const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(updatedFiles);

      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }

      // Log success/failure for debugging
      console.log(
        'File removed from local state. Server deletion:',
        serverDeletionSuccessful ? 'successful' : 'not attempted or failed',
      );
    },
    [uploadedFiles, deleteMedia, onFilesChange],
  );

  const handleUploadFiles = useCallback(async () => {
    if (!entityId || !entityType) return;
    setUploading(true);
    setError(null);

    const filesToUpload = uploadedFiles.filter(file => file.file && !file.id);

    try {
      for (const fileData of filesToUpload) {
        if (!fileData.file) continue;

        const input: CreateMediaInput = {
          entity: entityType,
          entity_id: entityId,
          collection_name: collectionName,
        };

        const result = await createMedia({
          variables: {
            input,
            media: fileData.file,
          },
        });

        // Update the file in state with the server-returned data
        if (result.data?.createMedia) {
          const mediaData = result.data.createMedia;

          setUploadedFiles(prev =>
            prev.map(file =>
              file === fileData
                ? {
                    id: mediaData.id,
                    name: mediaData.file_name || fileData.name,
                    size: mediaData.size || fileData.size,
                    downloadable_url: mediaData.downloadable_url,
                  }
                : file,
            ),
          );
        }
      }

      if (onFilesChange) {
        onFilesChange(uploadedFiles);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, [uploadedFiles, createMedia, entityId, entityType, collectionName, onFilesChange]);

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <IndiYStack gap="$4">
      {/* Description text */}
      <IndiText size="xs" secondary>
        Please upload a copy of the licence. Accepted file types: JPG, PNG, or PDF (maximum size: {maxSizeMB} MB per
        file). You can upload up to {maxFiles} files.
      </IndiText>

      {/* Upload button */}
      <IndiXStack>
        <IndiButton onPress={openFileSelector} size="md" type="solid" color="secondary">
          <IndiXStack gap="$2" alignItems="center" padding="$2">
            <Upload color="$textPrimary" />
            <IndiText color="$textPrimary" fontWeight="bold">
              Upload
            </IndiText>
          </IndiXStack>
        </IndiButton>
      </IndiXStack>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFormats.join(',')}
        style={{ display: 'none' }}
        onChange={e => handleFileChange(e.target.files)}
      />

      {/* Error message */}
      {error && (
        <IndiYStack gap="$2">
          <IndiXStack backgroundColor="$errorLight" p="$2" borderRadius="$2" alignItems="center" gap="$2">
            <IndiParagraph color="$error">{error}</IndiParagraph>
            <IndiButton
              size="sm"
              type="ghost"
              onPress={() => setError(null)}
              icon={<XCircle color="$error" />}></IndiButton>
          </IndiXStack>
        </IndiYStack>
      )}

      {/* Uploading indicator */}
      {uploading && (
        <IndiXStack backgroundColor="$backgroundSecondary" p="$2" borderRadius="$2" alignItems="center" gap="$2">
          <IndiText>Uploading files...</IndiText>
        </IndiXStack>
      )}

      {/* File list */}
      {uploadedFiles.length > 0 && (
        <IndiYStack gap="$2">
          {uploadedFiles.map((file, i) => (
            <IndiXStack
              key={i}
              backgroundColor="$Neutral100"
              padding="$2"
              borderRadius="$2"
              alignItems="center"
              justifyContent="space-between">
              <IndiXStack gap="$2" alignItems="center">
                {file.downloadable_url && (
                  <IndiButton
                    onPress={() => {
                      if (file.downloadable_url) {
                        window.open(file.downloadable_url, '_blank');
                      }
                    }}
                    size="sm"
                    type="ghost"
                    icon={<Paperclip color="$textSecondary" />}
                  />
                )}
                <IndiText numberOfLines={1}>{file.name}</IndiText>
              </IndiXStack>
              <IndiXStack gap="$2">
                <IndiButton
                  onPress={() => handleRemoveFile(i)}
                  size="sm"
                  type="ghost"
                  icon={<Trash2 color="$textSecondary" />}
                />
              </IndiXStack>
            </IndiXStack>
          ))}
        </IndiYStack>
      )}

      {/* Upload button - only show if there are files to upload, showUploadButton is true, and we're not auto-uploading */}
      {showUploadButton && !entityId && !entityType && uploadedFiles.some(file => file.file && !file.id) && (
        <IndiButton onPress={handleUploadFiles} disabled={uploading} color="secondary">
          <IndiXStack gap="$2" alignItems="center" padding="$2">
            <Upload color="$textPrimary" />
            <IndiText color="$textPrimary" fontWeight="bold">
              {uploading ? 'Uploading...' : 'Upload Files'}
            </IndiText>
          </IndiXStack>
        </IndiButton>
      )}
    </IndiYStack>
  );
}
