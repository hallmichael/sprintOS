import { Paperclip, Trash2, Upload } from '@tamagui/lucide-icons';
import { useId, useState } from 'react';
import { Button, XStack, YStack } from 'tamagui';
import { useFilePicker } from './bento/elements/pickers/hooks/useFilePicker';
import { MediaTypeOptions } from './bento/elements/pickers/types';
import { IndiParagraph } from './text';

type UploadFileProps = {
  files?: File[];
  addFiles?: (files: File[]) => void;
};

export function IndiUploadFile({files, addFiles}: UploadFileProps) {
  const id = useId();
  const [items, setItems] = useState<File[]>(files || []);
  const {open, getInputProps, getRootProps, dragStatus} = useFilePicker({
    typeOfPicker: 'file',
    mediaTypes: [MediaTypeOptions.All],
    multiple: true, // Changed to true to allow multiple files
    onPick: ({webFiles, nativeFiles}) => {
      if (webFiles?.length) {
        setItems(prevFiles => [...prevFiles, ...webFiles]);
        addFiles?.(webFiles);
      } else if (nativeFiles?.length) {
        setItems(prevFiles => [...prevFiles, ...(nativeFiles as any)]);
        addFiles?.(nativeFiles as any);
      }
    },
  });

  const removeFile = (index: number) => {
    setItems(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <YStack gap="$2">
      {/* @ts-ignore */}
      <YStack
        {...getRootProps()}
        bs="dashed"
        bw="$0.5"
        bc="$inputDropzoneBorderDefault"
        br="$2"
        p="$4"
        bg="$inputDropzoneBgDefault"
        hoverStyle={{bg: '$inputDropzoneBgHover'}}
        onPress={open}>
        <YStack gap="$1" jc="center" ai="center">
          <XStack gap="$2">
            <Upload y={-1} color="$iconPrimary" size={'$1'} />
            <IndiParagraph color="$textPrimary" fontWeight="bold">
              Drop files to upload or click to browse
            </IndiParagraph>
          </XStack>
          <IndiParagraph color="$textSecondary">Max file size: 10mb. Accepted file formats: pdf, png, jpeg</IndiParagraph>
        </YStack>
      </YStack>
      {/* @ts-ignore */}
      <XStack id={id} tag="input" width={0} height={0} {...getInputProps()} />

      {items.length > 0 && (
        <YStack gap="$2">
          {items.map((file, i) => (
            <XStack key={i} gap="$4" p="$2" borderTopColor="$borderColor" bg="$inputFileBgDefault" br="$4" ai="center">
              <XStack gap="$2" ai={'center'}>
                <Paperclip color="$iconSecondary" size={'$1'} ml="$2" mr="$1" />
                <XStack f={1}>
                  <IndiParagraph numberOfLines={1} fontSize={'$3'}>
                    {formatFileSize(file.size)} - {file.name}
                  </IndiParagraph>
                </XStack>
                <Button onPress={() => removeFile(i)} size="$2" bg="$colorTransparent" hoverStyle={{bg: '$colorTransparent'}}>
                  <Button.Icon>
                    <Trash2 size={'$1'} color="$iconSecondary" />
                  </Button.Icon>
                </Button>
              </XStack>
            </XStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
