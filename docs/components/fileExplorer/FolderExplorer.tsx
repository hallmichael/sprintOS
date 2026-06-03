import { FileManager } from '@/components/fileManager';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  getSharePointFiles,
  getSharePointFileDownloadUrl,
  renameSharePointItemById,
  archiveSharePointItemById,
  supersedeSharePointItemById,
  restoreSharePointItemById,
  checkOutSharePointItemById,
  checkInSharePointItemById,
  deleteSharePointItemById,
  createSharePointFolder,
  uploadFileToSharePoint,
  copySharePointItem,
  moveSharePointItem,
  getSharePointItemByWebUrl,
  getSharePointItemByListItemId,
} from '@/utils/SharePointService';
import colors from '@/themes/colors';
import { IndiSelect } from '@/components/selects/base';
import { IndiInput } from '@/components/inputs/base';
import { IndiParagraph, IndiText } from '../text';
import { IndiYStack, IndiXStack } from '../views';
import { IndiButton } from '../buttons';
import { LuSearch, LuX } from 'react-icons/lu';
import { Toast } from '../toast';
import { FilePreviewComponent } from './FolderExplorerPreview';
import apolloClient from '@/graphql/apolloClient';
import type { ProjectService } from '@/graphql/graphql';

import type { FolderExplorerFile, FolderExplorerProps } from './FolderExplorer.types';
import {
  SETUP_SHAREPOINT_PROJECT_QUERY,
  DEEP_LOAD_MAX_DEPTH,
  FOLDER_EXPLORER_STYLES,
} from './FolderExplorer.constants';
import {
  normalizePath,
  getParentPath,
  ensureLeadingSlash,
  removeLeadingSlash,
  escapeHtml,
  hideAllPortalTooltips,
  convertSharePointToExplorerFile,
  resolveProjectServiceNames,
  resolveProjectServiceDetailsWithTypes,
  isSharePointPathUnderRoot,
} from './FolderExplorer.utils';
import { useAppDispatch } from '@/redux/app/selectors';
import {
  clearFolderExplorerPathForProject,
  setFolderExplorerPathForProject,
} from '@/redux/app/reducer';
import { getState } from '@/redux/utils';

export type { FolderExplorerFile, ProjectServiceDetailItem } from './FolderExplorer.types';

export function FolderExplorer({
  files: propFiles,
  onFileOpen,
  acceptedFileTypes,
  showUpload = true,
  showCreateFolder = true,
  onUpload,
  onCreateFolder,
  useSharePoint = true,
  folderPath = '',
  projectId,
  onSelectionChange: externalOnSelectionChange,
  projectServices,
  projectServiceInstallationCertificates,
  projectServiceChecklistItems,
  customStyles,
}: FolderExplorerProps) {
  const dispatch = useAppDispatch();

  // Maintain full file tree for FileManager navigation
  const [allFiles, setAllFiles] = useState<FolderExplorerFile[]>(propFiles || []);
  const [loading, setLoading] = useState(useSharePoint);
  const [error, setError] = useState<string | null>(null);
  const [isFolderNotFound, setIsFolderNotFound] = useState(false);
  const [loadedPaths, setLoadedPaths] = useState<Set<string>>(new Set());
  const [loadingFolder, setLoadingFolder] = useState<string | null>(null);
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  // Store file and parent folder for upload
  const uploadQueueRef = useRef<Array<{ file: any; parentFolder: FolderExplorerFile }>>([]);
  // Track current folder path for refresh
  const [currentFolderPath, setCurrentFolderPath] = useState<string>(normalizePath(folderPath || ''));
  // Track copied/cut files for paste operation
  const [copiedFiles, setCopiedFiles] = useState<FolderExplorerFile[]>([]);
  const [isCutOperation, setIsCutOperation] = useState<boolean>(false);
  // Track selected file for preview modal
  const [selectedFile, setSelectedFile] = useState<FolderExplorerFile | null>(null);
  // Track FileManager selection state
  const [hasSelectedItems, setHasSelectedItems] = useState(false);
  // Ref to FileManager for programmatic navigation
  const fileManagerRef = useRef<any>(null);
  const restoreAfterInitialLoadRef = useRef(false);
  const [persistedFolderInitialPath, setPersistedFolderInitialPath] = useState<string | null>(null);
  const [fileManagerRemountKey, setFileManagerRemountKey] = useState(0);
  const [persistNavigationReady, setPersistNavigationReady] = useState(() => !useSharePoint);
  // Get location query parameter
  const params = useLocalSearchParams<{ location?: string }>();
  const locationParam = params.location ? decodeURIComponent(params.location) : null;
  // Track if we've already navigated to location
  const hasNavigatedToLocationRef = useRef(false);
  const locationRetryCountRef = useRef(0);
  const previousLocationRef = useRef<string | null>(null);

  // Reset navigation flag when location parameter changes
  useEffect(() => {
    if (previousLocationRef.current !== locationParam) {
      hasNavigatedToLocationRef.current = false;
      locationRetryCountRef.current = 0;
      previousLocationRef.current = locationParam;
    }
  }, [locationParam]);

  useEffect(() => {
    restoreAfterInitialLoadRef.current = false;
    setPersistedFolderInitialPath(null);
    setFileManagerRemountKey(0);
    setPersistNavigationReady(!useSharePoint);
  }, [projectId, folderPath, useSharePoint]);

  // Handle FileManager selection changes
  const handleSelectionChange = useCallback(
    (selectedFiles: any[]) => {
      setHasSelectedItems(selectedFiles && selectedFiles.length > 0);

      // Convert to FolderExplorerFile format and call external callback
      if (externalOnSelectionChange) {
        const explorerFiles = (selectedFiles || []).map((file: any) => {
          // Find the corresponding file in allFiles or validFiles
          const matchingFile = allFiles.find(f => f.id === file.id || f.path === file.path);
          if (matchingFile) {
            return matchingFile;
          }
          // Create a basic FolderExplorerFile from the selected file
          return {
            id: file.id || '',
            name: file.name || '',
            isDirectory: file.isDirectory || false,
            path: file.path || '',
            webUrl: file.webUrl,
            downloadableUrl: file.downloadableUrl,
            listItemId: file.listItemId,
          } as FolderExplorerFile;
        });
        externalOnSelectionChange(explorerFiles);
      }
    },
    [externalOnSelectionChange, allFiles],
  );
  // Fetch initial files from SharePoint
  useEffect(() => {
    if (useSharePoint) {
      const fetchInitialFiles = async () => {
        try {
          setLoading(true);
          setError(null);
          const sharePointFiles = await getSharePointFiles(folderPath);
          const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

          setAllFiles(explorerFiles);
          setLoadedPaths(new Set([folderPath || '/']));
          setCurrentFolderPath(normalizePath(folderPath || ''));
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load files from SharePoint';
          const is404 = (err as any)?.isFolderNotFound || (err instanceof Error && err.message.includes('404'));
          if (is404) {
            setIsFolderNotFound(true);
            setError('Folder not found. The documents folder has not been created yet.');
          } else {
            setError(errorMessage);
            setIsFolderNotFound(false);
          }
          console.error('Error fetching SharePoint files:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialFiles();
    } else if (propFiles) {
      setAllFiles(propFiles);
    }
  }, [useSharePoint, folderPath, propFiles]);

  const fetchFolderContents = useCallback(
    async (
      folderPathToLoad: string,
      forceRefresh: boolean = false,
      isBackgroundLoad: boolean = false,
      rethrowOnError: boolean = false,
    ) => {
      const normalizedPath = normalizePath(folderPathToLoad);
      const pathKey = normalizedPath || '/';

      if (!forceRefresh && loadedPaths.has(pathKey)) {
        return;
      }

      try {
        // Only show loading indicator for user-initiated navigation, not background loading
        if (!isBackgroundLoad) {
          setLoadingFolder(folderPathToLoad);
        }
        setError(null);

        const sharePointFiles = await getSharePointFiles(normalizedPath);
        const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

        setAllFiles(prevFiles => {
          const existingFilesMap = new Map(prevFiles.map(f => [f.path, f]));
          const updatedFiles: FolderExplorerFile[] = [];

          for (const newFile of explorerFiles) {
            updatedFiles.push(newFile);
          }

          const currentFolderFiles = new Set(explorerFiles.map(f => f.path));
          const otherFolderFiles = prevFiles.filter(f => !currentFolderFiles.has(f.path));

          return [...otherFolderFiles, ...updatedFiles];
        });

        setLoadedPaths(prev => new Set([...prev, pathKey]));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load folder contents';
        const is404 = (err as any)?.isFolderNotFound || (err instanceof Error && err.message.includes('404'));
        if (is404) {
          setIsFolderNotFound(true);
          setError('Folder not found. The documents folder has not been created yet.');
        } else {
          setError(errorMessage);
          setIsFolderNotFound(false);
        }
        console.error('Error fetching folder contents:', err);
        if (rethrowOnError) {
          throw err;
        }
      } finally {
        if (!isBackgroundLoad) {
          setLoadingFolder(null);
        }
      }
    },
    [loadedPaths],
  );

  const fetchFolderContentsLatestRef = useRef(fetchFolderContents);
  fetchFolderContentsLatestRef.current = fetchFolderContents;

  useEffect(() => {
    if (!useSharePoint) {
      setPersistNavigationReady(true);
      return;
    }
    if (loading) return;
    if (error) {
      setPersistNavigationReady(true);
      return;
    }

    if (restoreAfterInitialLoadRef.current) {
      return;
    }

    restoreAfterInitialLoadRef.current = true;

    const run = async () => {
      if (!projectId || locationParam) {
        setPersistNavigationReady(true);
        return;
      }
      const root = normalizePath(folderPath || '');
      const cached = getState()?.app?.folderExplorerPathsByProjectId?.[projectId];
      const cachedNorm = cached ? normalizePath(cached) : '';
      if (!cached || cachedNorm === root || !isSharePointPathUnderRoot(cachedNorm, root)) {
        setPersistNavigationReady(true);
        return;
      }
      try {
        await fetchFolderContentsLatestRef.current(cachedNorm, false, false, true);
        setPersistedFolderInitialPath(ensureLeadingSlash(cachedNorm));
        setCurrentFolderPath(cachedNorm);
        setFileManagerRemountKey(k => k + 1);
      } catch {
        dispatch(clearFolderExplorerPathForProject(projectId));
      } finally {
        setPersistNavigationReady(true);
      }
    };

    void run();
  }, [useSharePoint, loading, error, projectId, locationParam, folderPath, dispatch]);

  // Preload folder contents up to DEEP_LOAD_MAX_DEPTH levels using parallel BFS
  const deepLoadingRef = useRef(false);
  const loadingPathsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!useSharePoint || loading || deepLoadingRef.current) return;

    const initialPath = normalizePath(folderPath || '');
    const initialPathKey = initialPath || '/';

    if (!loadedPaths.has(initialPathKey)) return;

    deepLoadingRef.current = true;

    const loadAllLevels = async () => {
      let currentDepth = 0;
      let pathsToProcess = [initialPath];

      while (currentDepth < DEEP_LOAD_MAX_DEPTH && pathsToProcess.length > 0) {
        const currentFiles = allFiles;
        const currentLoadedPaths = new Set(loadedPaths);
        const dirsToLoad: string[] = [];

        for (const parentPath of pathsToProcess) {
          const normalizedParentPath = normalizePath(parentPath);
          const childDirs = currentFiles.filter(file => {
            if (!file.isDirectory) return false;
            const filePath = normalizePath(removeLeadingSlash(file.path));
            const fileParentPath = getParentPath(filePath);
            return normalizePath(fileParentPath) === normalizedParentPath;
          });

          for (const dir of childDirs) {
            const dirPath = removeLeadingSlash(dir.path);
            const dirPathKey = normalizePath(dirPath) || '/';

            if (currentLoadedPaths.has(dirPathKey) || loadingPathsRef.current.has(dirPathKey)) {
              continue;
            }

            dirsToLoad.push(dirPath);
            loadingPathsRef.current.add(dirPathKey);
          }
        }

        if (dirsToLoad.length === 0) {
          pathsToProcess = currentFiles
            .filter(file => {
              if (!file.isDirectory) return false;
              const filePath = normalizePath(removeLeadingSlash(file.path));
              const fileParentPath = getParentPath(filePath);
              return pathsToProcess.some(p => normalizePath(p) === normalizePath(fileParentPath));
            })
            .map(dir => removeLeadingSlash(dir.path));
          currentDepth++;
          continue;
        }

        const loadPromises = dirsToLoad.map(async dirPath => {
          try {
            await fetchFolderContents(dirPath, false, true);
          } catch {
            // Silently continue on error
          }
        });

        await Promise.allSettled(loadPromises);

        for (const dirPath of dirsToLoad) {
          loadingPathsRef.current.delete(normalizePath(dirPath) || '/');
        }

        pathsToProcess = dirsToLoad;
        currentDepth++;
      }

      deepLoadingRef.current = false;
    };

    loadAllLevels();
  }, [useSharePoint, loading, loadedPaths, folderPath, fetchFolderContents, allFiles]);

  // Handle location parameter - navigate to directory and select file
  useEffect(() => {
    if (!locationParam || !useSharePoint || loading || hasNavigatedToLocationRef.current) {
      return;
    }

    // Wait for initial files to be loaded
    const initialPathKey = normalizePath(folderPath || '') || '/';
    if (!loadedPaths.has(initialPathKey)) {
      return;
    }

    const navigateToLocation = async () => {
      try {
        // Extract parent directory from location path
        const locationPath = normalizePath(locationParam);
        const parentPath = getParentPath(locationPath);
        const fileName = locationPath.split('/').pop() || '';

        // If the location is in a different directory, navigate there
        if (parentPath && normalizePath(parentPath) !== normalizePath(currentFolderPath)) {
          // Fetch the parent directory contents if not already loaded
          const parentPathKey = normalizePath(parentPath) || '/';
          if (!loadedPaths.has(parentPathKey)) {
            await fetchFolderContents(parentPath, false, false);
          }

          // Update current folder path
          setCurrentFolderPath(normalizePath(parentPath));

          // Wait for FileManager to update after navigation
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Find the file in allFiles (search again after potential navigation and file loading)
        const findAndSelectFile = () => {
          const targetFile = allFiles.find(file => {
            const filePath = normalizePath(removeLeadingSlash(file.path));
            return (
              filePath === locationPath ||
              (file.name === fileName &&
                !file.isDirectory &&
                normalizePath(getParentPath(removeLeadingSlash(file.path))) === normalizePath(parentPath))
            );
          });

          if (targetFile && !targetFile.isDirectory) {
            // Wait for FileManager to render, then select the file
            const attemptSelection = () => {
              // Try multiple selectors to find the file element
              // Based on FileManager structure, files have class 'file-item-container' and data-custom-tooltip
              const selectors = [
                `.file-item-container[data-custom-tooltip="${targetFile.name}"]`,
                `.file-item-container[title="${targetFile.name}"]`,
                `[data-file-id="${targetFile.id}"]`,
                `[title="${targetFile.name}"]`,
              ];

              let fileElement: HTMLElement | null = null;
              for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of Array.from(elements)) {
                  const htmlEl = el as HTMLElement;
                  // Verify it's the right file by checking the name
                  const nameEl = htmlEl.querySelector('.file-name');
                  const elementName =
                    nameEl?.textContent?.trim() ||
                    htmlEl.getAttribute('title') ||
                    htmlEl.getAttribute('data-custom-tooltip') ||
                    '';
                  if (elementName === targetFile.name) {
                    // Make sure it's visible
                    const rect = htmlEl.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                      fileElement = htmlEl;
                      break;
                    }
                  }
                }
                if (fileElement) break;
              }

              if (fileElement) {
                // Mark as navigating immediately to prevent multiple attempts
                hasNavigatedToLocationRef.current = true;

                // Check if already selected to avoid blinking
                const isAlreadySelected =
                  fileElement.classList.contains('file-selected') ||
                  fileElement.classList.contains('selected') ||
                  fileElement.getAttribute('aria-selected') === 'true';

                if (isAlreadySelected) {
                  // Already selected, just sync state and return
                  handleSelectionChange([targetFile]);
                  locationRetryCountRef.current = 0;
                  return;
                }

                // Scroll into view first
                fileElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Wait for scroll, then select using Ctrl+Click (selects without opening)
                // Use a single timeout to prevent multiple attempts
                setTimeout(() => {
                  // Check one more time if it got selected during scroll
                  const nowSelected =
                    fileElement!.classList.contains('file-selected') ||
                    fileElement!.classList.contains('selected') ||
                    fileElement!.getAttribute('aria-selected') === 'true';

                  if (nowSelected) {
                    // Already selected, just sync state
                    handleSelectionChange([targetFile]);
                    locationRetryCountRef.current = 0;
                    return;
                  }

                  // Try to find a checkbox first (if FileManager uses checkboxes for selection)
                  const checkbox = fileElement!.querySelector('input[type="checkbox"]') as HTMLInputElement;

                  if (checkbox && !checkbox.checked) {
                    // Click the checkbox to select without opening
                    checkbox.click();
                  } else if (!checkbox) {
                    // Use Ctrl+Click to select without opening the preview
                    // Only if not already selected
                    const ctrlClickEvent = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true,
                      button: 0,
                      ctrlKey: true, // Ctrl+Click selects without opening
                    });

                    // Dispatch Ctrl+Click event once
                    fileElement!.dispatchEvent(ctrlClickEvent);
                  }

                  // Sync state after a short delay (only once)
                  setTimeout(() => {
                    handleSelectionChange([targetFile]);
                    locationRetryCountRef.current = 0;
                  }, 150);
                }, 400);
              } else {
                // If file element not found, try again after a short delay (max 5 attempts)
                if (locationRetryCountRef.current < 5) {
                  locationRetryCountRef.current++;
                  setTimeout(attemptSelection, 500);
                } else {
                  hasNavigatedToLocationRef.current = true;
                  locationRetryCountRef.current = 0;
                }
              }
            };

            // Start attempting selection after a delay to ensure DOM is ready
            setTimeout(attemptSelection, 800);
          } else {
            // File not found yet, wait a bit and try again (max 5 attempts)
            if (locationRetryCountRef.current < 5) {
              locationRetryCountRef.current++;
              setTimeout(findAndSelectFile, 500);
            } else {
              hasNavigatedToLocationRef.current = true;
              locationRetryCountRef.current = 0;
            }
          }
        };

        // Start finding and selecting the file
        findAndSelectFile();
      } catch (error) {
        console.error('Error navigating to location:', error);
        hasNavigatedToLocationRef.current = true;
      }
    };

    navigateToLocation();
  }, [
    locationParam,
    useSharePoint,
    loading,
    loadedPaths,
    folderPath,
    currentFolderPath,
    allFiles,
    fetchFolderContents,
    handleSelectionChange,
  ]);

  // Intercept fetch requests to capture file uploads to SharePoint
  useEffect(() => {
    if (!useSharePoint) return;

    const originalFetch = window.fetch;
    window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;

      // Check if this is a file upload request to our dummy URL
      if (typeof url === 'string' && url.startsWith('data:text/plain,')) {
        // This is our file upload - extract file from FormData
        if (init?.body instanceof FormData) {
          const formData = init.body as FormData;
          const file = formData.get('file') as File;
          const parentFolder = uploadQueueRef.current[0]?.parentFolder;

          if (file instanceof File && parentFolder?.path) {
            const parentPath = removeLeadingSlash(parentFolder.path);
            setLoadingFolder(parentPath);

            uploadFileToSharePoint(file, parentPath)
              .then(sharePointFile => {
                const explorerFile = convertSharePointToExplorerFile(sharePointFile);
                setAllFiles(prevFiles => [...prevFiles, explorerFile]);

                setLoadedPaths(prev => {
                  const updated = new Set(prev);
                  updated.delete(parentPath || '/');
                  return updated;
                });

                return fetchFolderContents(parentPath);
              })
              .catch(error => {
                const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
                setError(errorMessage);
                console.error('Error uploading file to SharePoint:', error);
              })
              .finally(() => {
                setLoadingFolder(null);
                uploadQueueRef.current.shift();
              });

            return Promise.resolve(
              new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [useSharePoint, fetchFolderContents]);

  const parseUrlFile = useCallback(async (file: FolderExplorerFile): Promise<string | null> => {
    if (!file.downloadableUrl) {
      return null;
    }

    try {
      const response = await fetch(file.downloadableUrl);
      if (!response.ok) {
        throw new Error(`Failed to download .url file: ${response.status}`);
      }

      const text = await response.text();
      const urlMatch = text.match(/URL=(.+)/i);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1].trim();
      }

      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);
      for (const line of lines) {
        if (line.startsWith('http://') || line.startsWith('https://')) {
          return line;
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing .url file:', error);
      return null;
    }
  }, []);

  const findFileByUrl = useCallback(
    (targetUrl: string): FolderExplorerFile | null => {
      let found = allFiles.find(f => f.webUrl === targetUrl);
      if (found) return found;

      const targetUrlBase = targetUrl.split('?')[0].split('#')[0];
      found = allFiles.find(f => {
        if (!f.webUrl) return false;
        const fileUrlBase = f.webUrl.split('?')[0].split('#')[0];
        return fileUrlBase === targetUrlBase;
      });

      return found || null;
    },
    [allFiles],
  );

  const handleFileOpen = useCallback(
    async (file: FolderExplorerFile) => {
      // Hide hover tooltip immediately when opening a folder so it doesn't persist after list updates
      if (file.isDirectory) hideAllPortalTooltips();

      // Check if file is disabled (check both the passed file and original)
      if ((file as any).disabled) {
        Toast.error({ message: 'This file cannot be opened' });
        return;
      }
      const originalFile = allFiles.find(f => f.id === file.id);
      if (originalFile?.disabled) {
        Toast.error({ message: 'This file cannot be opened' });
        return;
      }

      if (file.isDirectory && useSharePoint && file.path) {
        const pathToLoad = removeLeadingSlash(file.path);
        await fetchFolderContents(pathToLoad);
      } else if (!file.isDirectory) {
        if (file.sourceId && useSharePoint) {
          try {
            const sourceSharePointFile = await getSharePointItemByListItemId(file.sourceId);
            if (sourceSharePointFile) {
              const sourceFile = convertSharePointToExplorerFile(sourceSharePointFile);
              setAllFiles(prevFiles => {
                const exists = prevFiles.some(f => f.id === sourceFile.id);
                if (!exists) {
                  return [...prevFiles, sourceFile];
                }
                return prevFiles;
              });

              if (sourceFile.webUrl) {
                setSelectedFile(sourceFile);
                return;
              }
            }
          } catch (error) {
            // Silently fail - fallback to other methods
          }
        }

        if (file.source && useSharePoint) {
          try {
            let sourceFile: FolderExplorerFile | null = findFileByUrl(file.source);

            if (!sourceFile) {
              try {
                const sharePointFile = await getSharePointItemByWebUrl(file.source);
                if (sharePointFile) {
                  sourceFile = convertSharePointToExplorerFile(sharePointFile);
                  setAllFiles(prevFiles => {
                    const exists = prevFiles.some(f => f.id === sourceFile?.id);
                    if (!exists && sourceFile) {
                      return [...prevFiles, sourceFile];
                    }
                    return prevFiles;
                  });
                }
              } catch (error) {
                // Silently fail - will try opening original file
              }
            }

            if (sourceFile && sourceFile.webUrl) {
              setSelectedFile(sourceFile);
              return;
            }
          } catch (error) {
            console.error('Error opening source file:', error);
          }
        }

        const isUrlFile = file.name?.toLowerCase().endsWith('.url');

        if (isUrlFile && useSharePoint) {
          const targetUrl = await parseUrlFile(file);

          if (targetUrl) {
            let targetFile = findFileByUrl(targetUrl);

            if (!targetFile) {
              try {
                const sharePointFile = await getSharePointItemByWebUrl(targetUrl);
                if (sharePointFile) {
                  targetFile = convertSharePointToExplorerFile(sharePointFile);
                  setAllFiles(prevFiles => {
                    const exists = prevFiles.some(f => f.id === targetFile?.id);
                    if (!exists && targetFile) {
                      return [...prevFiles, targetFile];
                    }
                    return prevFiles;
                  });
                }
              } catch (error) {
                console.error('Error fetching file from SharePoint by webUrl:', error);
              }
            }

            if (targetFile && targetFile.webUrl) {
              setSelectedFile(targetFile);
            } else {
              const errorMessage = `Could not find the file linked by ${file.name}`;
              setError(errorMessage);
              console.error(errorMessage, { targetUrl });
            }
          } else {
            if (file.webUrl) {
              setSelectedFile(file);
            }
          }
        } else if (file.webUrl) {
          setSelectedFile(file);
        }
      }
    },
    [useSharePoint, fetchFolderContents, parseUrlFile, findFileByUrl, allFiles],
  );

  const handleFileRename = useCallback(
    async (file: FolderExplorerFile, newName?: string): Promise<void> => {
      if (!useSharePoint) return;

      if (newName === undefined || newName === null || newName === '') {
        if ((file as any).isCheckedOut) {
          return Promise.reject(new Error('File is checked out'));
        }
        const originalFile = allFiles.find(f => f.id === file.id);
        if (originalFile?.isCheckedOut) {
          return Promise.reject(new Error('File is checked out'));
        }
        return Promise.resolve();
      }

      // Check if file is checked out
      if ((file as any).isCheckedOut) {
        Toast.error({ message: 'This file cannot be renamed' });
        return;
      }
      const originalFile = allFiles.find(f => f.id === file.id);
      if (originalFile?.isCheckedOut) {
        Toast.error({ message: 'This file cannot be renamed' });
        return;
      }

      if (!file?.id || !file?.path) {
        Toast.error({ message: 'Cannot rename: missing file information' });
        return;
      }

      if (typeof newName !== 'string' || newName.trim() === '') {
        Toast.error({ message: 'Cannot rename: new name is required' });
        return;
      }

      const originalPath = removeLeadingSlash(file.path);
      const parentPath = getParentPath(originalPath);
      const currentFolderPath = parentPath || folderPath || '';
      const currentFolderPathKey = normalizePath(currentFolderPath) || '/';

      try {
        setLoadingFolder(currentFolderPath);
        const renamedItem = await renameSharePointItemById(file.id, newName.trim());

        const newPath = parentPath ? `/${parentPath}/${newName.trim()}` : `/${newName.trim()}`;
        const explorerFile: FolderExplorerFile = {
          ...convertSharePointToExplorerFile(renamedItem),
          path: newPath,
        };

        setAllFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? explorerFile : f)));

        if (file.isDirectory) {
          const oldPath = originalPath;
          const newFolderPath = removeLeadingSlash(newPath);

          setAllFiles(prevFiles =>
            prevFiles.map(f => {
              if (f.path && file.path && f.path.startsWith(file.path + '/')) {
                const relativePath = f.path.substring(file.path.length);
                return { ...f, path: explorerFile.path + relativePath };
              }
              return f;
            }),
          );

          setLoadedPaths(prev => {
            const updated = new Set(prev);
            updated.delete(oldPath);
            updated.add(newFolderPath);
            return updated;
          });
        }

        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentFolderPathKey);
          return updated;
        });

        await fetchFolderContents(currentFolderPath, true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to rename item';
        setError(errorMessage);
        console.error('Error renaming SharePoint item:', error);
        Toast.error({ message: errorMessage });
        throw error;
      } finally {
        setLoadingFolder(null);
      }
    },
    [useSharePoint, fetchFolderContents, folderPath, allFiles],
  );

  const handleFileDelete = useCallback(
    async (files: FolderExplorerFile[]) => {
      if (!useSharePoint) return;

      const archivedFiles: FolderExplorerFile[] = [];
      const errors: string[] = [];

      for (const file of files) {
        if ((file as any).isCheckedOut) {
          Toast.error({ message: `Cannot delete: ${file.name} is checked out` });
          continue;
        }
        const originalFile = allFiles.find(f => f.id === file.id);
        if (originalFile?.isCheckedOut) {
          Toast.error({ message: `Cannot delete: ${file.name} is checked out` });
          continue;
        }

        if (!file.id) continue;

        try {
          const archivedFile = await archiveSharePointItemById(file.id);
          const explorerFile = convertSharePointToExplorerFile(archivedFile);
          archivedFiles.push(explorerFile);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to archive item';
          errors.push(`${file.name}: ${errorMessage}`);
          console.error('Error archiving SharePoint item:', error);
        }
      }

      // Update all archived files in allFiles at once
      if (archivedFiles.length > 0) {
        setAllFiles(prevFiles => {
          const updatedFiles = new Map(prevFiles.map(f => [f.id, f]));
          archivedFiles.forEach(archivedFile => {
            updatedFiles.set(archivedFile.id, archivedFile);
          });
          return Array.from(updatedFiles.values());
        });
      }

      // Show success/error messages
      if (archivedFiles.length > 0) {
        const fileNames = archivedFiles.map(f => f.name).join(', ');
        Toast.success({
          message:
            archivedFiles.length === 1
              ? `${fileNames} has been archived`
              : `${archivedFiles.length} files have been archived`,
        });
      }
      if (errors.length > 0) {
        errors.forEach(error => Toast.error({ message: error }));
      }

      // Refresh the current folder after all files are processed
      if (archivedFiles.length > 0) {
        const currentPathKey = normalizePath(currentFolderPath) || '/';
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentPathKey);
          return updated;
        });

        // Force refresh by clearing the loaded path and fetching again
        await fetchFolderContents(currentFolderPath, true);
      }
    },
    [useSharePoint, allFiles, currentFolderPath, fetchFolderContents],
  );

  const handleFileSupersede = useCallback(
    async (file: FolderExplorerFile): Promise<void> => {
      if (!useSharePoint) return;

      if (!file.id) {
        Toast.error({ message: 'Cannot supersede: File ID is missing' });
        return;
      }

      try {
        const supersededFile = await supersedeSharePointItemById(file.id);
        const explorerFile = convertSharePointToExplorerFile(supersededFile);

        // Update the file in state
        setAllFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? explorerFile : f)));

        Toast.success({ message: `${file.name} has been superseded` });

        // Close the previewer
        setSelectedFile(null);

        // Trigger a refresh to ensure the list is fully updated
        const currentPathKey = normalizePath(currentFolderPath) || '/';
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentPathKey);
          return updated;
        });
        await fetchFolderContents(currentFolderPath, true); // Force refresh
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to supersede item';
        // Check if it's a locked resource error (423) - only show toast, don't set error state
        const isLockedError =
          errorMessage.includes('423') || errorMessage.includes('resourceLocked') || errorMessage.includes('locked');
        if (!isLockedError) {
          setError(errorMessage);
        }
        console.error('Error superseding SharePoint item:', error);
        Toast.error({ message: isLockedError ? 'File is currently locked. Please try again later.' : errorMessage });
      }
    },
    [useSharePoint, currentFolderPath, fetchFolderContents],
  );

  const handleFileRestore = useCallback(
    async (file: FolderExplorerFile): Promise<void> => {
      if (!useSharePoint) return;

      if (!file.id) {
        Toast.error({ message: 'Cannot restore: File ID is missing' });
        return;
      }

      try {
        const restoredFile = await restoreSharePointItemById(file.id);
        const explorerFile = convertSharePointToExplorerFile(restoredFile);

        // Update the file in state
        setAllFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? explorerFile : f)));

        Toast.success({ message: `${file.name} has been restored` });

        // Close the previewer
        setSelectedFile(null);

        // Trigger a refresh to ensure the list is fully updated
        const currentPathKey = normalizePath(currentFolderPath) || '/';
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentPathKey);
          return updated;
        });
        await fetchFolderContents(currentFolderPath, true); // Force refresh
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to restore item';
        // Check if it's a locked resource error (423) - only show toast, don't set error state
        const isLockedError =
          errorMessage.includes('423') || errorMessage.includes('resourceLocked') || errorMessage.includes('locked');
        if (!isLockedError) {
          setError(errorMessage);
        }
        console.error('Error restoring SharePoint item:', error);
        Toast.error({ message: isLockedError ? 'File is currently locked. Please try again later.' : errorMessage });
      }
    },
    [useSharePoint, currentFolderPath, fetchFolderContents],
  );

  const handleFileCheckOut = useCallback(
    async (file: FolderExplorerFile): Promise<void> => {
      if (!useSharePoint) return;

      if (!file.id) {
        Toast.error({ message: 'Cannot check out: File ID is missing' });
        return;
      }

      if (file.isCheckedOut) {
        Toast.error({ message: 'File is already checked out' });
        return;
      }

      try {
        const checkedOutFile = await checkOutSharePointItemById(file.id);
        const explorerFile = convertSharePointToExplorerFile(checkedOutFile);

        // Update the file in state
        setAllFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? explorerFile : f)));

        // Update selected file if it's the same file
        if (selectedFile?.id === file.id) {
          setSelectedFile(explorerFile);
        }

        Toast.success({ message: `${file.name} has been checked out` });

        // Trigger a refresh to ensure the list is fully updated
        const currentPathKey = normalizePath(currentFolderPath) || '/';
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentPathKey);
          return updated;
        });
        await fetchFolderContents(currentFolderPath, true); // Force refresh
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to check out item';
        // Check if it's a locked resource error (423) - only show toast, don't set error state
        const isLockedError =
          errorMessage.includes('423') || errorMessage.includes('resourceLocked') || errorMessage.includes('locked');
        if (!isLockedError) {
          setError(errorMessage);
        }
        console.error('Error checking out SharePoint item:', error);
        Toast.error({ message: isLockedError ? 'File is currently locked. Please try again later.' : errorMessage });
      }
    },
    [useSharePoint, currentFolderPath, fetchFolderContents, selectedFile],
  );

  const router = useRouter();

  const handleEditPdf = useCallback(
    (file: FolderExplorerFile): void => {
      if (!useSharePoint || !file.id) {
        Toast.error({ message: 'Cannot edit PDF: File ID is missing' });
        return;
      }
      const base = `/(app)/pdf-editor?fileId=${encodeURIComponent(file.id)}&fileName=${encodeURIComponent(file.name || 'document.pdf')}`;
      const qs = projectId ? `${base}&projectId=${encodeURIComponent(projectId)}` : base;
      window.location.href = qs as any;
      // router.push(qs as any);
    },
    [useSharePoint, router, projectId],
  );

  const handleFileCheckIn = useCallback(
    async (file: FolderExplorerFile): Promise<void> => {
      if (!useSharePoint) return;

      if (!file.id) {
        Toast.error({ message: 'Cannot check in: File ID is missing' });
        return;
      }

      if (!file.isCheckedOut) {
        Toast.error({ message: 'File is not checked out' });
        return;
      }

      try {
        const checkedInFile = await checkInSharePointItemById(file.id);
        const explorerFile = convertSharePointToExplorerFile(checkedInFile);

        // Update the file in state
        setAllFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? explorerFile : f)));

        // Update selected file if it's the same file
        if (selectedFile?.id === file.id) {
          setSelectedFile(explorerFile);
        }

        Toast.success({ message: `${file.name} has been checked in` });

        // Trigger a refresh to ensure the list is fully updated
        const currentPathKey = normalizePath(currentFolderPath) || '/';
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(currentPathKey);
          return updated;
        });
        await fetchFolderContents(currentFolderPath, true); // Force refresh
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to check in item';
        // Check if it's a locked resource error (423) - only show toast, don't set error state
        const isLockedError =
          errorMessage.includes('423') || errorMessage.includes('resourceLocked') || errorMessage.includes('locked');
        if (!isLockedError) {
          setError(errorMessage);
        }
        console.error('Error checking in SharePoint item:', error);
        Toast.error({ message: isLockedError ? 'File is currently locked. Please try again later.' : errorMessage });
      }
    },
    [useSharePoint, currentFolderPath, fetchFolderContents, selectedFile],
  );

  /**
   * Handle folder creation
   */
  const handleCreateFolder = useCallback(
    async (name: string, parentFolder: FolderExplorerFile) => {
      if (!useSharePoint) {
        if (onCreateFolder) {
          await onCreateFolder();
        }
        return;
      }

      if (!parentFolder?.path) {
        throw new Error('Parent folder path is required');
      }

      try {
        const parentPath = removeLeadingSlash(parentFolder.path);
        setLoadingFolder(parentPath);

        const newFolder = await createSharePointFolder(name, parentPath);
        const explorerFile = convertSharePointToExplorerFile(newFolder);

        // Add the new folder to the files list
        setAllFiles(prevFiles => [...prevFiles, explorerFile]);

        // Force reload the parent folder to show the new folder
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(parentPath || '/');
          return updated;
        });

        await fetchFolderContents(parentPath);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create folder';
        setError(errorMessage);
        console.error('Error creating SharePoint folder:', error);
        throw error;
      } finally {
        setLoadingFolder(null);
      }
    },
    [useSharePoint, onCreateFolder, fetchFolderContents],
  );

  /**
   * Handle file upload - Intercept and upload to SharePoint
   */
  const handleFileUploading = useCallback(
    (file: FolderExplorerFile, parentFolder: FolderExplorerFile) => {
      if (!useSharePoint) {
        return {};
      }

      // Try multiple ways to extract the File object
      const fileToUpload =
        (file as any)?.file ||
        (file as any)?.fileData ||
        (file as any)?.originalFile ||
        (file as any)?.blob ||
        (file as any)?.nativeFile;

      if (fileToUpload instanceof File) {
        if (!parentFolder?.path) {
          console.error('Parent folder path is missing');
          return {};
        }
        const parentPath = removeLeadingSlash(parentFolder.path);
        setLoadingFolder(parentPath);

        // Upload to SharePoint immediately
        uploadFileToSharePoint(fileToUpload, parentPath)
          .then(sharePointFile => {
            const explorerFile = convertSharePointToExplorerFile(sharePointFile);
            setAllFiles(prevFiles => [...prevFiles, explorerFile]);

            // Force reload the parent folder
            setLoadedPaths(prev => {
              const updated = new Set(prev);
              updated.delete(parentPath || '/');
              return updated;
            });

            return fetchFolderContents(parentPath);
          })
          .catch(error => {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
            setError(errorMessage);
            console.error('Error uploading file to SharePoint:', error);
          })
          .finally(() => {
            setLoadingFolder(null);
          });
      } else {
        // Store for later extraction in onFileUploaded
        uploadQueueRef.current.push({
          file: file as any,
          parentFolder,
        });
      }

      return {};
    },
    [useSharePoint, fetchFolderContents],
  );

  /**
   * Handle folder change - Track current folder path for refresh
   */
  const handleFolderChange = useCallback(
    (path: string) => {
      hideAllPortalTooltips();
      const raw = removeLeadingSlash(path);
      const rootNorm = normalizePath(folderPath || '');
      const normalizedPath = raw === '' ? rootNorm : raw;
      setCurrentFolderPath(normalizedPath);
      if (projectId && useSharePoint) {
        dispatch(setFolderExplorerPathForProject({ projectId, path: normalizedPath }));
      }
    },
    [projectId, useSharePoint, dispatch, folderPath],
  );

  /**
   * Handle copy - Store files to be pasted
   */
  const handleCopy = useCallback(
    (files: FolderExplorerFile[]) => {
      if (!useSharePoint) return;

      // Check for checked out files
      const checkedOutFiles = files.filter(file => {
        return (file as any).isCheckedOut || allFiles.find(f => f.id === file.id)?.isCheckedOut;
      });

      if (checkedOutFiles.length > 0) {
        Toast.error({ message: 'Cannot copy: some files are checked out' });
        return;
      }

      setCopiedFiles(files);
      setIsCutOperation(false);
    },
    [useSharePoint, allFiles],
  );

  /**
   * Handle cut - Store files to be pasted (and deleted after paste)
   */
  const handleCut = useCallback(
    (files: FolderExplorerFile[]) => {
      if (!useSharePoint) return;

      // Check for checked out files
      const checkedOutFiles = files.filter(file => {
        return (file as any).isCheckedOut || allFiles.find(f => f.id === file.id)?.isCheckedOut;
      });

      if (checkedOutFiles.length > 0) {
        Toast.error({ message: 'Cannot cut: some files are checked out' });
        return;
      }

      setCopiedFiles(files);
      setIsCutOperation(true);
    },
    [useSharePoint, allFiles],
  );

  /**
   * Handle move - Move files to a destination folder
   */
  const handleMove = useCallback(
    async (files: FolderExplorerFile[], destinationFolderOrPath?: FolderExplorerFile | string) => {
      if (!useSharePoint) return;

      if (files.length === 0) {
        return;
      }

      // Check for checked out files
      const checkedOutFiles = files.filter(file => {
        return (file as any).isCheckedOut || allFiles.find(f => f.id === file.id)?.isCheckedOut;
      });

      if (checkedOutFiles.length > 0) {
        Toast.error({ message: 'Cannot move: some files are checked out' });
        return;
      }

      // Determine destination path from various possible formats
      let destinationPath: string = '';

      if (typeof destinationFolderOrPath === 'string') {
        destinationPath = removeLeadingSlash(destinationFolderOrPath);
      } else if (destinationFolderOrPath && typeof destinationFolderOrPath === 'object') {
        const obj = destinationFolderOrPath as any;
        if (obj.path) {
          destinationPath = removeLeadingSlash(obj.path);
        } else if (obj.name && obj.isDirectory) {
          const basePath = currentFolderPath || normalizePath(folderPath || '');
          destinationPath = basePath ? `${basePath}/${obj.name}` : obj.name;
          destinationPath = removeLeadingSlash(destinationPath);
        }
      }

      // Fallback to current folder path if still no destination
      if (!destinationPath && destinationPath !== '') {
        destinationPath = currentFolderPath || normalizePath(folderPath || '');
      }

      if (destinationPath === undefined) {
        throw new Error('Destination folder path is required');
      }

      try {
        setLoadingFolder(destinationPath);
        setError(null);

        // Move all files to the destination folder
        for (const file of files) {
          if (!file.id) continue;

          // Get the source file's parent path
          const sourceFilePath = removeLeadingSlash(file.path || '');
          const sourceParentPath = getParentPath(sourceFilePath);
          const normalizedSourceParent = normalizePath(sourceParentPath);
          const normalizedDestination = normalizePath(destinationPath);

          // Check if we're trying to move to the same location
          if (normalizedSourceParent === normalizedDestination) {
            continue;
          }

          // Prevent moving a folder into itself or its children
          if (file.isDirectory && file.path) {
            const filePath = removeLeadingSlash(file.path);
            if (destinationPath === filePath || destinationPath.startsWith(filePath + '/')) {
              continue;
            }
          }

          try {
            const movedItem = await moveSharePointItem(file.id, destinationPath);
            const explorerFile = convertSharePointToExplorerFile(movedItem);

            // Update the moved file in state
            setAllFiles(prevFiles => {
              // Remove the old file entry
              const filtered = prevFiles.filter(f => f.id !== file.id);

              // Add the new file entry with updated path
              return [...filtered, explorerFile];
            });

            // If moving a folder, update child file paths
            if (file.isDirectory && file.path) {
              const oldPath = removeLeadingSlash(file.path);
              const newFolderPath = removeLeadingSlash(explorerFile.path);

              // Update child file paths
              setAllFiles(prevFiles =>
                prevFiles.map(f => {
                  if (f.path && file.path && f.path.startsWith(file.path + '/')) {
                    const relativePath = f.path.substring(file.path.length);
                    return { ...f, path: explorerFile.path + relativePath };
                  }
                  return f;
                }),
              );

              // Update loaded paths for the moved folder
              setLoadedPaths(prev => {
                const updated = new Set(prev);
                updated.delete(oldPath);
                updated.add(newFolderPath);
                return updated;
              });
            }

            // Remove the old file from loaded paths if it was a folder
            if (file.isDirectory) {
              const oldPathKey = normalizePath(file.path) || '/';
              setLoadedPaths(prev => {
                const updated = new Set(prev);
                updated.delete(oldPathKey);
                return updated;
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to move item';
            console.error(`Error moving ${file.name}:`, errorMessage);
            // Continue with other files even if one fails
          }
        }

        // Refresh the destination folder to show the moved files
        const normalizedDestinationPath = normalizePath(destinationPath);
        const pathKey = normalizedDestinationPath || '/';

        // Remove from loaded paths to force reload
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(pathKey);
          return updated;
        });

        // Fetch fresh data from SharePoint for the destination folder
        try {
          const sharePointFiles = await getSharePointFiles(normalizedDestinationPath);
          const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

          // Replace files in the destination folder with fresh data
          setAllFiles(prevFiles => {
            if (!normalizedDestinationPath) {
              // If destination is root, replace all files
              return explorerFiles;
            }
            // Replace files that are in the destination folder, keep others
            const filesOutsideFolder = prevFiles.filter(f => {
              if (!f.path) return true; // Keep files without paths
              const filePath = removeLeadingSlash(f.path);
              const fileParentPath = getParentPath(filePath);
              return fileParentPath !== normalizedDestinationPath;
            });
            return [...filesOutsideFolder, ...explorerFiles];
          });

          // Mark as loaded
          setLoadedPaths(prev => new Set([...prev, pathKey]));
        } catch (fetchError) {
          console.error('Error refreshing folder after move:', fetchError);
          // Even if refresh fails, the files were already moved successfully
        }

        // Also refresh the source folder if we moved from a different folder
        if (files.length > 0 && files[0].path) {
          const sourcePath = getParentPath(removeLeadingSlash(files[0].path));
          if (sourcePath !== normalizedDestinationPath) {
            try {
              const sourcePathKey = normalizePath(sourcePath) || '/';
              setLoadedPaths(prev => {
                const updated = new Set(prev);
                updated.delete(sourcePathKey);
                return updated;
              });
              await fetchFolderContents(sourcePath);
            } catch (fetchError) {
              console.error('Error refreshing source folder after move:', fetchError);
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to move files';
        setError(errorMessage);
        console.error('Error moving files:', error);
      } finally {
        setLoadingFolder(null);
      }
    },
    [useSharePoint, fetchFolderContents, currentFolderPath, folderPath, allFiles],
  );

  /**
   * Handle paste - Copy or move files to a destination folder
   * The file manager calls this with (files, destinationFolder, operationType)
   * where operationType can be "copy" or "move"
   */
  const handlePaste = useCallback(
    async (
      filesOrDestination?: FolderExplorerFile[] | FolderExplorerFile | string,
      destinationFolderOrPath?: FolderExplorerFile | string,
      operationType?: string,
    ) => {
      if (!useSharePoint) return;

      // Determine which files to use - either from the first parameter (new API) or copiedFiles (old API)
      let filesToProcess: FolderExplorerFile[] = [];
      let actualDestination: FolderExplorerFile | string | undefined;
      let actualOperationType: string | undefined;

      // Check if first parameter is an array of files (new API format)
      if (Array.isArray(filesOrDestination)) {
        filesToProcess = filesOrDestination;
        actualDestination = destinationFolderOrPath;
        actualOperationType = operationType;
      } else {
        // Old API format - use copiedFiles and first param is destination
        filesToProcess = copiedFiles;
        actualDestination = filesOrDestination || destinationFolderOrPath;
        actualOperationType = isCutOperation ? 'move' : 'copy';
      }

      if (filesToProcess.length === 0) {
        return;
      }

      // If operationType is "move", use the move handler instead
      if (actualOperationType === 'move') {
        if (actualDestination) {
          await handleMove(filesToProcess, actualDestination);
        }
        // Clear copied files after move
        setCopiedFiles([]);
        setIsCutOperation(false);
        return;
      }

      // Determine destination path from various possible formats
      let destinationPath: string = '';

      if (typeof actualDestination === 'string') {
        // If it's a string, use it directly
        destinationPath = removeLeadingSlash(actualDestination);
      } else if (actualDestination && typeof actualDestination === 'object') {
        // Try to extract path from object properties
        const obj = actualDestination as any;
        if (obj.path) {
          destinationPath = removeLeadingSlash(obj.path);
        } else if (obj.name && obj.isDirectory) {
          // If we have a name and it's a directory, construct path from current folder
          const basePath = currentFolderPath || normalizePath(folderPath || '');
          destinationPath = basePath ? `${basePath}/${obj.name}` : obj.name;
          destinationPath = removeLeadingSlash(destinationPath);
        }
      }

      // Fallback to current folder path if still no destination
      if (!destinationPath) {
        destinationPath = currentFolderPath || normalizePath(folderPath || '');
      }

      try {
        setLoadingFolder(destinationPath);
        setError(null);

        // Copy all files to the destination folder
        for (const file of filesToProcess) {
          if (!file.id) continue;

          try {
            await copySharePointItem(file.id, destinationPath);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to copy item';
            console.error(`Error copying ${file.name}:`, errorMessage);
            // Continue with other files even if one fails
          }
        }

        // Refresh the destination folder to show the pasted files
        // Wait a bit to ensure SharePoint has processed the copy operations
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          const normalizedDestinationPath = normalizePath(destinationPath);
          const pathKey = normalizedDestinationPath || '/';

          // Remove from loaded paths to force reload
          setLoadedPaths(prev => {
            const updated = new Set(prev);
            updated.delete(pathKey);
            return updated;
          });

          // Fetch fresh data from SharePoint for the destination folder
          const sharePointFiles = await getSharePointFiles(normalizedDestinationPath);
          const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

          // Replace files in the destination folder with fresh data
          setAllFiles(prevFiles => {
            if (!normalizedDestinationPath) {
              // If destination is root, replace all files
              return explorerFiles;
            }
            // Replace files that are in the destination folder, keep others
            const filesOutsideFolder = prevFiles.filter(f => {
              if (!f.path) return true; // Keep files without paths
              const filePath = removeLeadingSlash(f.path);
              const fileParentPath = getParentPath(filePath);
              return fileParentPath !== normalizedDestinationPath;
            });
            return [...filesOutsideFolder, ...explorerFiles];
          });

          // Mark as loaded
          setLoadedPaths(prev => new Set([...prev, pathKey]));
        } catch (fetchError) {
          console.error('Error refreshing folder after paste:', fetchError);
          // Even if refresh fails, the files were already pasted successfully
        }

        // If this was a cut operation, delete the original files after successful paste
        if (actualOperationType === 'move' || (isCutOperation && filesToProcess.length > 0)) {
          try {
            for (const file of filesToProcess) {
              if (!file.id) continue;

              try {
                await deleteSharePointItemById(file.id);
                setAllFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));

                // Remove directory from loaded paths if it's a folder
                if (file.isDirectory) {
                  const pathKey = normalizePath(file.path) || '/';
                  setLoadedPaths(prev => {
                    const updated = new Set(prev);
                    updated.delete(pathKey);
                    return updated;
                  });
                }
              } catch (deleteError) {
                const errorMessage = deleteError instanceof Error ? deleteError.message : 'Failed to delete item';
                console.error(`Error deleting original file ${file.name} after cut:`, errorMessage);
                // Continue with other files even if one fails
              }
            }
          } catch (deleteError) {
            console.error('Error deleting original files after cut:', deleteError);
            // Don't throw - paste was successful, deletion is secondary
          }
        }

        // Clear copied files and cut flag after successful paste
        setCopiedFiles([]);
        setIsCutOperation(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to paste files';
        setError(errorMessage);
        console.error('Error pasting files:', error);
      } finally {
        setLoadingFolder(null);
      }
    },
    [useSharePoint, copiedFiles, isCutOperation, currentFolderPath, folderPath, handleMove],
  );

  /**
   * Handle download - Download files from SharePoint
   */
  const handleDownload = useCallback(
    async (files: FolderExplorerFile[]) => {
      if (!useSharePoint) {
        return;
      }

      for (const file of files) {
        // Check if file is checked out
        if ((file as any).isCheckedOut) {
          Toast.error({ message: `Cannot download: ${file.name} is checked out` });
          continue;
        }
        const originalFile = allFiles.find(f => f.id === file.id);
        if (originalFile?.isCheckedOut) {
          Toast.error({ message: `Cannot download: ${file.name} is checked out` });
          continue;
        }

        if (file.isDirectory) {
          continue;
        }

        let urlToUse = file.downloadableUrl;
        if (!urlToUse && file.id) {
          try {
            const freshUrl = await getSharePointFileDownloadUrl(file.id);
            if (freshUrl) urlToUse = freshUrl;
          } catch (_) {
            // ignore, will show error below
          }
        }

        if (!urlToUse) {
          Toast.error({ message: `Cannot download: ${file.name} — download URL not available` });
          continue;
        }

        try {
          const response = await fetch(urlToUse);

          if (!response.ok) {
            // If auth error, try refreshing the download URL once
            const isAuthError = response.status === 401 || response.status === 403;
            if (file.id && isAuthError) {
              const freshUrl = await getSharePointFileDownloadUrl(file.id);
              if (freshUrl && freshUrl !== urlToUse) {
                const retryResponse = await fetch(freshUrl);
                if (!retryResponse.ok) {
                  throw new Error(`Failed to download: ${retryResponse.status} ${retryResponse.statusText}`);
                }
                const blob = await retryResponse.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = file.name || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                continue;
              }
            }
            throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
          }

          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = blobUrl;
          link.download = file.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
          Toast.error({ message: `Failed to download ${file.name}: ${errorMessage}` });
          console.error(`Error downloading ${file.name}:`, errorMessage);
        }
      }
    },
    [useSharePoint, allFiles],
  );

  /**
   * Handle single file download - Used by file preview component
   */
  const handleSingleFileDownload = useCallback(async (file: FolderExplorerFile) => {
    if (file.isDirectory) {
      return;
    }

    const downloadBlob = async (url: string): Promise<Blob> => {
      const response = await fetch(url);
      if (!response.ok) {
        const error: any = new Error(`Failed to download: ${response.status} ${response.statusText}`);
        error.status = response.status;
        throw error;
      }
      return response.blob();
    };

    const triggerDownload = (blob: Blob, fileName: string) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    };

    try {
      let urlToUse = file.downloadableUrl;

      // If no downloadableUrl, try to get a fresh one using file ID
      if (!urlToUse && file.id) {
        const { getSharePointFileDownloadUrl } = await import('@/utils/SharePointService');
        const freshUrl = await getSharePointFileDownloadUrl(file.id);
        if (freshUrl) {
          urlToUse = freshUrl;
        }
      }

      if (!urlToUse) {
        throw new Error('Download URL not available');
      }

      try {
        const blob = await downloadBlob(urlToUse);
        triggerDownload(blob, file.name || 'download');
      } catch (fetchErr: any) {
        // If fetch fails with auth error and we have file ID, try getting a fresh URL
        const isAuthError = fetchErr?.status === 401 || fetchErr?.status === 403;

        if (file.id && isAuthError) {
          const { getSharePointFileDownloadUrl } = await import('@/utils/SharePointService');
          const freshUrl = await getSharePointFileDownloadUrl(file.id);
          if (freshUrl && freshUrl !== urlToUse) {
            const blob = await downloadBlob(freshUrl);
            triggerDownload(blob, file.name || 'download');
          } else {
            throw new Error(fetchErr?.message || 'Failed to download');
          }
        } else {
          throw new Error(fetchErr?.message || 'Failed to download');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      setError(`Failed to download ${file.name}: ${errorMessage}`);
      console.error(`Error downloading ${file.name}:`, errorMessage);
    }
  }, []);

  /**
   * Handle refresh - Reload the current folder from SharePoint
   */
  const handleRefresh = useCallback(async () => {
    if (!useSharePoint) {
      return;
    }

    try {
      const pathToRefresh = currentFolderPath || folderPath || '';
      const normalizedPath = normalizePath(pathToRefresh);
      const pathKey = normalizedPath || '/';

      setLoadingFolder(pathToRefresh);
      setError(null);

      // Remove from loaded paths to force reload
      setLoadedPaths(prev => {
        const updated = new Set(prev);
        updated.delete(pathKey);
        return updated;
      });

      // Fetch fresh data from SharePoint
      const sharePointFiles = await getSharePointFiles(normalizedPath);
      const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

      // Replace files in the current folder with fresh data
      setAllFiles(prevFiles => {
        if (!normalizedPath) {
          // If refreshing root, replace all files
          return explorerFiles;
        }
        // Replace files that are in the current folder, keep others
        const filesOutsideFolder = prevFiles.filter(f => {
          if (!f.path) return true; // Keep files without paths
          const filePath = removeLeadingSlash(f.path);
          const fileParentPath = getParentPath(filePath);
          return fileParentPath !== normalizedPath;
        });
        return [...filesOutsideFolder, ...explorerFiles];
      });

      // Mark as loaded
      setLoadedPaths(prev => new Set([...prev, pathKey]));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh folder';
      setError(errorMessage);
      console.error('Error refreshing folder:', error);
    } finally {
      setLoadingFolder(null);
    }
  }, [useSharePoint, currentFolderPath, folderPath]);

  /**
   * Handle shortcut created - Close modals and reload entire folder structure
   */
  const handleShortcutCreated = useCallback(async () => {
    // Close the preview modal
    setSelectedFile(null);

    const initialPath = normalizePath(folderPath || '');

    try {
      setLoading(true);
      setError(null);

      // Clear all loaded paths to force full reload
      setLoadedPaths(new Set());
      loadingPathsRef.current.clear();
      deepLoadingRef.current = false;

      // Fetch fresh data from SharePoint starting from root
      const sharePointFiles = await getSharePointFiles(initialPath);
      const explorerFiles = sharePointFiles.map(convertSharePointToExplorerFile);

      // Replace all files with fresh data
      setAllFiles(explorerFiles);

      // Mark initial path as loaded to trigger deep loading
      setLoadedPaths(new Set([initialPath || '/']));
      setCurrentFolderPath(initialPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh folder';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [folderPath]);

  /**
   * Handle creating documents folders
   */
  const handleCreateDocumentsFolders = useCallback(async () => {
    if (!projectId) {
      Toast.error({ message: 'Project ID is required to create folders' });
      return;
    }

    try {
      setIsCreatingFolders(true);
      const { data, error } = await apolloClient.query({
        query: SETUP_SHAREPOINT_PROJECT_QUERY,
        variables: { project_id: projectId },
        fetchPolicy: 'network-only',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.setupSharepointProject?.status) {
        Toast.success({
          message: 'Success, documents will be created soon. Page will automatically refresh in 10 seconds.',
        });
        // Optionally refresh after a delay
        setTimeout(() => {
          window.location.reload();
        }, 10000); // Reload after 10 seconds
      } else {
        throw new Error('Failed to create folders');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create documents folders';
      Toast.error({ message: errorMessage });
      console.error('Error creating documents folders:', err);
    } finally {
      setIsCreatingFolders(false);
    }
  }, [projectId]);

  /**
   * Handle file uploaded - Extract file from response and upload to SharePoint
   */
  const handleFileUploaded = useCallback(
    async (response: { [key: string]: any }) => {
      if (!useSharePoint) {
        if (onUpload) {
          await onUpload();
        }
        return;
      }

      try {
        // Get the queued file info
        const queuedItem = uploadQueueRef.current.shift();
        if (!queuedItem) return;

        const { parentFolder } = queuedItem;
        if (!parentFolder?.path) {
          console.error('Parent folder path is missing');
          return;
        }
        const parentPath = removeLeadingSlash(parentFolder.path);

        // Try to extract the File object from various possible locations
        let fileToUpload: File | null = null;

        // Check response for file
        if (response.file instanceof File) {
          fileToUpload = response.file;
        } else if (response.fileData instanceof File) {
          fileToUpload = response.fileData;
        } else if ((response as any).file instanceof File) {
          fileToUpload = (response as any).file;
        } else if (queuedItem.file instanceof File) {
          fileToUpload = queuedItem.file;
        } else if ((queuedItem.file as any).file instanceof File) {
          fileToUpload = (queuedItem.file as any).file;
        }

        if (!fileToUpload) {
          console.error('Could not extract File object from upload response:', response);
          // Still refresh the folder in case upload succeeded via FileManager
          setLoadedPaths(prev => {
            const updated = new Set(prev);
            updated.delete(parentPath || '/');
            return updated;
          });
          await fetchFolderContents(parentPath);
          return;
        }

        setLoadingFolder(parentPath);

        // Upload file to SharePoint
        const sharePointFile = await uploadFileToSharePoint(fileToUpload, parentPath);
        const explorerFile = convertSharePointToExplorerFile(sharePointFile);

        // Add the uploaded file to the files list
        setAllFiles(prevFiles => [...prevFiles, explorerFile]);

        // Force reload the parent folder to show the uploaded file
        setLoadedPaths(prev => {
          const updated = new Set(prev);
          updated.delete(parentPath || '/');
          return updated;
        });

        await fetchFolderContents(parentPath);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
        setError(errorMessage);
        console.error('Error uploading file to SharePoint:', error);
      } finally {
        setLoadingFolder(null);
      }
    },
    [useSharePoint, onUpload, fetchFolderContents],
  );

  /**
   * Format files for FileManager component
   * Memoized to prevent re-renders that reset FileManager's rename state
   */
  const validFiles = useMemo(() => {
    const files = allFiles
      .filter(file => file.name && typeof file.isDirectory === 'boolean' && file.path)
      .map(file => {
        // For shortcut files, display as the source file (keeps sourceId for link icon)
        if (file.sourceId) {
          const sourceFile = allFiles.find(f => f.listItemId === file.sourceId);
          if (sourceFile) {
            const originalPath = file.path || '';
            const lastSlashIndex = originalPath.lastIndexOf('/');
            const folderPath = lastSlashIndex >= 0 ? originalPath.substring(0, lastSlashIndex + 1) : '/';
            const ids = sourceFile.projectServiceIds ?? sourceFile.rawSharePointFile?.projectServiceIds;
            const resolvedNames = projectServices?.length ? resolveProjectServiceNames(ids, projectServices) : [];
            const projectServiceNames = resolvedNames.length > 0 ? resolvedNames : sourceFile.projectServiceNames;
            const projectServiceDetails =
              projectServices?.length && projectId
                ? resolveProjectServiceDetailsWithTypes(
                    { ...sourceFile, rawSharePointFile: sourceFile.rawSharePointFile },
                    projectServices,
                    projectServiceInstallationCertificates ?? [],
                    projectId,
                    projectServiceChecklistItems ?? undefined,
                  )
                : (sourceFile.projectServiceDetails ??
                  (projectServiceNames?.length ? projectServiceNames.map(n => ({ primary: n })) : undefined));
            return {
              ...sourceFile,
              path: ensureLeadingSlash(folderPath + sourceFile.name),
              id: file.id,
              sourceId: file.sourceId,
              listItemId: file.listItemId,
              projectServiceNames,
              projectServiceDetails: projectServiceDetails?.length ? projectServiceDetails : undefined,
            };
          }
        }

        const ids =
          file.projectServiceIds ?? file.rawSharePointFile?.projectServiceIds ?? (file as any).projectServiceIds;
        const resolvedNames = projectServices?.length ? resolveProjectServiceNames(ids, projectServices) : [];
        const projectServiceNames = resolvedNames.length > 0 ? resolvedNames : file.projectServiceNames;
        const projectServiceDetails =
          projectServices?.length && projectId
            ? resolveProjectServiceDetailsWithTypes(
                { ...file, rawSharePointFile: file.rawSharePointFile },
                projectServices,
                projectServiceInstallationCertificates ?? [],
                projectId,
                projectServiceChecklistItems ?? undefined,
              )
            : (file.projectServiceDetails ??
              (projectServiceNames?.length ? projectServiceNames.map(n => ({ primary: n })) : undefined));

        return {
          name: file.name,
          isDirectory: file.isDirectory,
          path: ensureLeadingSlash(file.path),
          updatedAt: file.updatedAt,
          size: file.size,
          id: file.id,
          mimeType: file.mimeType,
          downloadableUrl: file.downloadableUrl,
          webUrl: file.webUrl,
          isCheckedOut: file.isCheckedOut,
          isSuperseded: file.isSuperseded,
          isArchived: file.isArchived,
          disabled: file.disabled,
          tooltip: file.tooltip,
          shortcuts: file.shortcuts,
          sourceId: file.sourceId,
          listItemId: file.listItemId,
          rawSharePointFile: file.rawSharePointFile,
          projectServiceNames,
          projectServiceDetails: projectServiceDetails?.length ? projectServiceDetails : undefined,
        };
      });

    // Add parent folder if needed for navigation
    if (folderPath && files.length > 0) {
      const parentPath = ensureLeadingSlash(folderPath);
      const hasParentFolder = files.some(f => f.path === parentPath);

      if (!hasParentFolder) {
        files.unshift({
          name: folderPath,
          isDirectory: true,
          path: parentPath,
          updatedAt: new Date().toISOString(),
          size: 0,
          id: `parent-${folderPath}`,
          mimeType: undefined,
          downloadableUrl: undefined,
          webUrl: undefined,
          isCheckedOut: false,
          isSuperseded: false,
          isArchived: false,
          disabled: false,
          tooltip: undefined,
          shortcuts: undefined,
          sourceId: undefined,
          listItemId: undefined,
          rawSharePointFile: undefined,
          projectServiceNames: undefined,
          projectServiceDetails: undefined,
        });
      }
    }

    return files;
  }, [
    allFiles,
    folderPath,
    projectServices,
    projectId,
    projectServiceInstallationCertificates,
    projectServiceChecklistItems,
  ]);

  // Get available folders for shortcut creation
  const availableFolders = useMemo(() => {
    return allFiles.filter(file => file.isDirectory && file.path);
  }, [allFiles]);

  // Mark disabled files in the DOM after FileManager renders
  useEffect(() => {
    if (!useSharePoint) return;

    // Hide any visible portal tooltips when list/path changes (e.g. after entering a folder).
    // The hovered row is removed from the DOM so mouseleave never fires; hide tooltips explicitly.
    hideAllPortalTooltips();

    const markDisabledFiles = () => {
      const fileItems = document.querySelectorAll('.file-item-container');

      fileItems.forEach(item => {
        const htmlItem = item as HTMLElement;
        let fileNameElement = htmlItem.querySelector('.file-item .file-name') || htmlItem.querySelector('.file-name');
        if (!fileNameElement && htmlItem.querySelector('.file-item')) {
          const fileItem = htmlItem.querySelector('.file-item');
          const spans = fileItem?.querySelectorAll('span');
          for (const span of Array.from(spans ?? [])) {
            if (span.textContent?.trim() && !span.classList.contains('drop-zone-file-name')) {
              fileNameElement = span;
              break;
            }
          }
        }
        const visibleName = fileNameElement?.textContent?.trim() || '';
        const titleName = htmlItem.getAttribute('title') || '';
        // Prefer title (full name) when present; fall back to visible text (may be truncated with … or ...)
        const nameToMatch = (titleName || visibleName).trim();
        const existingId = htmlItem.getAttribute('data-file-id');

        let file: (typeof validFiles)[number] | undefined;
        if (existingId) {
          file = validFiles.find(f => String(f.id) === existingId);
          if (!file && existingId.startsWith('path:')) {
            const path = existingId.slice(5);
            file = validFiles.find(f => f.path === path);
          }
        }
        if (!file && nameToMatch) {
          // Strip ellipsis so truncated display (e.g. "default_pictu...") still matches full name
          const norm = nameToMatch
            .toLowerCase()
            .replace(/\u2026|\.{2,}$/g, '')
            .trim();
          file = validFiles.find(f => {
            if (!f.name) return false;
            const fn = f.name.toLowerCase();
            if (norm === fn) return true;
            if (fn.startsWith(norm) || norm.startsWith(fn)) return true;
            if (fn.includes(norm) || norm.includes(fn)) return true;
            return false;
          });
        }

        if (file) {
          // Use stable id so next run matches by id (avoid empty string for multiple rows)
          const stableId = file.id || `path:${file.path}`;
          htmlItem.setAttribute('data-file-id', stableId);
        }

        // Styling for disabled/superseded/archived is applied in FileItem via file props and FileList.scss

        // Add link icon for shortcut files
        const isShortcut = file?.sourceId || file?.shortcuts || file?.name?.toLowerCase().endsWith('.url');

        let shortcutIcon = htmlItem.querySelector('.shortcut-icon') as HTMLElement;

        if (isShortcut && fileNameElement) {
          if (!shortcutIcon) {
            shortcutIcon = document.createElement('span');
            shortcutIcon.className = 'shortcut-icon';
            shortcutIcon.innerHTML = `
              <svg class="shortcut-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-left: 4px;">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            `;
            shortcutIcon.style.display = 'inline-block';
            shortcutIcon.style.verticalAlign = 'middle';
            shortcutIcon.style.marginLeft = '4px';
            shortcutIcon.style.marginTop = '-6px';
            (fileNameElement as HTMLElement).appendChild(shortcutIcon);
          }
          shortcutIcon.style.display = 'inline-block';
        } else if (shortcutIcon) {
          shortcutIcon.remove();
        }

        // Add checked-out icon for files that are checked out
        const isCheckedOut = file?.isCheckedOut;
        let checkedOutIcon = htmlItem.querySelector('.checked-out-icon') as HTMLElement;

        if (isCheckedOut && fileNameElement) {
          if (!checkedOutIcon) {
            checkedOutIcon = document.createElement('span');
            checkedOutIcon.className = 'checked-out-icon';
            checkedOutIcon.innerHTML = `
              <svg class="checked-out-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-left: 4px;">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            `;
            checkedOutIcon.style.display = 'inline-block';
            checkedOutIcon.style.verticalAlign = 'middle';
            checkedOutIcon.style.marginLeft = '4px';
            checkedOutIcon.style.marginTop = '-6px';
            (fileNameElement as HTMLElement).appendChild(checkedOutIcon);
          }
          checkedOutIcon.style.display = 'inline-block';
        } else if (checkedOutIcon) {
          checkedOutIcon.remove();
        }

        // Apply custom CSS tooltip using data attribute
        if (file?.tooltip || file?.name) {
          htmlItem.setAttribute('data-custom-tooltip', file.tooltip || file.name || '');
          htmlItem.setAttribute('data-file-id', file.id);
          htmlItem.removeAttribute('title');

          // Create or update tooltip element - render in body so it's not affected by parent opacity (superseded/archived)
          let tooltipElement = (htmlItem as any).__tooltipPortalElement as HTMLElement | undefined;
          if (!tooltipElement || !document.body.contains(tooltipElement)) {
            tooltipElement = document.createElement('div');
            tooltipElement.className = 'custom-tooltip custom-tooltip-portal';
            tooltipElement.style.opacity = '0';
            tooltipElement.style.visibility = 'hidden';
            document.body.appendChild(tooltipElement);
            (htmlItem as any).__tooltipPortalElement = tooltipElement;
          }

          // Get tooltip content: prefer source file's shortcuts if sourceId exists
          const getTooltipContent = (): string => {
            // If file has sourceId, find the source file and use its Shortcuts property
            if (file.sourceId) {
              const sourceFile = allFiles.find(f => f.listItemId === file.sourceId);
              if (sourceFile?.shortcuts) {
                return `Link to <br/><div style="padding-left: 12px;">${escapeHtml(sourceFile.shortcuts)}</div>`;
              }
            }

            // Fallback to file's own shortcuts or tooltip
            if (file.shortcuts) {
              return `Link to <br/><div style="padding-left: 12px;">${escapeHtml(file.shortcuts)}</div>`;
            }

            const fileName = file.name || 'n/a';
            const tooltipText = file.tooltip || '';
            return tooltipText ? `${escapeHtml(fileName)}<br/>${escapeHtml(tooltipText)}` : fileName;
          };

          const tooltipContent = getTooltipContent();
          if (tooltipContent.includes('<')) {
            tooltipElement.innerHTML = tooltipContent;
          } else {
            tooltipElement.textContent = tooltipContent;
          }

          const offset = 8;
          const updateTooltipPosition = () => {
            if (fileNameElement && tooltipElement) {
              const nameRect = (fileNameElement as HTMLElement).getBoundingClientRect();
              tooltipElement.style.position = 'fixed';
              tooltipElement.style.left = `${nameRect.right + offset}px`;
              tooltipElement.style.top = `${nameRect.bottom + offset}px`;
              tooltipElement.style.opacity = '1';
              tooltipElement.style.visibility = 'visible';
            }
          };
          const hideTooltip = () => {
            if (tooltipElement) {
              tooltipElement.style.opacity = '0';
              tooltipElement.style.visibility = 'hidden';
            }
          };

          const oldEnter = (htmlItem as any).__tooltipEnterHandler;
          const oldLeave = (htmlItem as any).__tooltipLeaveHandler;
          if (oldEnter) htmlItem.removeEventListener('mouseenter', oldEnter);
          if (oldLeave) htmlItem.removeEventListener('mouseleave', oldLeave);
          (htmlItem as any).__tooltipEnterHandler = updateTooltipPosition;
          (htmlItem as any).__tooltipLeaveHandler = hideTooltip;
          htmlItem.addEventListener('mouseenter', updateTooltipPosition);
          htmlItem.addEventListener('mouseleave', hideTooltip);
        } else {
          htmlItem.removeAttribute('data-custom-tooltip');
          // Keep data-file-id (set by FileManager) so we can match by id next run

          const tooltipElement = (htmlItem as any).__tooltipPortalElement as HTMLElement | undefined;
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.remove();
          }
          delete (htmlItem as any).__tooltipPortalElement;

          const oldEnter = (htmlItem as any).__tooltipEnterHandler;
          const oldLeave = (htmlItem as any).__tooltipLeaveHandler;
          if (oldEnter) htmlItem.removeEventListener('mouseenter', oldEnter);
          if (oldLeave) htmlItem.removeEventListener('mouseleave', oldLeave);
          delete (htmlItem as any).__tooltipEnterHandler;
          delete (htmlItem as any).__tooltipLeaveHandler;
        }
      });
    };

    // Run immediately and periodically to catch dynamically rendered items
    markDisabledFiles();
    const timeout = setTimeout(markDisabledFiles, 100);
    const interval = setInterval(markDisabledFiles, 300);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [validFiles, useSharePoint]);

  if (loading || (useSharePoint && !persistNavigationReady)) {
    return (
      <IndiYStack padding="$4" alignItems="center">
        <IndiText>Loading files...</IndiText>
      </IndiYStack>
    );
  }

  if (error) {
    return (
      <IndiYStack padding="$4" gap="$2">
        <IndiText color="$error" fontWeight="bold">
          Error loading files
        </IndiText>
        <IndiParagraph color="$error">{error}</IndiParagraph>
        {isFolderNotFound && projectId ? (
          <IndiYStack gap="$2" mt="$2">
            <IndiParagraph fontSize="$2" color="$textSecondary">
              The documents folder for this project has not been created yet.
            </IndiParagraph>
            <IndiButton
              handlePress={handleCreateDocumentsFolders}
              disabled={isCreatingFolders}
              loading={isCreatingFolders}
              text={isCreatingFolders ? 'Creating...' : 'Create Documents Folders'}
            />
          </IndiYStack>
        ) : (
          <IndiParagraph fontSize="$2" color="$textSecondary">
            Please check your SharePoint configuration and environment variables.
          </IndiParagraph>
        )}
      </IndiYStack>
    );
  }

  if (validFiles.length === 0) {
    if (loading) {
      return (
        <IndiYStack padding="$4" alignItems="center">
          <IndiText>Loading files...</IndiText>
        </IndiYStack>
      );
    }
    return (
      <IndiYStack padding="$4" alignItems="center">
        <IndiText color="$textSecondary">No files or folders found</IndiText>
      </IndiYStack>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '400px', position: 'relative' }}>
      <style>{FOLDER_EXPLORER_STYLES}</style>
      <style>{customStyles}</style>
      <FileManager
        ref={fileManagerRef}
        files={validFiles}
        projectServices={projectServices ?? undefined}
        key={`${projectId ?? 'no-project'}-${fileManagerRemountKey}`}
        initialPath={
          locationParam
            ? ensureLeadingSlash(getParentPath(normalizePath(locationParam)))
            : persistedFolderInitialPath ??
              (folderPath ? ensureLeadingSlash(folderPath) : '/')
        }
        onFileOpen={handleFileOpen}
        onSelectionChange={handleSelectionChange}
        onRename={useSharePoint ? handleFileRename : undefined}
        onDelete={useSharePoint ? handleFileDelete : undefined}
        onCopy={useSharePoint ? handleCopy : undefined}
        onCut={useSharePoint ? handleCut : undefined}
        onPaste={useSharePoint ? handlePaste : undefined}
        onDownload={useSharePoint ? handleDownload : undefined}
        acceptedFileTypes={acceptedFileTypes}
        showUpload={showUpload}
        showCreateFolder={showCreateFolder}
        onCreateFolder={useSharePoint ? handleCreateFolder : onCreateFolder}
        onFileUploading={useSharePoint ? handleFileUploading : undefined}
        onFileUploaded={useSharePoint ? handleFileUploaded : undefined}
        onFolderChange={useSharePoint ? handleFolderChange : undefined}
        onRefresh={useSharePoint ? handleRefresh : undefined}
        fileUploadConfig={
          useSharePoint
            ? {
                url: 'data:text/plain,', // Data URL that will succeed but do nothing
                method: 'POST',
              }
            : undefined
        }
        listColumns={[
          { id: 'name', label: 'Name' },
          { id: 'services', label: 'Services', fileKey: 'projectServiceDetails' },
          { id: 'modified', label: 'Modified' },
          { id: 'size', label: 'Size' },
        ]}
        height="600px"
        collapsibleNav={true}
        defaultNavExpanded={true}
        isLoading={loading || !!loadingFolder}
        layout="list"
        enableFilePreview={false}
        filePreviewPath=""
        primaryColor={colors.Primary500}
        fontFamily="Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        renderToolbarFilter={({
          projectServices: services,
          selectedServiceId: value,
          setSelectedServiceId: setValue,
        }) => {
          if (!Array.isArray(services) || services.length === 0) return null;
          const getLabel = (ps: ProjectService & { service?: { name?: string } }) => {
            const serviceName = (ps as any).service?.name?.trim?.() ?? '';
            const psName = (ps as any).name?.trim?.() ?? '';
            if (serviceName && psName) return `${serviceName} - ${psName}`;
            return (psName || serviceName || (ps as any).id) ?? '';
          };
          const data = [
            { value: 'all', label: 'All' },
            ...services.map(ps => ({ value: (ps as any).id, label: getLabel(ps as any) })),
          ];
          return (
            <div style={{ minWidth: 320 }}>
              <IndiSelect
                label="Filter by service"
                data={data}
                value={value}
                onChange={v => setValue(v ?? 'all')}
                type="overlapping"
                triggerWidth={320}
                containerProps={{ style: { height: 32 } }}
              />
            </div>
          );
        }}
        renderSearchInput={({ value, onChangeText, placeholder, onClear }) => (
          <IndiXStack
            width="100%"
            flexDirection="row"
            alignItems="center"
            gap="$1.5"
            paddingHorizontal="$1.5"
            pointerEvents="box-none">
            <LuSearch size={16} color="#5E6D82" style={{ flexShrink: 0, pointerEvents: 'none' }} />
            <IndiInput
              flex={1}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              autoFocus
              editable
              height={32}
              unstyled
              borderWidth={0}
              backgroundColor="transparent"
              padding={0}
              minWidth={0}
              pointerEvents="auto"
            />
            <IndiButton
              type="ghost"
              size="xs"
              icon={<LuX size={16} color="#5E6D82" />}
              onPress={onClear}
              aria-label="Clear search"
              width={28}
              height={28}
              padding={0}
              hoverStyle={{ backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4 }}
            />
          </IndiXStack>
        )}
      />
      {/* Custom Preview Modal */}
      {selectedFile && (
        <FilePreviewComponent
          file={selectedFile}
          onDownload={handleSingleFileDownload}
          onClose={() => setSelectedFile(null)}
          onSupersede={useSharePoint ? handleFileSupersede : undefined}
          onRestore={useSharePoint ? handleFileRestore : undefined}
          onCheckOut={useSharePoint ? handleFileCheckOut : undefined}
          onCheckIn={useSharePoint ? handleFileCheckIn : undefined}
          onEditPdf={useSharePoint ? handleEditPdf : undefined}
          availableFolders={useSharePoint ? availableFolders : undefined}
          onShortcutsCreated={useSharePoint ? handleShortcutCreated : undefined}
        />
      )}
    </div>
  );
}
