import { useRef, useMemo } from "react";
import FileItem from "./FileItem";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useLayout } from "../../contexts/LayoutContext";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./FileList.scss";

const FileList = ({
  onCreateFolder,
  onRename,
  onFileOpen,
  onRefresh,
  enableFilePreview,
  triggerAction,
  permissions,
  formatDate,
  listColumns = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" },
  ],
  fontFamily,
  searchTerm = "",
}) => {
  const { currentPathFiles, sortConfig, setSortConfig } = useFileNavigation();
  const filesViewRef = useRef(null);
  const { activeLayout } = useLayout();
  const t = useTranslation();

  const filteredFiles = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return currentPathFiles || [];
    const term = searchTerm.trim().toLowerCase();
    return (currentPathFiles || []).filter(
      (f) => f.name && f.name.toLowerCase().includes(term)
    );
  }, [currentPathFiles, searchTerm]);

  const {
    emptySelecCtxItems,
    selecCtxItems,
    handleContextMenu,
    unselectFiles,
    visible,
    setVisible,
    setLastSelectedFile,
    selectedFileIndexes,
    clickPosition,
    isSelectionCtx,
  } = useFileList(onRefresh, enableFilePreview, triggerAction, permissions, onFileOpen);

  const contextMenuRef = useDetectOutsideClick(() => setVisible(false));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div
      ref={filesViewRef}
      className={`files ${activeLayout}`}
      onContextMenu={handleContextMenu}
      onClick={unselectFiles}
    >
      {activeLayout === "list" && (
        <FilesHeader
          unselectFiles={unselectFiles}
          onSort={handleSort}
          sortConfig={sortConfig}
          listColumns={listColumns}
        />
      )}

      {filteredFiles?.length > 0 ? (
        <>
          {filteredFiles.map((file, index) => (
            <FileItem
              key={index}
              index={index}
              file={file}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onFileOpen={onFileOpen}
              enableFilePreview={enableFilePreview}
              triggerAction={triggerAction}
              filesViewRef={filesViewRef}
              selectedFileIndexes={selectedFileIndexes}
              handleContextMenu={handleContextMenu}
              setVisible={setVisible}
              setLastSelectedFile={setLastSelectedFile}
              draggable={permissions.move}
              formatDate={formatDate}
              listColumns={listColumns}
              fontFamily={fontFamily}
            />
          ))}
        </>
      ) : (
        <div className="empty-folder">
          {searchTerm?.trim()
            ? t("searchNoResults") || "No matching files in this folder"
            : t("folderEmpty")}
        </div>
      )}

      <ContextMenu
        filesViewRef={filesViewRef}
        contextMenuRef={contextMenuRef.ref}
        menuItems={isSelectionCtx ? selecCtxItems : emptySelecCtxItems}
        visible={visible}
        setVisible={setVisible}
        clickPosition={clickPosition}
      />
    </div>
  );
};

FileList.displayName = "FileList";

export default FileList;
