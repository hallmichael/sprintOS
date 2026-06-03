import type { SharePointFile } from '@/utils/SharePointService';
import type { ProjectService } from '@/graphql/graphql';

export type FolderExplorerFile = {
  id: string;
  name: string;
  isDirectory: boolean;
  path: string;
  updatedAt?: string;
  size?: number;
  mimeType?: string;
  downloadableUrl?: string;
  openableUrl?: string;
  webUrl?: string;
  collectionName?: string;
  isCheckedOut?: boolean;
  isSuperseded?: boolean;
  isArchived?: boolean;
  disabled?: boolean;
  tooltip?: string;
  shortcuts?: string;
  source?: string;
  sourceId?: string;
  listItemId?: string;
  rawSharePointFile?: SharePointFile;
  projectServiceNames?: string[];
  projectServiceDetails?: Array<{ primary: string; secondary?: string; url?: string }>;
  projectServiceIds?: string;
};

export type FolderExplorerProps = {
  files?: FolderExplorerFile[];
  onFileOpen?: (file: FolderExplorerFile) => void | Promise<void>;
  acceptedFileTypes?: string[];
  showUpload?: boolean;
  showCreateFolder?: boolean;
  onUpload?: () => void | Promise<void>;
  onCreateFolder?: () => void | Promise<void>;
  useSharePoint?: boolean;
  folderPath?: string;
  projectId?: string;
  onSelectionChange?: (selectedFiles: FolderExplorerFile[]) => void;
  projectServices?: Array<ProjectService> | null;
  projectServiceInstallationCertificates?: Array<{ id: string; project_service_id?: string | null }> | null;
  projectServiceChecklistItems?: ProjectServiceChecklistItem[] | null;
  customStyles?: string;
};

export type ProjectServiceChecklistItem = {
  id: string;
  name?: string | null;
  edited_requirement_text?: string | null;
  project_service_id?: string | null;
  project_service?: {
    id?: string;
    name?: string | null;
    service?: { id?: string; name?: string | null } | null;
  } | null;
};

export type ProjectServiceDetailItem = { primary: string; secondary?: string; url?: string };
