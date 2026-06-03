import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
  forwardRef,
  type CSSProperties,
} from 'react';
import { Dimensions, Platform, ScrollView, View } from 'react-native';
import {
  ArchiveRestore,
  ChevronDown,
  Download,
  ExternalLink,
  History,
  Info,
  Link2,
  MoreHorizontal,
  Pencil,
  Replace,
  X,
  ZoomIn,
  ZoomOut,
} from '@tamagui/lucide-icons';
import { IndiText, IndiParagraph } from '../text';
import { IndiYStack, IndiXStack } from '../views';
import { IndiButton } from '../buttons';
import { IndiDropdown } from '../dropdowns/dropdown';
import { IndiSelect } from '../selects/base';
import { IndiModal } from '../modal';
import { Toast } from '../toast';
import { useAnnotationsBySharePointFileQuery } from '@/graphql/graphql';
import { useUser } from '@/redux/app/selectors';
import {
  getSharePointFileContent,
  getSharePointFileVersions,
  getSharePointFileDownloadUrl,
  type SharePointVersion,
} from '@/utils/SharePointService';
import type { FolderExplorerFile } from './FolderExplorer';
import { CreateShortcutModal } from './CreateShortcutModal';

/**
 * Format file size for display
 */
function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format date for display
 */
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/** Subline under version action — matches Figma (e.g. "Name, 23/12/2026, 12:30 pm"). */
function formatVersionHistoryMeta(dateString?: string, displayName?: string): string {
  if (!dateString) return displayName || '—';
  try {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const who = displayName?.trim();
    return who ? `${who}, ${datePart}, ${timePart}` : `${datePart}, ${timePart}`;
  } catch {
    return displayName || dateString;
  }
}

function getVersionActionTitle(
  version: SharePointVersion,
  flags: {
    statusChanged: boolean;
    tooltipChanged: boolean;
    shortcutsChanged: boolean;
    hasCheckinComment: boolean;
  }
): string {
  const parts: string[] = [];
  if (flags.statusChanged && version.status) parts.push(String(version.status));
  if (flags.tooltipChanged) parts.push('Tooltip updated');
  if (flags.shortcutsChanged) parts.push('Shortcuts updated');
  if (flags.hasCheckinComment) parts.push('Check-in comment');
  return parts.join(' · ') || 'Update';
}

/**
 * Get file type icon/description
 */
function getFileTypeInfo(mimeType?: string, fileName?: string): string {
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType === 'application/pdf') return 'PDF Document';
    if (mimeType.includes('word')) return 'Word Document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel Spreadsheet';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint Presentation';
    if (mimeType.includes('text')) return 'Text Document';
  }
  
  // Fallback to file extension
  if (fileName) {
    const extension = fileName.split('.').pop()?.toUpperCase();
    if (extension) return `${extension} File`;
  }
  
  return 'File';
}

/**
 * Check if file is a PDF
 */
function isPdfFile(mimeType?: string, fileName?: string): boolean {
  if (mimeType === 'application/pdf') return true;
  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'pdf';
  }
  return false;
}

/**
 * Check if file is an image
 */
function isImageFile(mimeType?: string, fileName?: string): boolean {
  // Check by MIME type first
  if (mimeType && mimeType.startsWith('image/')) {
    return true;
  }
  
  // Check by file extension
  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageExtensions = [
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 
      'tiff', 'tif', 'heic', 'heif', 'avif', 'apng', 'raw', 'cr2',
      'nef', 'orf', 'sr2', 'dng', 'psd', 'ai', 'eps'
    ];
    return imageExtensions.includes(extension || '');
  }
  
  return false;
}

/**
 * Image Preview Component - Displays image from downloadableUrl or webUrl
 */
const ZOOM_LEVELS = [50, 75, 100, 125, 150, 175, 200] as const;

const ZOOM_SELECT_DATA = ZOOM_LEVELS.map(level => ({ value: level, label: `${level}%` }));

/** Preview area height inside full-screen file modal (header + toolbar + padding). */
function getFilePreviewViewportHeight(windowHeight: number): number {
  const chrome = 240;
  return Math.max(280, windowHeight - chrome);
}

function supportsCssZoom(): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return false;
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('zoom', '1')) {
    return true;
  }
  return 'zoom' in document.documentElement.style;
}

export function ImagePreviewComponent({ 
  downloadableUrl, 
  webUrl, 
  fileName,
  zoomPercent = 100,
}: { 
  downloadableUrl?: string; 
  webUrl?: string;
  fileName: string;
  zoomPercent?: number;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Use downloadableUrl if available, otherwise fall back to webUrl
    const urlToUse = downloadableUrl || webUrl;
    
    if (!urlToUse) {
      setError('Image URL not available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // For direct image URLs, we can use them directly
    // For SharePoint URLs, we might need to fetch as blob to handle CORS
    const isDirectImageUrl = urlToUse.match(/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)(\?|$)/i);
    
    if (isDirectImageUrl && downloadableUrl) {
      // Try to use the URL directly first
      setImageUrl(urlToUse);
      setLoading(false);
    } else {
      // Fetch as blob for CORS or other security reasons
      fetch(urlToUse)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          // Verify it's an image
          if (!blob.type.startsWith('image/')) {
            console.warn('File may not be an image, but attempting to display:', blob.type);
          }
          // Create object URL from blob
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          setLoading(false);
        })
        .catch((err) => {
          // If fetch fails, try using the URL directly as fallback
          console.warn('Failed to fetch image as blob, trying direct URL:', err);
          setImageUrl(urlToUse);
          setLoading(false);
        });
    }

    // Cleanup: revoke object URL when component unmounts or URL changes
    return () => {
      setImageUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith('blob:')) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
    };
  }, [downloadableUrl, webUrl]);

  if (loading) {
    return (
      <IndiYStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        gap="$2"
      >
        <IndiText color="$textSecondary">Loading image...</IndiText>
      </IndiYStack>
    );
  }

  if (error || !imageUrl) {
    return (
      <IndiYStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        gap="$3"
      >
        <IndiText color="$error" textAlign="center">
          {error || 'Failed to load image'}
        </IndiText>
        <IndiText fontSize="$2" color="$textSecondary" textAlign="center">
          Click "Edit" to open the file in a new tab.
        </IndiText>
      </IndiYStack>
    );
  }

  const minHeight = getFilePreviewViewportHeight(windowDimensions.height);
  const scale = Math.min(4, Math.max(0.25, zoomPercent / 100));

  const zoomStyle: CSSProperties =
    Platform.OS === 'web' && supportsCssZoom()
      ? { zoom: scale }
      : Platform.OS === 'web'
        ? { transform: `scale(${scale})`, transformOrigin: 'center center' }
        : ({ transform: [{ scale }] } as unknown as CSSProperties);

  return (
    <IndiYStack 
      width="100%" 
      flex={1} 
      alignItems="center" 
      justifyContent="center"
      style={{ minHeight: `${minHeight}px`, padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'auto', ...zoomStyle }}>
        <img
          src={imageUrl}
          alt={fileName}
          style={{
            maxWidth: '100%',
            maxHeight: `${minHeight}px`,
            objectFit: 'contain',
            borderRadius: '8px',
          }}
          onError={(e) => {
            setError('Failed to load image');
            setLoading(false);
          }}
        />
      </div>
    </IndiYStack>
  );
}

/** Aligns with `pdf-editor-web.tsx` / `public/pdf-editor.html` annotation payloads. */
function normalizeNoteValueForPreview(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  let v: unknown = raw;
  if (typeof v === 'string') {
    try {
      v = JSON.parse(v);
    } catch {
      return null;
    }
  }
  if (Array.isArray(v) && v.length > 0) v = v[0];
  return v != null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function isCanvasAnnotationValueForPreview(v: Record<string, unknown> | null): boolean {
  if (!v || typeof v.type !== 'string') return false;
  const canvasTypes = new Set([
    'rect',
    'circle',
    'triangle',
    'diamond',
    'ellipse',
    'line',
    'arrow',
    'arrow2',
    'text',
    'pencil',
    'highlighter',
    'measure_scale',
    'measure_line',
    'measure_rect',
    'measure_ellipse',
    'measure_polygon',
    'shape_polygon',
    'signature',
    'stamp',
  ]);
  return canvasTypes.has(v.type);
}

/** Web: same `pdf-editor.html` iframe as the editor (`embedPreview=1` hides toolbar); native: system PDF viewer. */
const PDF_EDITOR_EMBED_PREVIEW_SRC = '/pdf-editor.html?embedPreview=1';

/** Same message contract as `pdf-editor-web.tsx` → `public/pdf-editor.html` export. */
function exportFlattenedPdfFromEditorIframe(iframeWin: Window, pdfArrayBuffer: ArrayBuffer): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Export timed out'));
    }, 120000);
    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeWin) return;
      const d = event.data;
      if (d?.type === 'PDF_EXPORT_ERROR') {
        cleanup();
        reject(new Error(d.error || 'Export failed'));
      } else if (d?.type === 'PDF_WITH_ANNOTATIONS' && d.arrayBuffer) {
        cleanup();
        resolve(new Blob([d.arrayBuffer], { type: 'application/pdf' }));
      }
    };
    window.addEventListener('message', onMessage);
    iframeWin.postMessage({ type: 'EXPORT_PDF_WITH_ANNOTATIONS', pdfArrayBuffer }, '*');
  });
}

export type PdfPreviewComponentHandle = {
  /** Flatten canvas markup + notes into a PDF via the embedded `pdf-editor.html` viewer (web only). */
  exportFlattenedPdf: (fileId: string) => Promise<Blob>;
};

type PdfPreviewComponentProps = {
  downloadableUrl?: string;
  fileName: string;
  fileId?: string;
  zoomPercent?: number;
};

/**
 * PDF Preview — web: `pdf-editor.html` with annotations + notes (read-only); native: blob iframe + hash zoom.
 */
export const PdfPreviewComponent = forwardRef<PdfPreviewComponentHandle, PdfPreviewComponentProps>(
  function PdfPreviewComponent(
    {
      downloadableUrl,
      fileName,
      fileId,
      zoomPercent = 100,
    },
    ref,
  ) {
  const user = useUser();
  const [pdfLoadUrl, setPdfLoadUrl] = useState<string | null>(null);
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);
  const [nativeBlobUrl, setNativeBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const webIframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeReadyRef = useRef(false);
  const pdfUrlSentRef = useRef(false);
  const apiNotesRef = useRef<
    {
      id: string;
      value?: unknown;
      created_at?: unknown;
      updated_at?: unknown;
      user?: { id: string; first_name: string; last_name: string } | null;
    }[]
  >([]);
  const apiCanvasAnnotationsRef = useRef<Record<string, unknown>[]>([]);
  const annotationsLoadingRef = useRef(true);
  const zoomPercentRef = useRef(zoomPercent);
  zoomPercentRef.current = zoomPercent;

  const { data: annotationsData, loading: annotationsLoading } = useAnnotationsBySharePointFileQuery({
    variables: { sharepoint_file_id: fileId ?? '', first: 500 },
    skip: Platform.OS !== 'web' || !fileId,
  });

  const normalizedAnnotationRows = useMemo(
    () =>
      (annotationsData?.annotations?.data ?? []).map((a) => ({
        ...a,
        value: normalizeNoteValueForPreview(a.value),
      })),
    [annotationsData],
  );

  const apiNotes = useMemo(
    () =>
      normalizedAnnotationRows.filter(
        (a) => a.value != null && !isCanvasAnnotationValueForPreview(a.value as Record<string, unknown>),
      ),
    [normalizedAnnotationRows],
  );

  const apiCanvasAnnotations = useMemo(
    () =>
      normalizedAnnotationRows
        .filter((a) => a.value != null && isCanvasAnnotationValueForPreview(a.value as Record<string, unknown>))
        .map((a) => {
          const v = a.value as Record<string, unknown>;
          return { id: a.id, ...v } as Record<string, unknown>;
        }),
    [normalizedAnnotationRows],
  );

  apiNotesRef.current = apiNotes;
  apiCanvasAnnotationsRef.current = apiCanvasAnnotations;
  annotationsLoadingRef.current = annotationsLoading;

  useImperativeHandle(ref, () => ({
    exportFlattenedPdf: async (fid: string) => {
      if (Platform.OS !== 'web') {
        throw new Error('Annotated export is only available on web');
      }
      const w = webIframeRef.current?.contentWindow;
      if (!w) {
        throw new Error('PDF preview is not ready yet');
      }
      const pdfArrayBuffer = await getSharePointFileContent(fid);
      return exportFlattenedPdfFromEditorIframe(w, pdfArrayBuffer);
    },
  }));

  useEffect(() => {
    let isCancelled = false;

    const fetchPdfBlob = async (url: string): Promise<Blob> => {
      const response = await fetch(url);
      if (!response.ok) {
        const err: any = new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        err.status = response.status;
        throw err;
      }
      return response.blob();
    };

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      setPdfLoadUrl(null);
      setPdfBuffer(null);
      setNativeBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      pdfUrlSentRef.current = false;
      iframeReadyRef.current = false;

      let urlToUse = downloadableUrl;

      if (!urlToUse && fileId) {
        try {
          const freshUrl = await getSharePointFileDownloadUrl(fileId);
          if (freshUrl && !isCancelled) {
            urlToUse = freshUrl;
          }
        } catch (err) {
          console.warn('Failed to get fresh download URL:', err);
        }
      }

      if (isCancelled) return;

      if (!urlToUse) {
        setError('Download URL not available');
        setLoading(false);
        return;
      }

      if (Platform.OS === 'web') {
        setPdfLoadUrl(urlToUse);
        setLoading(false);
        return;
      }

      try {
        let blob: Blob;

        try {
          blob = await fetchPdfBlob(urlToUse);
          if (isCancelled) return;
        } catch (fetchErr: any) {
          const isAuthError = fetchErr?.status === 401 || fetchErr?.status === 403;

          if (fileId && isAuthError) {
            try {
              const freshUrl = await getSharePointFileDownloadUrl(fileId);
              if (isCancelled) return;

              if (freshUrl && freshUrl !== urlToUse) {
                blob = await fetchPdfBlob(freshUrl);
                if (isCancelled) return;
              } else {
                throw new Error(fetchErr?.message || 'Failed to fetch PDF');
              }
            } catch (retryErr) {
              console.warn('Failed to retry with fresh URL:', retryErr);
              throw new Error(fetchErr?.message || 'Failed to fetch PDF');
            }
          } else {
            throw new Error(fetchErr?.message || 'Failed to fetch PDF');
          }
        }

        if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
          console.warn('File may not be a PDF, but attempting to display:', blob.type);
        }

        const ab = await blob.arrayBuffer();
        if (isCancelled) return;

        setPdfBuffer(ab.slice(0));
        setNativeBlobUrl(URL.createObjectURL(new Blob([ab], { type: 'application/pdf' })));
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;

        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF';
        setError(errorMessage);
        setLoading(false);
        console.error('Error loading PDF:', err);
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      setPdfLoadUrl(null);
      setPdfBuffer(null);
      setNativeBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [downloadableUrl, fileId]);

  const sendUrlToEditor = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const iframe = webIframeRef.current;
    if (!iframe?.contentWindow || !pdfLoadUrl || pdfUrlSentRef.current) return;
    try {
      const w = iframe.contentWindow;
      w.postMessage({ type: 'LOAD_PDF', pdfUrl: pdfLoadUrl }, '*');
      pdfUrlSentRef.current = true;
      w.postMessage({ type: 'SET_ANNOTATIONS_STATE', annotationsEnabled: false, hintMessage: '' }, '*');
      w.postMessage({ type: 'SET_SIGNATURE_MEDIA', signature_media: [] }, '*');
      if (!annotationsLoadingRef.current) {
        const notes = apiNotesRef.current.map((a) => ({
          id: a.id,
          value: a.value ?? null,
          created_at: a.created_at ?? null,
          updated_at: a.updated_at ?? null,
          user: a.user ? { id: a.user.id, first_name: a.user.first_name, last_name: a.user.last_name } : null,
        }));
        w.postMessage({ type: 'SET_NOTES', notes, currentUserId: user?.id ?? null }, '*');
        w.postMessage({ type: 'SET_CANVAS_ANNOTATIONS', annotations: apiCanvasAnnotationsRef.current }, '*');
      }
      w.postMessage({ type: 'SET_ZOOM_PERCENT', percent: zoomPercentRef.current }, '*');
    } catch (_) {}
  }, [pdfLoadUrl, user?.id]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !pdfLoadUrl) return;

    const handleMessage = (event: MessageEvent) => {
      const iframe = webIframeRef.current;
      if (!iframe?.contentWindow || event.source !== iframe.contentWindow) return;
      const msgType = event.data?.type;
      if (msgType === 'PDF_EDITOR_READY') {
        iframeReadyRef.current = true;
        pdfUrlSentRef.current = false;
        sendUrlToEditor();
        return;
      }
      if (msgType === 'PDF_RENDERED' && !annotationsLoadingRef.current) {
        const notes = apiNotesRef.current.map((a) => ({
          id: a.id,
          value: a.value ?? null,
          created_at: a.created_at ?? null,
          updated_at: a.updated_at ?? null,
          user: a.user ? { id: a.user.id, first_name: a.user.first_name, last_name: a.user.last_name } : null,
        }));
        iframe.contentWindow?.postMessage(
          { type: 'SET_NOTES', notes, currentUserId: user?.id ?? null },
          '*',
        );
        iframe.contentWindow?.postMessage(
          { type: 'SET_CANVAS_ANNOTATIONS', annotations: apiCanvasAnnotationsRef.current },
          '*',
        );
      }
    };

    window.addEventListener('message', handleMessage);
    if (iframeReadyRef.current) {
      pdfUrlSentRef.current = false;
      sendUrlToEditor();
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [pdfLoadUrl, sendUrlToEditor]);

  useEffect(() => {
    if (Platform.OS !== 'web' || annotationsLoading || !iframeReadyRef.current || !pdfUrlSentRef.current) return;
    const w = webIframeRef.current?.contentWindow;
    if (!w) return;
    const notes = apiNotes.map((a) => ({
      id: a.id,
      value: a.value ?? null,
      created_at: a.created_at ?? null,
      updated_at: a.updated_at ?? null,
      user: a.user ? { id: a.user.id, first_name: a.user.first_name, last_name: a.user.last_name } : null,
    }));
    w.postMessage({ type: 'SET_NOTES', notes, currentUserId: user?.id ?? null }, '*');
    w.postMessage({ type: 'SET_CANVAS_ANNOTATIONS', annotations: apiCanvasAnnotations }, '*');
  }, [apiNotes, apiCanvasAnnotations, annotationsLoading, user?.id]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !pdfUrlSentRef.current || !webIframeRef.current?.contentWindow) return;
    webIframeRef.current.contentWindow.postMessage({ type: 'SET_ZOOM_PERCENT', percent: zoomPercent }, '*');
  }, [zoomPercent]);

  const zoomHash = Math.min(400, Math.max(25, Math.round(zoomPercent)));

  const webReady = Platform.OS === 'web' && pdfLoadUrl;
  const nativeReady = Platform.OS !== 'web' && pdfBuffer && nativeBlobUrl;

  if (loading) {
    return (
      <IndiYStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        gap="$2"
      >
        <IndiText color="$textSecondary">Loading PDF preview...</IndiText>
      </IndiYStack>
    );
  }

  if (error || (!webReady && !nativeReady)) {
    return (
      <IndiYStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        gap="$3"
      >
        <IndiText color="$error" textAlign="center">
          {error || 'Failed to load PDF preview'}
        </IndiText>
        <IndiText fontSize="$2" color="$textSecondary" textAlign="center">
          Click "Edit" to open the file in a new tab.
        </IndiText>
      </IndiYStack>
    );
  }

  const title = `Preview of ${fileName}`;
  const pdfPreviewChromeBg = '#EDF2F7' as const;
  /** Fill the modal body (flex) exactly; avoid window-based minHeight — it exceeded the area below the custom header and clipped at the modal’s overflow:hidden. */
  const iframeShellStyle = {
    flex: 1,
    minHeight: 0,
    width: '100%' as const,
    alignSelf: 'stretch' as const,
    backgroundColor: pdfPreviewChromeBg,
    position: 'relative' as const,
  };
  const iframeStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none' as const,
    display: 'block' as const,
    backgroundColor: pdfPreviewChromeBg,
  };

  if (Platform.OS !== 'web') {
    const iframeSrc = `${nativeBlobUrl}#page=1&toolbar=0&zoom=${zoomHash}`;
    return (
      <View style={iframeShellStyle}>
        <iframe
          key={`pdf-zoom-${zoomHash}`}
          src={iframeSrc}
          style={iframeStyle}
          title={title}
          allow="fullscreen"
        />
      </View>
    );
  }

  return (
    <View style={iframeShellStyle}>
      <iframe
        ref={webIframeRef}
        key={pdfLoadUrl ?? 'pdf-preview'}
        src={PDF_EDITOR_EMBED_PREVIEW_SRC}
        style={iframeStyle}
        title={title}
        allow="fullscreen"
      />
    </View>
  );
  },
);

PdfPreviewComponent.displayName = 'PdfPreviewComponent';

type FilePreviewComponentProps = {
  file: FolderExplorerFile | any;
  onDownload: (file: FolderExplorerFile) => void | Promise<void>;
  onClose?: () => void;
  onSupersede?: (file: FolderExplorerFile) => void | Promise<void>;
  onRestore?: (file: FolderExplorerFile) => void | Promise<void>;
  onCheckOut?: (file: FolderExplorerFile) => void | Promise<void>;
  onCheckIn?: (file: FolderExplorerFile) => void | Promise<void>;
  /** When provided and file is PDF: check out file then navigate to PDF editor. Called after successful checkout. */
  onEditPdf?: (file: FolderExplorerFile) => void | Promise<void>;
  availableFolders?: FolderExplorerFile[];
  onShortcutsCreated?: () => void;
};

/**
 * File Preview Component - Shows file information with action buttons in IndiModal
 */
export function FilePreviewComponent({ file, onDownload, onClose, onSupersede, onRestore, onCheckOut, onCheckIn, onEditPdf, availableFolders = [], onShortcutsCreated }: FilePreviewComponentProps) {
  // Convert file from FileManager format to FolderExplorerFile format (if needed)
  const explorerFile: FolderExplorerFile =
    (file as FolderExplorerFile).webUrl !== undefined
      ? (file as FolderExplorerFile)
      : {
          id: file.id || '',
          name: file.name || '',
          isDirectory: file.isDirectory || false,
          path: file.path || '',
          updatedAt: file.updatedAt,
          size: file.size,
          mimeType: file.mimeType,
          downloadableUrl: file.downloadableUrl,
          openableUrl: file.openableUrl,
          webUrl: file.webUrl,
          isSuperseded: file.isSuperseded,
          isArchived: file.isArchived,
          source: (file as FolderExplorerFile).source,
          sourceId: (file as FolderExplorerFile).sourceId,
          listItemId: (file as FolderExplorerFile).listItemId,
        };

  const getSharePointFolderUrl = (): string | null => {
    if (!explorerFile.webUrl) {
      return null;
    }

    try {
      const url = new URL(explorerFile.webUrl);
      const pathParts = url.pathname.split('/').filter(part => part);

      if (pathParts.length > 0) {
        pathParts.pop();
      }

      const folderPath = pathParts.length > 0 ? '/' + pathParts.join('/') : url.pathname;
      return `${url.origin}${folderPath}`;
    } catch (error) {
      console.error('Error constructing SharePoint folder URL:', error);
      if (explorerFile.name) {
        const lastSlashIndex = explorerFile.webUrl.lastIndexOf('/');
        if (lastSlashIndex > 0) {
          return explorerFile.webUrl.substring(0, lastSlashIndex);
        }
      }
      return null;
    }
  };

  // Determine if modal should be open (file exists and is not a directory)
  const isOpen = !explorerFile.isDirectory && !!explorerFile.webUrl;
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [versions, setVersions] = useState<SharePointVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [documentInfoOpen, setDocumentInfoOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  const handleOpenShortcutModal = useCallback(() => {
    setIsShortcutModalOpen(true);
  }, []);

  const handleShortcutsCreated = useCallback(() => {
    setIsShortcutModalOpen(false);
    setIsModalOpen(false);
    onShortcutsCreated?.();
  }, [onShortcutsCreated]);

  // Update modal state when file changes
  useEffect(() => {
    setIsModalOpen(isOpen);
    if (isOpen) {
      setZoomPercent(100);
      setDocumentInfoOpen(false);
      setVersionHistoryOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setZoomPercent(100);
    setDocumentInfoOpen(false);
    setVersionHistoryOpen(false);
  }, [explorerFile.id]);

  // Fetch version history when the Version history drawer is open
  useEffect(() => {
    if (versionHistoryOpen && explorerFile.id && !explorerFile.isDirectory) {
      setLoadingVersions(true);
      getSharePointFileVersions(explorerFile.id)
        .then(setVersions)
        .catch((error) => {
          console.error('Error fetching version history:', error);
          Toast.error({ message: 'Failed to load version history' });
          setVersions([]);
        })
        .finally(() => setLoadingVersions(false));
    }
  }, [versionHistoryOpen, explorerFile.id, explorerFile.isDirectory]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  // Don't show preview for directories
  if (explorerFile.isDirectory || !explorerFile.webUrl) {
    return null;
  }

  const isPdf = isPdfFile(explorerFile.mimeType, explorerFile.name);
  const isImage = isImageFile(explorerFile.mimeType, explorerFile.name);
  const isPdfFileName = explorerFile.name?.toLowerCase().includes('.pdf') ?? false;
  const showZoomToolbar = isPdf || isImage;

  const zoomIn = () => {
    setZoomPercent(prev => {
      const next = ZOOM_LEVELS.find(z => z > prev);
      return next ?? prev;
    });
  };

  const zoomOut = () => {
    setZoomPercent(prev => {
      const next = [...ZOOM_LEVELS].reverse().find(z => z < prev);
      return next ?? prev;
    });
  };

  const pdfPreviewRef = useRef<PdfPreviewComponentHandle | null>(null);
  const [downloadExporting, setDownloadExporting] = useState(false);

  const handleDownloadPress = useCallback(async () => {
    if (Platform.OS === 'web' && isPdf && explorerFile.id && pdfPreviewRef.current) {
      try {
        setDownloadExporting(true);
        const blob = await pdfPreviewRef.current.exportFlattenedPdf(explorerFile.id);
        const rawName = (explorerFile.name || 'document').replace(/\.pdf$/i, '');
        const safeBase = rawName.replace(/[/\\:*?"<>|]/g, '_').trim() || 'document';
        const downloadName = `${safeBase}-annotated.pdf`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        Toast.success({ message: 'Downloaded PDF with annotations' });
        return;
      } catch (err) {
        console.error(err);
        Toast.error({
          message:
            err instanceof Error
              ? `${err.message} Downloading original file.`
              : 'Could not flatten annotations. Downloading original file.',
        });
      } finally {
        setDownloadExporting(false);
      }
    }
    await onDownload(explorerFile);
  }, [isPdf, explorerFile, onDownload]);

  const documentInfoRows: { label: string; value: string }[] = [
    {
      label: 'File type:',
      value: getFileTypeInfo(explorerFile.mimeType, explorerFile.name),
    },
    { label: 'Size:', value: formatFileSize(explorerFile.size) },
    {
      label: 'Last modified at:',
      value: explorerFile.updatedAt ? formatDate(explorerFile.updatedAt) : '—',
    },
    { label: 'Last modified by:', value: '—' },
  ];

  const fileDropdownData = useMemo(
    () => [
      {
        text: 'Document info',
        icon: Info,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: true,
        onPress: () => {
          setDocumentInfoOpen(true);
          setVersionHistoryOpen(false);
        },
      },
      {
        text: 'Version history',
        icon: History,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: true,
        onPress: () => {
          setVersionHistoryOpen(true);
          setDocumentInfoOpen(false);
        },
      },
      {
        text: 'Create shortcut',
        icon: Link2,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: availableFolders.length > 0,
        onPress: () => handleOpenShortcutModal(),
      },
      {
        text: 'Supersede',
        icon: Replace,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: !!(onSupersede && !explorerFile.isSuperseded && !explorerFile.isArchived),
        onPress: () => onSupersede?.(explorerFile),
      },
      {
        text: 'Restore',
        icon: ArchiveRestore,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: !!(onRestore && (explorerFile.isSuperseded || explorerFile.isArchived)),
        onPress: () => onRestore?.(explorerFile),
      },
    ],
    [
      availableFolders.length,
      explorerFile,
      handleOpenShortcutModal,
      onSupersede,
      onRestore,
    ],
  );

  const openInDropdownData = useMemo(
    () => [
      {
        text: 'Open in Revu',
        icon: ExternalLink,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: true,
        disabled: !isPdfFileName,
        onPress: () => {
          if (!isPdfFileName || !explorerFile.webUrl) return;
          window.open(`openspinrevu:${explorerFile.webUrl}`, '_blank');
        },
      },
      {
        text: 'Open in SharePoint',
        icon: ExternalLink,
        type: 'ghost' as const,
        color: 'secondary' as const,
        visible: true,
        onPress: () => {
          const folderUrl = getSharePointFolderUrl();
          if (folderUrl) {
            window.open(folderUrl, '_blank');
          }
        },
      },
    ],
    [isPdfFileName, explorerFile],
  );

  /** Preview column only; paired with optional left Document info drawer (Figma [V1] File preview - Document info). */
  const previewContent = (
    <>
      {isPdf ? (
        <IndiYStack flex={1} minHeight={0} width="100%">
          <PdfPreviewComponent
            ref={pdfPreviewRef}
            downloadableUrl={explorerFile.downloadableUrl}
            fileName={explorerFile.name}
            fileId={explorerFile.id}
            zoomPercent={zoomPercent}
          />
        </IndiYStack>
      ) : isImage ? (
        <IndiYStack flex={1} minHeight={0} gap="$2" width="100%">
          {(explorerFile.isSuperseded || explorerFile.isArchived) && (
            <IndiXStack paddingHorizontal="$4" paddingTop="$2" gap="$2" alignItems="center">
              <IndiText fontSize="$2" color="$textSecondary">
                Status:
              </IndiText>
              <IndiText fontSize="$2" fontWeight="500" color="$textPrimary">
                {explorerFile.isSuperseded ? 'Superseded' : explorerFile.isArchived ? 'Archived' : ''}
              </IndiText>
            </IndiXStack>
          )}
          <ImagePreviewComponent
            downloadableUrl={explorerFile.downloadableUrl}
            webUrl={explorerFile.webUrl}
            fileName={explorerFile.name}
            zoomPercent={zoomPercent}
          />
        </IndiYStack>
      ) : (
        <IndiYStack
          padding="$4"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          gap="$4"
        >
          <IndiYStack alignItems="center" gap="$3" maxWidth="600px">
            <IndiText fontSize="$6" fontWeight="bold" textAlign="center">
              {explorerFile.name}
            </IndiText>
            
            <IndiYStack gap="$2" alignItems="center" width="100%">
              <IndiXStack gap="$2" alignItems="center" justifyContent="center">
                <IndiText color="$textSecondary" fontSize="$3">
                  {getFileTypeInfo(explorerFile.mimeType, explorerFile.name)}
                </IndiText>
              </IndiXStack>
              
              {(explorerFile.isSuperseded || explorerFile.isArchived) && (
                <IndiXStack gap="$2" alignItems="center" justifyContent="center">
                  <IndiText fontSize="$2" color="$textSecondary">
                    Status:
                  </IndiText>
                  <IndiText fontSize="$2" fontWeight="500" color="$textPrimary">
                    {explorerFile.isSuperseded ? 'Superseded' : explorerFile.isArchived ? 'Archived' : ''}
                  </IndiText>
                </IndiXStack>
              )}
              
              <IndiXStack gap="$4" alignItems="center" justifyContent="center" flexWrap="wrap">
                <IndiYStack alignItems="center" gap="$1">
                  <IndiText fontSize="$1" color="$textSecondary">
                    Size
                  </IndiText>
                  <IndiText fontSize="$2" fontWeight="500">
                    {formatFileSize(explorerFile.size)}
                  </IndiText>
                </IndiYStack>
                
                {explorerFile.updatedAt && (
                  <IndiYStack alignItems="center" gap="$1">
                    <IndiText fontSize="$1" color="$textSecondary">
                      Modified
                    </IndiText>
                    <IndiText fontSize="$2" fontWeight="500">
                      {formatDate(explorerFile.updatedAt)}
                    </IndiText>
                  </IndiYStack>
                )}
                
                {(explorerFile.isSuperseded || explorerFile.isArchived) && (
                  <IndiYStack alignItems="center" gap="$1">
                    <IndiText fontSize="$1" color="$textSecondary">
                      Status
                    </IndiText>
                    <IndiText fontSize="$2" fontWeight="500">
                      {explorerFile.isSuperseded ? 'Superseded' : explorerFile.isArchived ? 'Archived' : ''}
                    </IndiText>
                  </IndiYStack>
                )}
              </IndiXStack>
            </IndiYStack>
            
            <IndiParagraph fontSize="$2" color="$textSecondary" textAlign="center" mt="$2">
              Use the toolbar to download, edit, or open this file in Revu or SharePoint.
            </IndiParagraph>
          </IndiYStack>
        </IndiYStack>
      )}
    </>
  );

  const leftDrawerOpen = documentInfoOpen || versionHistoryOpen;

  const mainContent = (
    <IndiXStack flex={1} minHeight={0} width="100%" alignItems="stretch">
      {documentInfoOpen && (
        <IndiYStack
          width={360}
          maxWidth={400}
          flexShrink={0}
          borderRightWidth={1}
          borderRightColor="$border"
          backgroundColor="$modalBg"
          padding="$4"
          gap="$4"
          alignSelf="stretch">
          <IndiXStack width="100%" alignItems="center" justifyContent="space-between" gap="$4">
            <IndiText fontSize={14} fontWeight="600" color="$textNeutral" flex={1}>
              Document info
            </IndiText>
            <IndiButton
              type="ghost"
              color="secondary"
              size="xs"
              icon={X}
              handlePress={() => setDocumentInfoOpen(false)}
              aria-label="Close document info"
            />
          </IndiXStack>
          <IndiYStack gap="$2" width="100%">
            {documentInfoRows.map(row => (
              <IndiXStack
                key={row.label}
                width="100%"
                flexWrap="wrap"
                gap="$2"
                alignItems="flex-start">
                <IndiYStack width={120} minWidth={120}>
                  <IndiText fontSize={14} color="$textSecondary">
                    {row.label}
                  </IndiText>
                </IndiYStack>
                <IndiYStack flex={1} minWidth={120}>
                  <IndiText fontSize={14} color="$textNeutral">
                    {row.value}
                  </IndiText>
                </IndiYStack>
              </IndiXStack>
            ))}
          </IndiYStack>
        </IndiYStack>
      )}
      {versionHistoryOpen && (
        <IndiYStack
          width={520}
          maxWidth={560}
          flexShrink={0}
          borderRightWidth={1}
          borderRightColor="$border"
          backgroundColor="$modalBg"
          padding="$4"
          gap="$4"
          alignSelf="stretch"
          minHeight={0}>
          <IndiXStack width="100%" alignItems="center" justifyContent="space-between" gap="$4">
            <IndiText fontSize={14} fontWeight="600" color="$textNeutral" flex={1}>
              Version History
            </IndiText>
            <IndiButton
              type="ghost"
              color="secondary"
              size="xs"
              icon={X}
              handlePress={() => setVersionHistoryOpen(false)}
              aria-label="Close version history"
            />
          </IndiXStack>
          <IndiYStack flex={1} minHeight={0} width="100%">
            {loadingVersions ? (
              <IndiYStack flex={1} alignItems="center" justifyContent="center" minHeight={160}>
                <IndiText color="$textSecondary">Loading version history...</IndiText>
              </IndiYStack>
            ) : versions.length === 0 ? (
              <IndiYStack flex={1} alignItems="center" justifyContent="center" minHeight={160}>
                <IndiText color="$textSecondary">No version history available</IndiText>
              </IndiYStack>
            ) : (
              <>
                <IndiXStack
                  width="100%"
                  gap="$2"
                  alignItems="center"
                  paddingVertical={12}
                  borderBottomWidth={1}
                  borderBottomColor="$border">
                  <IndiYStack width={80} flexShrink={0}>
                    <IndiText
                      fontSize={10}
                      fontWeight="600"
                      color="$textSecondary"
                      letterSpacing={1}
                      textTransform="uppercase">
                      Version no.
                    </IndiText>
                  </IndiYStack>
                  <IndiYStack flex={1} minWidth={0}>
                    <IndiText
                      fontSize={10}
                      fontWeight="600"
                      color="$textSecondary"
                      letterSpacing={1}
                      textTransform="uppercase">
                      Action
                    </IndiText>
                  </IndiYStack>
                  <IndiYStack width={40} flexShrink={0} />
                </IndiXStack>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
                  <IndiYStack width="100%">
                    {versions.map((version, index) => {
                      const previousVersion = index < versions.length - 1 ? versions[index + 1] : null;
                      const statusChanged = previousVersion && previousVersion.status !== version.status;
                      const tooltipChanged = previousVersion && previousVersion.tooltip !== version.tooltip;
                      const shortcutsChanged = previousVersion && previousVersion.shortcuts !== version.shortcuts;
                      const hasCheckinComment = !!(version.checkinComment && version.checkinComment.trim() !== '');

                      if (!statusChanged && !tooltipChanged && !shortcutsChanged && !hasCheckinComment) {
                        return null;
                      }

                      const versionNo = versions.length - index;
                      const actionTitle = getVersionActionTitle(version, {
                        statusChanged: !!statusChanged,
                        tooltipChanged: !!tooltipChanged,
                        shortcutsChanged: !!shortcutsChanged,
                        hasCheckinComment,
                      });
                      const meta = formatVersionHistoryMeta(
                        version.lastModifiedDateTime,
                        version.lastModifiedBy?.user?.displayName
                      );

                      return (
                        <IndiXStack
                          key={version.id}
                          width="100%"
                          gap="$2"
                          alignItems="flex-start"
                          paddingVertical={12}
                          borderBottomWidth={1}
                          borderBottomColor="$border">
                          <IndiYStack width={80} flexShrink={0}>
                            <IndiText fontSize={12} color="$textSecondary">
                              {versionNo}
                            </IndiText>
                          </IndiYStack>
                          <IndiYStack flex={1} minWidth={0} gap="$2">
                            <IndiText fontSize={14} color="$textNeutral">
                              {actionTitle}
                            </IndiText>
                            <IndiText fontSize={12} color="$textSecondary">
                              {meta}
                            </IndiText>
                          </IndiYStack>
                          <IndiYStack flexShrink={0}>
                            <IndiButton
                              type="ghost"
                              color="secondary"
                              size="xs"
                              icon={MoreHorizontal}
                              handlePress={() => {}}
                              aria-label="Version actions"
                            />
                          </IndiYStack>
                        </IndiXStack>
                      );
                    })}
                  </IndiYStack>
                </ScrollView>
              </>
            )}
          </IndiYStack>
        </IndiYStack>
      )}
      <IndiYStack
        flex={1}
        minHeight={0}
        width="100%"
        paddingHorizontal={leftDrawerOpen ? '$4' : 0}>
        {previewContent}
      </IndiYStack>
    </IndiXStack>
  );

  const filePreviewHeader = (
    <IndiYStack
      borderBottomWidth={1}
      borderBottomColor="$border"
      padding="$4"
      gap="$4"
      backgroundColor="$modalBg">
      <IndiXStack width="100%" alignItems="center" gap="$4" justifyContent="space-between">
        <IndiText
          flex={1}
          fontSize={16}
          fontWeight="600"
          color="$textNeutral"
          numberOfLines={1}
          ellipsizeMode="tail">
          {explorerFile.name}
        </IndiText>
        <IndiButton
          type="ghost"
          color="secondary"
          size="xs"
          icon={X}
          handlePress={handleClose}
          aria-label="Close preview"
        />
      </IndiXStack>

      <IndiXStack width="100%" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$4">
        <IndiXStack alignItems="center" gap="$4" flexWrap="wrap">
          <IndiDropdown
            placement="bottom-start"
            trigger={
              <IndiButton
                type="ghost"
                color="secondary"
                size="sm"
                text="File"
                iconAfter={<ChevronDown size={16} color="$iconNeutral" />}
              />
            }
            data={fileDropdownData}
          />

          <IndiButton
            type="ghost"
            color="secondary"
            size="sm"
            text="Edit"
            icon={Pencil}
            handlePress={() => {
              if (isPdf && onEditPdf) {
                void onEditPdf(explorerFile);
                return;
              }
              if (explorerFile.webUrl) {
                handleClose();
                window.open(explorerFile.webUrl, '_blank');
              }
            }}
          />

          <IndiDropdown
            placement="bottom-start"
            trigger={
              <IndiButton
                type="ghost"
                color="secondary"
                size="sm"
                text="Open in"
                iconAfter={<ChevronDown size={16} color="$iconNeutral" />}
              />
            }
            data={openInDropdownData}
          />
        </IndiXStack>

        <IndiXStack alignItems="center" gap="$4" flexWrap="wrap">
          {showZoomToolbar && (
            <>
              <IndiButton
                type="ghost"
                color="secondary"
                size="sm"
                icon={<ZoomOut size={20} color="$iconSecondary" />}
                handlePress={zoomOut}
                aria-label="Zoom out"
                width="$9"
                height="$9"
              />
              <IndiButton
                type="ghost"
                color="secondary"
                size="sm"
                icon={<ZoomIn size={20} color="$iconSecondary" />}
                handlePress={zoomIn}
                aria-label="Zoom in"
                width="$9"
                height="$9"
              />
              <IndiXStack width={88} flexShrink={0} alignSelf="center">
                <IndiSelect
                  data={ZOOM_SELECT_DATA}
                  value={zoomPercent}
                  onChange={setZoomPercent}
                  triggerWidth={88}
                  containerProps={{ minWidth: 80, flexShrink: 0 }}
                />
              </IndiXStack>
              <IndiYStack width={1} height={24} backgroundColor="$border" />
            </>
          )}

          <IndiButton
            type="ghost"
            color="secondary"
            size="sm"
            text="Download"
            icon={Download}
            loading={downloadExporting}
            handlePress={handleDownloadPress}
          />
        </IndiXStack>
      </IndiXStack>
    </IndiYStack>
  );

  return (
    <>
      <IndiModal
        isOpen={isModalOpen}
        setIsOpen={v => {
          if (!v) handleClose();
        }}
        customHeader={filePreviewHeader}
        contentPaddingHorizontal={0}
        contentPaddingVertical={0}
        fullScreen
        disableBodyScroll
        hideFooter
        size="xl">
        <IndiYStack flex={1} minHeight={0} width="100%" backgroundColor="$contrastBg">
          <IndiYStack
            flex={1}
            minHeight={0}
            width="100%"
            alignSelf="stretch"
            paddingHorizontal={leftDrawerOpen ? 0 : '$4'}>
            {mainContent}
          </IndiYStack>
        </IndiYStack>
      </IndiModal>
      
      <CreateShortcutModal
        isOpen={isShortcutModalOpen}
        setIsOpen={setIsShortcutModalOpen}
        sourceFile={explorerFile}
        availableFolders={availableFolders}
        onShortcutsCreated={handleShortcutsCreated}
      />
    </>
  );
}

