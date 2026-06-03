import Loader from "../components/Loader/Loader";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";
import { FilesProvider } from "../contexts/FilesContext";
import { FileNavigationProvider } from "../contexts/FileNavigationContext";
import { SelectionProvider } from "../contexts/SelectionContext";
import { ClipBoardProvider } from "../contexts/ClipboardContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import { useTriggerAction } from "../hooks/useTriggerAction";
import { useColumnResize } from "../hooks/useColumnResize";
import PropTypes from "prop-types";
import { dateStringValidator, optionalUrlValidator, urlValidator } from "../validators/propValidators";
import { TranslationProvider } from "../contexts/TranslationProvider";
import { forwardRef, useMemo, useState } from "react";
import { defaultPermissions } from "../constants";
import { formatDate as defaultFormatDate } from "../utils/formatDate";
import "./FileManager.scss";

const FileManager = forwardRef(function FileManager(
  {
    files,
    fileUploadConfig,
    isLoading,
    onCreateFolder,
    onFileUploading = () => {},
    onFileUploaded = () => {},
    onCut,
    onCopy,
    onPaste,
    onRename,
    onDownload,
    onDelete = () => null,
    onLayoutChange = () => {},
    onRefresh,
    onFileOpen = () => {},
    onFolderChange = () => {},
    onSelect,
    onSelectionChange,
    onError = () => {},
    layout = "list",
    enableFilePreview = true,
    maxFileSize,
    filePreviewPath,
    acceptedFileTypes,
    height = "600px",
    width = "100%",
    initialPath = "",
    filePreviewComponent,
    primaryColor = "#6155b4",
    fontFamily = "Nunito Sans, sans-serif",
    language = "en-US",
    permissions: userPermissions = {},
    collapsibleNav = false,
    defaultNavExpanded = true,
    className = "",
    style = {},
    formatDate = defaultFormatDate,
    listColumns,
    projectServices,
    renderToolbarFilter,
    renderSearchInput,
  },
  ref
) {
  const defaultListColumns = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" },
  ];
  const resolvedListColumns = listColumns && listColumns.length > 0 ? listColumns : defaultListColumns;
  const [isNavigationPaneOpen, setNavigationPaneOpen] = useState(defaultNavExpanded);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("all");
  const [hideSupersededFiles, setHideSupersededFiles] = useState(false);
  const [showArchivedFiles, setShowArchivedFiles] = useState(false);
  const triggerAction = useTriggerAction();

  const isFileSuperseded = (file) =>
    file.isSuperseded === true || file.rawSharePointFile?.status === "Superseded";
  const isFileArchived = (file) =>
    file.isArchived === true || file.rawSharePointFile?.status === "Archived";

  const displayedFiles = useMemo(() => {
    const list = Array.isArray(files) ? files : [];
    let result = list;
    if (selectedServiceId && selectedServiceId !== "all") {
      result = result.filter((file) => {
        if (file.isDirectory) return true;
        const idsStr = file.projectServiceIds ?? file.rawSharePointFile?.projectServiceIds ?? "";
        const ids = idsStr.toString().split(",").map((s) => s.trim()).filter(Boolean);
        return ids.includes(selectedServiceId);
      });
    }
    result = result.filter((file) => {
      if (file.isDirectory) return true;
      if (hideSupersededFiles && isFileSuperseded(file)) return false;
      if (!showArchivedFiles && isFileArchived(file)) return false;
      return true;
    });
    return result;
  }, [files, selectedServiceId, hideSupersededFiles, showArchivedFiles]);
  const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } =
    useColumnResize(20, 80);
  const customStyles = {
    "--file-manager-font-family": fontFamily,
    "--file-manager-primary-color": primaryColor,
    height,
    width,
  };

  const permissions = useMemo(
    () => ({ ...defaultPermissions, ...userPermissions }),
    [userPermissions]
  );

  return (
    <main
      ref={ref}
      className={`file-explorer ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ...customStyles, ...style }}
    >
      <Loader loading={isLoading} />
      <TranslationProvider language={language}>
        <FilesProvider filesData={displayedFiles} onError={onError}>
          <FileNavigationProvider initialPath={initialPath} onFolderChange={onFolderChange}>
            <SelectionProvider
              onDownload={onDownload}
              onSelect={onSelect}
              onSelectionChange={onSelectionChange}
            >
              <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
                <LayoutProvider layout={layout}>
                  <Toolbar
                    onRefresh={onRefresh}
                    triggerAction={triggerAction}
                    permissions={permissions}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchInputVisible={searchInputVisible}
                    setSearchInputVisible={setSearchInputVisible}
                    projectServices={projectServices}
                    selectedServiceId={selectedServiceId}
                    setSelectedServiceId={setSelectedServiceId}
                    toolbarFilterContent={
                      renderToolbarFilter?.({
                        projectServices: projectServices ?? [],
                        selectedServiceId,
                        setSelectedServiceId,
                      })
                    }
                    renderSearchInput={renderSearchInput}
                    hideSupersededFiles={hideSupersededFiles}
                    setHideSupersededFiles={setHideSupersededFiles}
                    showArchivedFiles={showArchivedFiles}
                    setShowArchivedFiles={setShowArchivedFiles}
                  />
                  <section
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="files-container"
                  >
                    <div
                      className={`navigation-pane ${isNavigationPaneOpen ? "open" : "closed"}`}
                      style={{
                        width: colSizes.col1 + "%",
                      }}
                    >
                      <NavigationPane onFileOpen={onFileOpen} />
                      <div
                        className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                        onMouseDown={handleMouseDown}
                      />
                    </div>

                    <div
                      className="folders-preview"
                      style={{ width: (isNavigationPaneOpen ? colSizes.col2 : 100) + "%" }}
                    >
                      <BreadCrumb
                        collapsibleNav={collapsibleNav}
                        isNavigationPaneOpen={isNavigationPaneOpen}
                        setNavigationPaneOpen={setNavigationPaneOpen}
                      />
                      <FileList
                        onCreateFolder={onCreateFolder}
                        onRename={onRename}
                        onFileOpen={onFileOpen}
                        onRefresh={onRefresh}
                        enableFilePreview={enableFilePreview}
                        triggerAction={triggerAction}
                        permissions={permissions}
                        formatDate={formatDate}
                        listColumns={resolvedListColumns}
                        fontFamily={fontFamily}
                        searchTerm={searchTerm}
                      />
                    </div>
                  </section>

                  <Actions
                    fileUploadConfig={fileUploadConfig}
                    onFileUploading={onFileUploading}
                    onFileUploaded={onFileUploaded}
                    onDelete={onDelete}
                    onRefresh={onRefresh}
                    maxFileSize={maxFileSize}
                    filePreviewPath={filePreviewPath}
                    filePreviewComponent={filePreviewComponent}
                    acceptedFileTypes={acceptedFileTypes}
                    triggerAction={triggerAction}
                    permissions={permissions}
                  />
                </LayoutProvider>
              </ClipBoardProvider>
            </SelectionProvider>
          </FileNavigationProvider>
        </FilesProvider>
      </TranslationProvider>
    </main>
  );
});

FileManager.displayName = "FileManager";

FileManager.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isDirectory: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      updatedAt: dateStringValidator,
      size: PropTypes.number,
    })
  ).isRequired,
  fileUploadConfig: PropTypes.shape({
    url: urlValidator,
    headers: PropTypes.objectOf(PropTypes.string),
    method: PropTypes.oneOf(["POST", "PUT"]),
  }),
  isLoading: PropTypes.bool,
  onCreateFolder: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onDownload: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onFileOpen: PropTypes.func,
  onFolderChange: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onError: PropTypes.func,
  layout: PropTypes.oneOf(["grid", "list"]),
  maxFileSize: PropTypes.number,
  enableFilePreview: PropTypes.bool,
  filePreviewPath: optionalUrlValidator,
  acceptedFileTypes: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPath: PropTypes.string,
  filePreviewComponent: PropTypes.func,
  primaryColor: PropTypes.string,
  fontFamily: PropTypes.string,
  language: PropTypes.string,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    upload: PropTypes.bool,
    move: PropTypes.bool,
    copy: PropTypes.bool,
    rename: PropTypes.bool,
    download: PropTypes.bool,
    delete: PropTypes.bool,
  }),
  collapsibleNav: PropTypes.bool,
  defaultNavExpanded: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  formatDate: PropTypes.func,
  listColumns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      fileKey: PropTypes.string,
    })
  ),
  projectServices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      service: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ),
  renderToolbarFilter: PropTypes.func,
  renderSearchInput: PropTypes.func,
};

export default FileManager;
