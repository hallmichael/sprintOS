import { useCallback, useEffect, useState } from 'react';
import { FolderOpen, Link2, ChevronDown, ChevronRight, Loader } from '@tamagui/lucide-icons';
import { IndiYStack, IndiXStack } from '../views';
import { IndiButton } from '../buttons';
import { IndiModal } from '../modal';
import { IndiText } from '../text';
import { IndiCheckbox } from '../checkbox';
import { Toast } from '../toast';
import { createSharePointShortcutFromUrl, getSharePointFiles, updateSharePointFileShortcuts } from '@/utils/SharePointService';
import type { FolderExplorerFile } from './FolderExplorer';
import { ScrollView, Spinner } from 'tamagui';

function normalizePath(path: string): string {
  if (!path) return '';
  return path.replace(/^\/+|\/+$/g, '');
}

function generateShortcutNameFromFile(file: FolderExplorerFile): string {
  if (file.name) {
    // Remove file extension if present
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    return nameWithoutExt || file.name;
  }
  return 'Shortcut';
}

type FolderNode = {
  path: string;
  name: string;
  fullPath: string;
  children: FolderNode[];
  depth: number;
  hasUnloadedChildren?: boolean;
};

function buildFolderTree(folders: FolderExplorerFile[], loadedPaths: Set<string>): FolderNode[] {
  const sortedFolders = [...folders].sort((a, b) => a.path.localeCompare(b.path));
  const rootNodes: FolderNode[] = [];
  const nodeMap = new Map<string, FolderNode>();

  for (const folder of sortedFolders) {
    const fullPath = normalizePath(folder.path);
    const parts = fullPath.split('/');
    const name = parts[parts.length - 1] || fullPath;

    // Check if this folder might have children we haven't loaded yet
    const hasUnloadedChildren = !loadedPaths.has(fullPath);

    const node: FolderNode = {
      path: fullPath,
      name,
      fullPath,
      children: [],
      depth: parts.length - 1,
      hasUnloadedChildren,
    };
    nodeMap.set(fullPath, node);

    // Find parent
    const parentPath = parts.slice(0, -1).join('/');
    const parentNode = nodeMap.get(parentPath);

    if (parentNode) {
      parentNode.children.push(node);
    } else {
      rootNodes.push(node);
    }
  }

  return rootNodes;
}

type FolderItemProps = {
  node: FolderNode;
  selectedPaths: Set<string>;
  onToggle: (path: string) => void;
  expandedPaths: Set<string>;
  onToggleExpand: (path: string) => void;
  loadingPaths: Set<string>;
  level?: number;
};

function FolderItem({ node, selectedPaths, onToggle, expandedPaths, onToggleExpand, loadingPaths, level = 0 }: FolderItemProps) {
  const isChecked = selectedPaths.has(node.fullPath);
  const isExpanded = expandedPaths.has(node.fullPath);
  const isLoading = loadingPaths.has(node.fullPath);
  const hasChildren = node.children.length > 0;
  const canExpand = hasChildren || node.hasUnloadedChildren;

  const handleRowClick = useCallback((e: any) => {
    // Prevent triggering if clicking on the expand chevron
    e?.stopPropagation?.();
    onToggle(node.fullPath);
  }, [node.fullPath, onToggle]);

  const handleExpandClick = useCallback((e: any) => {
    e?.stopPropagation?.();
    onToggleExpand(node.fullPath);
  }, [node.fullPath, onToggleExpand]);

  // Calculate indentation: 24px per level
  const indentSize = level * 24;

  return (
    <IndiYStack>
      <IndiXStack
        alignItems="center"
        marginLeft={indentSize}
        py="0"
        gap="$2"
        hoverStyle={{ backgroundColor: '$backgroundHover' }}
        pressStyle={{ backgroundColor: '$backgroundPressed' }}
        borderRadius="$2"
        px="$2"
        cursor="pointer"
        onPress={handleRowClick}
      >
        {canExpand ? (
          <IndiXStack
            onPress={handleExpandClick}
            cursor="pointer"
            padding="$1"
            hoverStyle={{ backgroundColor: '$backgroundHover' }}
            borderRadius="$1"
            width={24}
            height={24}
            alignItems="center"
            justifyContent="center"
          >
            {isLoading ? (
              <Spinner size="small" color="$textSecondary" />
            ) : isExpanded ? (
              <ChevronDown size={16} color="$textSecondary" />
            ) : (
              <ChevronRight size={16} color="$textSecondary" />
            )}
          </IndiXStack>
        ) : (
          <IndiXStack width={24} />
        )}
        <IndiXStack pointerEvents="none">
          <IndiCheckbox
            checked={isChecked}
            onChange={() => {}}
            size={18}
          />
        </IndiXStack>
        <FolderOpen size={18} color="$textSecondary" />
        <IndiText fontSize="$3" flex={1} numberOfLines={1}>
          {node.name}
        </IndiText>
      </IndiXStack>
      {hasChildren && isExpanded && (
        <IndiYStack>
          {node.children.map((child) => (
            <FolderItem
              key={child.fullPath}
              node={child}
              selectedPaths={selectedPaths}
              onToggle={onToggle}
              expandedPaths={expandedPaths}
              onToggleExpand={onToggleExpand}
              loadingPaths={loadingPaths}
              level={level + 1}
            />
          ))}
        </IndiYStack>
      )}
    </IndiYStack>
  );
}

type CreateShortcutModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  sourceFile: FolderExplorerFile | null;
  availableFolders: FolderExplorerFile[];
  onShortcutsCreated: () => void;
  onFoldersLoaded?: (folders: FolderExplorerFile[]) => void;
};

export function CreateShortcutModal({
  isOpen,
  setIsOpen,
  sourceFile,
  availableFolders,
  onShortcutsCreated,
  onFoldersLoaded,
}: CreateShortcutModalProps) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [loadedPaths, setLoadedPaths] = useState<Set<string>>(new Set());
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [shortcutName, setShortcutName] = useState('');
  const [localFolders, setLocalFolders] = useState<FolderExplorerFile[]>([]);

  // Merge available folders with locally loaded folders
  const allFolders = [...availableFolders];
  for (const folder of localFolders) {
    if (!allFolders.some(f => normalizePath(f.path) === normalizePath(folder.path))) {
      allFolders.push(folder);
    }
  }

  // Build folder tree from all folders
  const folderTree = buildFolderTree(allFolders, loadedPaths);

  // Reset state when modal opens/closes or source file changes
  useEffect(() => {
    if (isOpen && sourceFile) {
      setShortcutName(generateShortcutNameFromFile(sourceFile));
      setSelectedPaths(new Set());
      setLocalFolders([]);
      // Mark initially available folder paths as loaded
      const initialLoadedPaths = new Set<string>();
      // Get unique parent paths from available folders
      const parentPaths = new Set<string>();
      availableFolders.forEach(f => {
        const parts = normalizePath(f.path).split('/');
        if (parts.length > 1) {
          parentPaths.add(parts.slice(0, -1).join('/'));
        }
      });
      parentPaths.forEach(p => initialLoadedPaths.add(p));
      setLoadedPaths(initialLoadedPaths);
      // Expand first level by default
      const firstLevelPaths = new Set(folderTree.map(node => node.fullPath));
      setExpandedPaths(firstLevelPaths);
    }
  }, [isOpen, sourceFile]);

  const MAX_SHORTCUTS = 5;

  const handleTogglePath = useCallback((path: string) => {
    setSelectedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        // Only allow adding if under the limit
        if (next.size < MAX_SHORTCUTS) {
          next.add(path);
        } else {
          Toast.error({ message: `Maximum ${MAX_SHORTCUTS} folders can be selected` });
          return prev;
        }
      }
      return next;
    });
  }, []);

  const fetchFolderContents = useCallback(async (folderPath: string) => {
    const normalizedPath = normalizePath(folderPath);
    
    // Already loaded or currently loading
    if (loadedPaths.has(normalizedPath) || loadingPaths.has(normalizedPath)) {
      return;
    }

    setLoadingPaths(prev => new Set([...prev, normalizedPath]));

    try {
      const files = await getSharePointFiles(normalizedPath);
      const folders = files
        .filter(f => f.isDirectory)
        .map(f => ({
          id: f.id || '',
          name: f.name || '',
          isDirectory: true,
          path: f.path || `${normalizedPath}/${f.name}`,
          updatedAt: f.lastModifiedDateTime,
        } as FolderExplorerFile));

      setLocalFolders(prev => {
        const updated = [...prev];
        for (const folder of folders) {
          if (!updated.some(f => normalizePath(f.path) === normalizePath(folder.path))) {
            updated.push(folder);
          }
        }
        return updated;
      });

      setLoadedPaths(prev => new Set([...prev, normalizedPath]));
      
      // Notify parent component about newly loaded folders
      if (onFoldersLoaded && folders.length > 0) {
        onFoldersLoaded(folders);
      }
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    } finally {
      setLoadingPaths(prev => {
        const next = new Set(prev);
        next.delete(normalizedPath);
        return next;
      });
    }
  }, [loadedPaths, loadingPaths, onFoldersLoaded]);

  const handleToggleExpand = useCallback((path: string) => {
    const normalizedPath = normalizePath(path);
    
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(normalizedPath)) {
        next.delete(normalizedPath);
      } else {
        next.add(normalizedPath);
        // Fetch contents when expanding if not already loaded
        if (!loadedPaths.has(normalizedPath)) {
          fetchFolderContents(normalizedPath);
        }
      }
      return next;
    });
  }, [loadedPaths, fetchFolderContents]);

  const handleDeselectAll = useCallback(() => {
    setSelectedPaths(new Set());
  }, []);

  const handleCreateShortcuts = useCallback(async () => {
    if (!sourceFile || !sourceFile.webUrl) {
      Toast.error({ message: 'No source file selected' });
      return;
    }

    if (selectedPaths.size === 0) {
      Toast.error({ message: 'Please select at least one folder' });
      return;
    }

    setIsCreating(true);
    const results: { path: string; success: boolean; error?: string }[] = [];

    // Use sourceId if source is a shortcut, otherwise use its listItemId
    const sourceIdForShortcut = sourceFile.sourceId || sourceFile.listItemId;

    for (const destinationPath of selectedPaths) {
      try {
        await createSharePointShortcutFromUrl(
          sourceFile.webUrl,
          shortcutName || generateShortcutNameFromFile(sourceFile),
          destinationPath,
          sourceIdForShortcut
        );
        results.push({ path: destinationPath, success: true });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create shortcut';
        results.push({ path: destinationPath, success: false, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    const successfulPaths = results.filter(r => r.success).map(r => r.path);

    if (successfulPaths.length > 0 && sourceFile.id) {
      try {
        await updateSharePointFileShortcuts(sourceFile.id, successfulPaths);
      } catch {
        // Continue even if updating Shortcuts property fails
      }
    }

    setIsCreating(false);

    if (failureCount === 0) {
      Toast.success({ 
        message: `Successfully created ${successCount} shortcut${successCount > 1 ? 's' : ''}` 
      });
      setIsOpen(false);
      setSelectedPaths(new Set());
      onShortcutsCreated();
    } else if (successCount > 0) {
      Toast.warning({ 
        message: `Created ${successCount} shortcut${successCount > 1 ? 's' : ''}, ${failureCount} failed` 
      });
      onShortcutsCreated();
    } else {
      Toast.error({ 
        message: `Failed to create shortcuts: ${results[0]?.error || 'Unknown error'}` 
      });
    }
  }, [sourceFile, selectedPaths, shortcutName, setIsOpen, onShortcutsCreated]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedPaths(new Set());
  }, [setIsOpen]);

  const footerComponent = (
    <IndiYStack px="$6" borderTopWidth={1} borderTopColor="$border">
      <IndiXStack py="$4" gap="$2" justifyContent="flex-end">
        <IndiButton
          text="Cancel"
          type="outline"
          color="secondary"
          size="md"
          handlePress={handleClose}
        />
        <IndiButton
          text={`Add shortcut${selectedPaths.size > 1 ? 's' : ''} (${selectedPaths.size})`}
          type="solid"
          color="primary"
          size="md"
          loading={isCreating}
          disabled={isCreating || selectedPaths.size === 0}
          handlePress={handleCreateShortcuts}
        />
      </IndiXStack>
    </IndiYStack>
  );

  if (!sourceFile) {
    return null;
  }

  return (
    <IndiModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Shortcuts"
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
        {/* Source file info */}
        <IndiYStack 
          backgroundColor="$backgroundSecondary" 
          borderRadius="$2"
        >
          <IndiXStack alignItems="center">
            <IndiText fontSize="$2">
              Creating shortcut for: {sourceFile.name}
            </IndiText>
          </IndiXStack>
        </IndiYStack>

        {/* Folder selection */}
        <IndiYStack gap="$2">
          <IndiXStack justifyContent="space-between" alignItems="center">
            <IndiText fontSize="$3" fontWeight="500">
              Select destination folders (max {MAX_SHORTCUTS}):
            </IndiText>
            <IndiButton
              text="Deselect All"
              type="ghost"
              color="secondary"
              size="sm"
              handlePress={handleDeselectAll}
            />
          </IndiXStack>
          
          <ScrollView 
            maxHeight={350} 
            showsVerticalScrollIndicator={true}
            borderWidth={1}
            borderColor="$border"
            borderRadius="$2"
            padding="$2"
          >
            {folderTree.length === 0 ? (
              <IndiYStack padding="$4" alignItems="center">
                <IndiText color="$textSecondary">No folders available</IndiText>
              </IndiYStack>
            ) : (
              <IndiYStack gap="$1">
                {folderTree.map((node) => (
                  <FolderItem
                    key={node.fullPath}
                    node={node}
                    selectedPaths={selectedPaths}
                    onToggle={handleTogglePath}
                    expandedPaths={expandedPaths}
                    onToggleExpand={handleToggleExpand}
                    loadingPaths={loadingPaths}
                  />
                ))}
              </IndiYStack>
            )}
          </ScrollView>
        </IndiYStack>

        {/* Selection count */}
        <IndiText fontSize="$2" color={selectedPaths.size >= MAX_SHORTCUTS ? '$warning' : '$textSecondary'}>
          {selectedPaths.size} of {MAX_SHORTCUTS} folder{selectedPaths.size !== 1 ? 's' : ''} selected
        </IndiText>
      </IndiYStack>
    </IndiModal>
  );
}
