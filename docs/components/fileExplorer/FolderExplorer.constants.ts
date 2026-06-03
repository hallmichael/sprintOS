import { gql } from '@apollo/client';

export const SETUP_SHAREPOINT_PROJECT_QUERY = gql`
  query setupSharepointProject($project_id: ID!) {
    setupSharepointProject(project_id: $project_id) {
      status
    }
  }
`;

export const DEEP_LOAD_MAX_DEPTH = 5;

export const FOLDER_EXPLORER_STYLES = `
  /* Tooltip styling lives in FileManager FileList.scss (custom-tooltip, custom-tooltip-portal) */
  .shortcut-svg-icon,
  .checked-out-svg-icon {
    color: #666 !important;
  }
  .file-item-container.selected .shortcut-svg-icon,
  .file-item-container.selected .checked-out-svg-icon,
  .file-item-container[data-selected="true"] .shortcut-svg-icon,
  .file-item-container[data-selected="true"] .checked-out-svg-icon,
  .file-item-container.active .shortcut-svg-icon,
  .file-item-container.active .checked-out-svg-icon,
  .file-item-container[aria-selected="true"] .shortcut-svg-icon,
  .file-item-container[aria-selected="true"] .checked-out-svg-icon,
  tr.selected .shortcut-svg-icon,
  tr.selected .checked-out-svg-icon,
  tr[data-selected="true"] .shortcut-svg-icon,
  tr[data-selected="true"] .checked-out-svg-icon,
  [class*="selected"] .shortcut-svg-icon,
  [class*="selected"] .checked-out-svg-icon {
    color: #ffffff !important;
  }
  :root {
    --file-manager-font-family: Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  }
  .file-name,
  .folder-name,
  .sb-folder-name,
  .drop-zone-file-name,
  [class*="file-name"],
  [class*="folder-name"],
  .file-item-container .file-name,
  .file-item-container .folder-name,
  .file-item-container span,
  .file-item-container div,
  .file-item-container td,
  .file-item-container th,
  .file-item-container *,
  .file-explorer,
  .file-explorer *,
  .file-explorer .file-name,
  .file-explorer .folder-name,
  .file-explorer .sb-folder-name,
  .files .file-name,
  .files .folder-name,
  .bread-crumb-container .folder-name,
  .sb-folders-list .sb-folder-name,
  .files-header,
  .files-header *,
  .files-header .file-name,
  .files-header .file-date,
  .files-header .file-size,
  .files-header .file-custom,
  .file-date,
  .file-size,
  .file-custom {
    font-family: Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  }
  [class*="file-manager"],
  [class*="file-manager"] *,
  [class*="react-file-manager"],
  [class*="react-file-manager"] * {
    font-family: Inter, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  }
`;
