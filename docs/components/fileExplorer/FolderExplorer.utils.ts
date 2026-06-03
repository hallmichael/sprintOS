import type { SharePointFile } from '@/utils/SharePointService';
import type { ProjectService } from '@/graphql/graphql';
import type { FolderExplorerFile, ProjectServiceDetailItem, ProjectServiceChecklistItem } from './FolderExplorer.types';

// --- Path helpers ---

export function normalizePath(path: string): string {
  if (!path) return '';
  return path.replace(/^\/+|\/+$/g, '');
}

export function getParentPath(filePath: string): string {
  if (!filePath) return '';
  const normalized = normalizePath(filePath);
  return normalized.substring(0, normalized.lastIndexOf('/')) || '';
}

export function ensureLeadingSlash(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function removeLeadingSlash(path: string): string {
  if (!path) return '';
  return path.startsWith('/') ? path.slice(1) : path;
}

/** True if `path` is exactly `root` or a subfolder of `root` (both normalized, no leading slash). */
export function isSharePointPathUnderRoot(path: string, root: string): boolean {
  const p = normalizePath(path);
  const r = normalizePath(root);
  if (!r) return true;
  if (p === r) return true;
  return p.startsWith(`${r}/`);
}

// --- HTML / DOM ---

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** Hide all custom-tooltip-portal elements (used when navigating so hover tooltip doesn't persist) */
export function hideAllPortalTooltips(): void {
  document.querySelectorAll('.custom-tooltip-portal').forEach((el) => {
    (el as HTMLElement).style.opacity = '0';
    (el as HTMLElement).style.visibility = 'hidden';
  });
}

// --- SharePoint → Explorer file ---

export function convertSharePointToExplorerFile(spFile: SharePointFile): FolderExplorerFile {
  const path = spFile.path || (spFile.name ? `/${spFile.name}` : '/');
  const isCheckedOut = !!spFile.checkedOutBy;
  const status = spFile.status;
  const isSuperseded = status === 'Superseded';
  const isArchived = status === 'Archived';

  return {
    id: spFile.id || '',
    name: spFile.name || '',
    isDirectory: spFile.isDirectory || false,
    path,
    updatedAt: spFile.lastModifiedDateTime,
    size: spFile.size,
    mimeType: spFile.mimeType,
    downloadableUrl: spFile['@microsoft.graph.downloadUrl'],
    openableUrl: spFile.webUrl,
    webUrl: spFile.webUrl,
    isCheckedOut,
    isSuperseded: isSuperseded || false,
    isArchived: isArchived || false,
    disabled: undefined,
    tooltip: spFile.tooltip,
    shortcuts: spFile.shortcuts,
    source: spFile.source,
    sourceId: spFile.sourceId,
    listItemId: spFile.listItemId,
    rawSharePointFile: spFile,
    projectServiceIds: spFile.projectServiceIds,
  };
}

// --- Project service resolution ---

export function parseProjectServiceIds(value: string | undefined | null): string[] {
  if (value == null || value === '') return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export function resolveProjectServiceNames(
  projectServiceIds: string | undefined | null,
  projectServices: Array<ProjectService> | null | undefined
): string[] {
  if (!projectServices?.length) return [];
  const ids = parseProjectServiceIds(projectServiceIds);
  return ids
    .map((id) => {
      const ps = projectServices.find((s) => String(s.id) === String(id));
      if (!ps) return null;
      const serviceName = (ps as { service?: { name?: string | null } | null }).service?.name?.trim() ?? '';
      const psName = ps.name?.trim() ?? '';
      if (serviceName && psName) return `${serviceName} - ${psName}`;
      if (serviceName) return serviceName;
      if (psName) return psName;
      return null;
    })
    .filter((label): label is string => label != null && label !== '');
}

export function buildDetailItem(
  ps: { id: string; name?: string | null; service?: { name?: string | null } | null },
  projectId: string | undefined,
  secondary?: string
): ProjectServiceDetailItem | null {
  const serviceName = ps.service?.name?.trim() ?? '';
  const psName = ps.name?.trim() ?? '';
  const primary = serviceName && psName ? `${serviceName} - ${psName}` : serviceName || psName || '';
  if (!primary) return null;
  let url = projectId ? `/projects/${projectId}/services/${ps.id}` : undefined;
  if (url && secondary === 'Installation Certificates') {
    url = `${url}#certificates`;
  }
  return { primary, ...(secondary ? { secondary } : {}), url };
}

export function resolveProjectServiceDetailsWithTypes(
  file: {
    projectServiceIds?: string | null;
    projectServiceInstallationCertificateIds?: string | null;
    requirementIds?: string | null;
    rawSharePointFile?: SharePointFile | null;
  },
  projectServices: Array<ProjectService> | null | undefined,
  projectServiceInstallationCertificates: Array<{ id: string; project_service_id?: string | null }> | null | undefined,
  projectId: string | undefined,
  projectServiceChecklistItems?: ProjectServiceChecklistItem[] | null
): ProjectServiceDetailItem[] {
  if (!projectServices?.length) return [];
  const result: ProjectServiceDetailItem[] = [];
  const psicList = projectServiceInstallationCertificates ?? [];
  const checklistItemsById = new Map<string, { name?: string | null; project_service_id?: string | null }>();
  for (const item of projectServiceChecklistItems ?? []) {
    const serviceName = item.project_service?.service?.name?.trim();
    const projectServiceName = item.project_service?.name?.trim();
    const displayName = [serviceName, projectServiceName].filter(Boolean).join(' - ') || undefined;
    checklistItemsById.set(String(item.id), {
      name: displayName,
      project_service_id: item.project_service_id ?? item.project_service?.id,
    });
  }
  const raw = file.rawSharePointFile ?? file;

  const psicIds = (raw.projectServiceInstallationCertificateIds ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const psicId of psicIds) {
    const psic = psicList.find((c) => String(c.id) === String(psicId));
    const projectServiceId = psic?.project_service_id;
    if (!projectServiceId) continue;
    const ps = projectServices.find((s) => String(s.id) === String(projectServiceId));
    if (!ps) continue;
    const item = buildDetailItem(
      ps as { id: string; name?: string | null; service?: { name?: string | null } | null },
      projectId,
      'Installation Certificates'
    );
    if (item) result.push(item);
  }

  const reqIds = (raw.requirementIds ?? (file as { requirementIds?: string | null }).requirementIds ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const reqId of reqIds) {
    const checklistItem = checklistItemsById.get(String(reqId));
    const primary = checklistItem?.name?.trim() || 'Requirements';
    const projectServiceId = checklistItem?.project_service_id;
    const url =
      projectId && projectServiceId
        ? `/projects/${projectId}/services/${projectServiceId}#requirements`
        : projectId
          ? `/projects/${projectId}/services#requirements`
          : undefined;
    result.push({ primary, secondary: 'Requirements', url });
  }

  return result;
}

export function resolveProjectServiceDetails(
  projectServiceIds: string | undefined | null,
  projectServices: Array<ProjectService> | null | undefined,
  projectId: string | undefined
): ProjectServiceDetailItem[] {
  if (!projectServices?.length) return [];
  const ids = parseProjectServiceIds(projectServiceIds);
  return ids
    .map((id) => {
      const ps = projectServices.find((s) => String(s.id) === String(id));
      if (!ps) return null;
      const serviceName = (ps as { service?: { name?: string | null } | null }).service?.name?.trim() ?? '';
      const psName = ps.name?.trim() ?? '';
      const primary = serviceName && psName ? `${serviceName} - ${psName}` : serviceName || psName || '';
      if (!primary) return null;
      const url = projectId ? `/projects/${projectId}/services/${ps.id}` : undefined;
      return { primary, url } as ProjectServiceDetailItem;
    })
    .filter((item): item is ProjectServiceDetailItem => item != null && item.primary !== '');
}
