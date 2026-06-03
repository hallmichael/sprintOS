import {
  LuSearch,
  LuRefreshCw,
  LuFolderPlus,
  LuUpload,
  LuCopy,
  LuScissors,
  LuX,
  LuPencil,
  LuDownload,
  LuTrash2,
  LuClipboardPaste,
  LuEllipsis,
  LuArchive,
  LuArchiveX,
  LuEye,
  LuEyeOff,
} from "react-icons/lu";
import { useDetectOutsideClick } from "../../hooks/useDetectOutsideClick";
import { useState } from "react";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useSelection } from "../../contexts/SelectionContext";
import { useClipBoard } from "../../contexts/ClipboardContext";
import { validateApiCallback } from "../../utils/validateApiCallback";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./Toolbar.scss";

function getProjectServiceLabel(ps) {
  if (!ps) return "";
  const serviceName = ps.service?.name?.trim?.() ?? "";
  const psName = ps.name?.trim?.() ?? "";
  if (serviceName && psName) return `${serviceName} - ${psName}`;
  return psName || serviceName || ps.id || "";
}

const Toolbar = ({
  onRefresh,
  triggerAction,
  permissions,
  searchTerm = "",
  setSearchTerm,
  searchInputVisible = false,
  setSearchInputVisible,
  projectServices,
  selectedServiceId = "all",
  setSelectedServiceId,
  toolbarFilterContent,
  renderSearchInput,
  hideSupersededFiles = false,
  setHideSupersededFiles,
  showArchivedFiles = false,
  setShowArchivedFiles,
}) => {
  const { currentFolder } = useFileNavigation();
  const { selectedFiles, setSelectedFiles, handleDownload } = useSelection();
  const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard();
  const t = useTranslation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useDetectOutsideClick(() => setMoreMenuOpen(false));

  // Toolbar Items - Filter by service (when projectServices provided), Paste on left; New folder, Upload, Search, Refresh on right
  const toolbarLeftItems = [
    {
      icon: <LuClipboardPaste size={14} />,
      text: t("paste"),
      permission: !!clipBoard,
      onClick: handleFilePasting,
    },
  ];

  const toolbarRightItems = [
    {
      icon: <LuFolderPlus size={14} />,
      text: t("newFolder"),
      title: t("newFolder"),
      permission: permissions.create,
      onClick: () => triggerAction.show("createFolder"),
    },
    {
      icon: <LuUpload size={14} />,
      text: t("upload"),
      title: t("upload"),
      permission: permissions.upload,
      onClick: () => triggerAction.show("uploadFile"),
    },
  ];

  const visibleRightItems = toolbarRightItems.filter(
    (item) => item.permission === undefined || item.permission
  );

  function handleFilePasting() {
    handlePasting(currentFolder);
  }

  const handleDownloadItems = () => {
    handleDownload();
    setSelectedFiles([]);
  };

  // Selected File/Folder Actions
  if (selectedFiles.length > 0) {
    return (
      <div className="toolbar file-selected">
        <div className="file-action-container">
          <div>
            {permissions.move && (
              <button className="item-action file-action" onClick={() => handleCutCopy(true)}>
                <LuScissors size={14} />
                <span>{t("cut")}</span>
              </button>
            )}
            {permissions.copy && (
              <button className="item-action file-action" onClick={() => handleCutCopy(false)}>
                <LuCopy size={14} />
                <span>{t("copy")}</span>
              </button>
            )}
            {clipBoard?.files?.length > 0 && (
              <button
                className="item-action file-action"
                onClick={handleFilePasting}
                // disabled={!clipBoard}
              >
                <LuClipboardPaste size={14} />
                <span>{t("paste")}</span>
              </button>
            )}
            {selectedFiles.length === 1 && permissions.rename && (
              <button
                className="item-action file-action"
                onClick={() => triggerAction.show("rename")}
              >
                <LuPencil size={14} />
                <span>{t("rename")}</span>
              </button>
            )}
            {permissions.download && (
              <button className="item-action file-action" onClick={handleDownloadItems}>
                <LuDownload size={14} />
                <span>{t("download")}</span>
              </button>
            )}
            {permissions.delete && (
              <button
                className="item-action file-action"
                onClick={() => triggerAction.show("delete")}
              >
                <LuArchive size={14} />
                <span>{t("delete")}</span>
              </button>
            )}
          </div>
          <button
            className="item-action file-action"
            title={t("clearSelection")}
            onClick={() => setSelectedFiles([])}
          >
            <span>
              {selectedFiles.length}{" "}
              {t(selectedFiles.length > 1 ? "itemsSelected" : "itemSelected")}
            </span>
            <LuX size={14} />
          </button>
        </div>
      </div>
    );
  }
  //

  return (
    <div className="toolbar">
      <div className="fm-toolbar">
        <div className="fm-toolbar-left">
          {toolbarFilterContent != null ? (
            toolbarFilterContent
          ) : Array.isArray(projectServices) && projectServices.length > 0 && setSelectedServiceId ? (
            <div className="fm-toolbar-filter-wrap">
              <label htmlFor="fm-filter-by-service" className="fm-toolbar-filter-label">
                {t("filterByService") || "Filter by service"}
              </label>
              <select
                id="fm-filter-by-service"
                className="fm-toolbar-filter-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                aria-label={t("filterByService") || "Filter by service"}
              >
                <option value="all">{t("all") || "All"}</option>
                {projectServices.map((ps) => (
                  <option key={ps.id} value={ps.id}>
                    {getProjectServiceLabel(ps)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          {toolbarLeftItems
            .filter((item) => item.permission)
            .map((item, index) => (
              <button className="item-action" key={index} onClick={item.onClick}>
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
        </div>
        <div>
          {visibleRightItems.map((item, index) => (
            <div key={index} className="toolbar-left-items">
              <button
                className={`item-action ${item.text ? "" : "icon-only"}`}
                title={item.title}
                onClick={item.onClick}
              >
                {item.icon}
                {item.text && <span>{item.text}</span>}
              </button>
            </div>
          ))}
          {setHideSupersededFiles != null && setShowArchivedFiles != null && (
            <div className="toolbar-left-items fm-toolbar-more-wrap" ref={moreMenuRef.ref}>
              <button
                type="button"
                className="item-action"
                title={t("more") || "More"}
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={moreMenuOpen}
                aria-label={t("more") || "More"}
              >
                <LuEllipsis size={14} />
                <span>{t("more") || "More"}</span>
              </button>
              {moreMenuOpen && (
                <div className="fm-toolbar-more-dropdown" role="menu">
                  <button
                    type="button"
                    className="fm-toolbar-more-item"
                    role="menuitem"
                    onClick={() => setHideSupersededFiles((prev) => !prev)}
                  >
                    {hideSupersededFiles ? (
                      <>
                        <LuEye size={14} />
                        <span>{t("showSupersededFiles") || "Show superseded files"}</span>
                      </>
                    ) : (
                      <>
                        <LuEyeOff size={14} />
                        <span>{t("hideSupersededFiles") || "Hide superseded files"}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="fm-toolbar-more-item"
                    role="menuitem"
                    onClick={() => setShowArchivedFiles((prev) => !prev)}
                  >
                    {showArchivedFiles ? (
                      <>
                        <LuArchiveX size={14} />
                        <span>{t("hideArchivedFiles") || "Hide archived files"}</span>
                      </>
                    ) : (
                      <>
                        <LuArchive size={14} />
                        <span>{t("showArchivedFiles") || "Show archived files"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          {setSearchInputVisible != null && (
            <div className="toolbar-left-items">
              <div className="item-separator"></div>
              {searchInputVisible ? (
                renderSearchInput ? (
                  <div className="fm-toolbar-search-wrap">
                    {renderSearchInput({
                      value: searchTerm,
                      onChangeText: setSearchTerm,
                      placeholder: t("searchPlaceholder") || "Search",
                      onClear: () => {
                        setSearchTerm("");
                        setSearchInputVisible(false);
                      },
                    })}
                  </div>
                ) : (
                  <div className="fm-toolbar-search-wrap">
                    <span className="fm-toolbar-search-icon-left" aria-hidden>
                      <LuSearch size={14} />
                    </span>
                    <input
                      type="text"
                      className="fm-toolbar-search-input"
                      placeholder={t("searchPlaceholder") || "Search"}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      aria-label={t("searchPlaceholder") || "Search"}
                    />
                    <button
                      type="button"
                      className="fm-toolbar-search-clear"
                      title={t("close")}
                      onClick={() => {
                        setSearchTerm("");
                        setSearchInputVisible(false);
                      }}
                      aria-label={t("close")}
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                )
              ) : (
                <button
                  type="button"
                  className="item-action icon-only"
                  title={t("search") || "Search"}
                  onClick={() => setSearchInputVisible(true)}
                  aria-label={t("search") || "Search"}
                >
                  <LuSearch size={14} />
                </button>
              )}
            </div>
          )}
          <div className="toolbar-left-items">
            <button
              className="item-action icon-only"
              title={t("refresh")}
              onClick={() => {
                validateApiCallback(onRefresh, "onRefresh");
                setClipBoard(null);
              }}
            >
              <LuRefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Toolbar.displayName = "Toolbar";

export default Toolbar;
