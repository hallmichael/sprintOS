import { useCallback, useMemo, useState } from 'react';
import { File, FolderOpen } from '@tamagui/lucide-icons';
import { IndiYStack, IndiXStack } from '../views';
import { IndiButton } from '../buttons';
import { IndiModal } from '../modal';
import { IndiText } from '../text';
import { IndiSearchInput } from '../inputs/search';
import type { FolderExplorerFile } from './FolderExplorer';
import { ScrollView } from 'tamagui';

function normalizePath(path: string): string {
  if (!path) return '';
  return path.replace(/^\/+|\/+$/g, '');
}

function getParentPath(filePath: string): string {
  if (!filePath) return '';
  const normalized = normalizePath(filePath);
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash > 0 ? normalized.substring(0, lastSlash) : '';
}

function getFileExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return ext;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

type FileItemProps = {
  file: FolderExplorerFile;
  onSelect: (file: FolderExplorerFile) => void;
};

function FileItem({ file, onSelect }: FileItemProps) {
  const parentPath = getParentPath(file.path);
  const displayPath = parentPath || '/';

  return (
    <IndiXStack
      alignItems="center"
      py="$2"
      px="$3"
      gap="$3"
      hoverStyle={{ backgroundColor: '$backgroundHover' }}
      pressStyle={{ backgroundColor: '$backgroundPressed' }}
      borderRadius="$2"
      cursor="pointer"
      onPress={() => onSelect(file)}
    >
      <File size={20} color="$textSecondary" />
      <IndiYStack flex={1} gap="$1">
        <IndiText fontSize="$3" fontWeight="500" numberOfLines={1}>
          {file.name}
        </IndiText>
        <IndiXStack gap="$2" alignItems="center">
          <FolderOpen size={12} color="$textTertiary" />
          <IndiText fontSize="$1" color="$textTertiary" numberOfLines={1}>
            {displayPath}
          </IndiText>
          {file.size && (
            <IndiText fontSize="$1" color="$textTertiary">
              • {formatFileSize(file.size)}
            </IndiText>
          )}
        </IndiXStack>
      </IndiYStack>
    </IndiXStack>
  );
}

type SearchFileModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  files: FolderExplorerFile[];
  onFileSelect: (file: FolderExplorerFile, parentFolderPath: string) => void;
};

export function SearchFileModal({
  isOpen,
  setIsOpen,
  files,
  onFileSelect,
}: SearchFileModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter to only source files (not shortcuts) and not directories
  const sourceFiles = useMemo(() => {
    return files.filter(file => {
      if (file.isDirectory) return false;
      if (file.sourceId) return false; // Exclude shortcuts
      if (file.name?.toLowerCase().endsWith('.url')) return false; // Exclude .url files
      return true;
    });
  }, [files]);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return sourceFiles.slice(0, 50); // Show first 50 files when no search
    }

    const query = searchQuery.toLowerCase().trim();
    return sourceFiles
      .filter(file => {
        const name = file.name?.toLowerCase() || '';
        const path = file.path?.toLowerCase() || '';
        return name.includes(query) || path.includes(query);
      })
      .slice(0, 100); // Limit results
  }, [sourceFiles, searchQuery]);

  const handleSearchText = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleFileSelect = useCallback((file: FolderExplorerFile) => {
    const parentPath = getParentPath(file.path);
    setIsOpen(false);
    setSearchQuery('');
    onFileSelect(file, parentPath);
  }, [setIsOpen, onFileSelect]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, [setIsOpen]);

  const footerComponent = (
    <IndiYStack px="$6" borderTopWidth={1} borderTopColor="$border">
      <IndiXStack py="$4" gap="$2" justifyContent="flex-end">
        <IndiButton
          text="Close"
          type="outline"
          color="secondary"
          size="md"
          handlePress={handleClose}
        />
      </IndiXStack>
    </IndiYStack>
  );

  return (
    <IndiModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Search Files"
      footerComponent={footerComponent}
      size="md"
    >
      <IndiYStack
        gap="$4"
        borderTopWidth={1}
        borderTopColor="$border"
        marginTop={-16}
        marginHorizontal={-24}
        paddingTop="$4"
        paddingHorizontal="$6"
      >
        <IndiSearchInput
          onSearchText={handleSearchText}
          inputProps={{
            placeholder: 'Search by file name or path...',
            autoFocus: true,
          }}
        />

        <IndiYStack gap="$1">
          <IndiText fontSize="$2" color="$textSecondary">
            {searchQuery.trim()
              ? `${filteredFiles.length} file${filteredFiles.length !== 1 ? 's' : ''} found`
              : `${sourceFiles.length} source file${sourceFiles.length !== 1 ? 's' : ''} available`}
          </IndiText>
        </IndiYStack>

        <ScrollView
          maxHeight={400}
          showsVerticalScrollIndicator={true}
          borderWidth={1}
          borderColor="$border"
          borderRadius="$2"
        >
          {filteredFiles.length === 0 ? (
            <IndiYStack padding="$6" alignItems="center">
              <IndiText color="$textSecondary">
                {searchQuery.trim() ? 'No files match your search' : 'No source files available'}
              </IndiText>
            </IndiYStack>
          ) : (
            <IndiYStack py="$1">
              {filteredFiles.map((file) => (
                <FileItem
                  key={file.id || file.path}
                  file={file}
                  onSelect={handleFileSelect}
                />
              ))}
            </IndiYStack>
          )}
        </ScrollView>
      </IndiYStack>
    </IndiModal>
  );
}

