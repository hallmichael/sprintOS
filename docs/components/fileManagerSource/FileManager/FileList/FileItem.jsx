import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaFolder, FaFile } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { useFileIcons } from "../../hooks/useFileIcons";
import CreateFolderAction from "../Actions/CreateFolder/CreateFolder.action";
import RenameAction from "../Actions/Rename/Rename.action";
import { getDataSize } from "../../utils/getDataSize";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useSelection } from "../../contexts/SelectionContext";
import { useClipBoard } from "../../contexts/ClipboardContext";
import { useLayout } from "../../contexts/LayoutContext";
import Checkbox from "../../components/Checkbox/Checkbox";

const dragIconSize = 14;

const formatCustomColumnValue = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value);
};

const isServiceDetailsArray = (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((v) => v && typeof v === "object" && typeof v.primary === "string");

function ServicesPopover({ items, anchorRef, onClose, fontFamily }) {
  const popoverRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, anchorRef]);
  const rect = anchorRef?.current?.getBoundingClientRect();
  const style = rect
    ? {
        position: "fixed",
        top: rect.bottom + 6,
        left: Math.min(rect.left, window.innerWidth - 360),
        zIndex: 10000,
        ...(fontFamily ? { fontFamily } : {}),
      }
    : fontFamily ? { fontFamily } : {};
  return (
    <>
      <div className="fm-services-popover-backdrop" aria-hidden onClick={onClose} />
      <div ref={popoverRef} className="fm-services-popover" style={style}>
        <div className="fm-services-popover-title">This file is used in the following services</div>
        <ul className="fm-services-popover-list">
          {items.map((item, i) => (
            <li key={i} className="fm-services-popover-item">
              <div className="fm-services-popover-item-content">
                <span className="fm-services-popover-item-primary">{item.primary}</span>
                {item.secondary && (
                  <span className="fm-services-popover-item-secondary">{item.secondary}</span>
                )}
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fm-services-popover-item-link"
                  aria-label="Open service"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LuExternalLink size={14} />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const FileItem = ({
  index,
  file,
  onCreateFolder,
  onRename,
  enableFilePreview,
  onFileOpen,
  filesViewRef,
  selectedFileIndexes,
  triggerAction,
  handleContextMenu,
  setLastSelectedFile,
  draggable,
  formatDate,
  listColumns = [
    { id: "name", label: "name" },
    { id: "modified", label: "modified" },
    { id: "size", label: "size" },
  ],
  fontFamily,
}) => {
  const [fileSelected, setFileSelected] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [checkboxClassName, setCheckboxClassName] = useState("hidden");
  const [dropZoneClass, setDropZoneClass] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [servicesPopoverOpen, setServicesPopoverOpen] = useState(false);
  const servicesTriggerRef = useRef(null);

  const { activeLayout } = useLayout();
  const iconSize = 14;
  const fileIcons = useFileIcons(iconSize);
  const { setCurrentPath, currentPathFiles, onFolderChange } = useFileNavigation();
  const { setSelectedFiles } = useSelection();
  const { clipBoard, handleCutCopy, setClipBoard, handlePasting } = useClipBoard();
  const dragIconRef = useRef(null);
  const dragIcons = useFileIcons(dragIconSize);

  const isFileMoving =
    clipBoard?.isMoving &&
    clipBoard.files.find((f) => f.name === file.name && f.path === file.path);

  const isDisabled = file.disabled === true;
  const isSuperseded = file.isSuperseded === true || file.rawSharePointFile?.status === "Superseded";
  const isArchived = file.isArchived === true || file.rawSharePointFile?.status === "Archived";

  const handleFileAccess = () => {
    onFileOpen(file);
    if (file.isDirectory) {
      setCurrentPath(file.path);
      onFolderChange?.(file.path);
      setSelectedFiles([]);
    } else {
      enableFilePreview && triggerAction.show("previewFile");
    }
  };

  const handleFileRangeSelection = (shiftKey, ctrlKey) => {
    if (selectedFileIndexes.length > 0 && shiftKey) {
      let reverseSelection = false;
      let startRange = selectedFileIndexes[0];
      let endRange = index;

      // Reverse Selection
      if (startRange >= endRange) {
        const temp = startRange;
        startRange = endRange;
        endRange = temp;
        reverseSelection = true;
      }

      const filesRange = currentPathFiles.slice(startRange, endRange + 1);
      setSelectedFiles(reverseSelection ? filesRange.reverse() : filesRange);
    } else if (selectedFileIndexes.length > 0 && ctrlKey) {
      // Remove file from selected files if it already exists on CTRL + Click, otherwise push it in selectedFiles
      setSelectedFiles((prev) => {
        const filteredFiles = prev.filter((f) => f.path !== file.path);
        if (prev.length === filteredFiles.length) {
          return [...prev, file];
        }
        return filteredFiles;
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleFileSelection = (e) => {
    e.stopPropagation();
    if (file.isEditing) return;

    handleFileRangeSelection(e.shiftKey, e.ctrlKey);

    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      handleFileAccess();
      return;
    }
    setLastClickTime(currentTime);
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      setSelectedFiles([file]);
      handleFileAccess();
    }
  };

  const handleItemContextMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (file.isEditing) return;

    if (!fileSelected) {
      setSelectedFiles([file]);
    }

    setLastSelectedFile(file);
    handleContextMenu(e, true);
  };

  // Selection Checkbox Functions
  const handleMouseOver = () => {
    setCheckboxClassName("visible");
  };

  const handleMouseLeave = () => {
    !fileSelected && setCheckboxClassName("hidden");
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name && f.path !== file.path));
    }

    setFileSelected(e.target.checked);
  };
  //

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(dragIconRef.current, 30, 50);
    e.dataTransfer.effectAllowed = "copy";
    handleCutCopy(true);
  };

  const handleDragEnd = () => {
    setClipBoard(null);
    setTooltipPosition(null);
  };

  const handleDragEnterOver = (e) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) {
      e.dataTransfer.dropEffect = "none";
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY + 12 });
      e.dataTransfer.dropEffect = "copy";
      setDropZoneClass("file-drop-zone");
    }
  };

  const handleDragLeave = (e) => {
    // To stay in dragging state for the child elements of the target drop-zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropZoneClass((prev) => (prev ? "" : prev));
      setTooltipPosition(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) return;

    handlePasting(file);
    setDropZoneClass((prev) => (prev ? "" : prev));
    setTooltipPosition(null);
  };

  useEffect(() => {
    setFileSelected(selectedFileIndexes.includes(index));
    setCheckboxClassName(selectedFileIndexes.includes(index) ? "visible" : "hidden");
  }, [selectedFileIndexes]);

  // Clear drag tooltip when drag ends (clipBoard cleared) or when this item's file changes (e.g. folder navigation)
  useEffect(() => {
    if (!clipBoard) setTooltipPosition(null);
  }, [clipBoard]);
  useEffect(() => {
    setTooltipPosition(null);
  }, [file.path]);

  return (
    <div
      className={`file-item-container ${dropZoneClass} ${
        fileSelected || !!file.isEditing ? "file-selected" : ""
      } ${isFileMoving ? "file-moving" : ""} ${
        isDisabled ? "file-disabled" : ""
      } ${isSuperseded ? "file-superseded" : ""} ${isArchived ? "file-archived" : ""}`}
      tabIndex={0}
      title={file.name}
      data-file-id={file.id}
      onClick={handleFileSelection}
      onKeyDown={handleOnKeyDown}
      onContextMenu={handleItemContextMenu}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      draggable={fileSelected && draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnterOver}
      onDragOver={handleDragEnterOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-item">
        {!file.isEditing && (
          <Checkbox
            name={file.name}
            id={file.name}
            checked={fileSelected}
            className={`selection-checkbox ${checkboxClassName}`}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {file.isDirectory ? (
          <FaFolder size={iconSize} color="#FFB547" />
        ) : (
          <>
            {fileIcons[file.name?.split(".").pop()?.toLowerCase()] ?? <FaFile size={iconSize} color="#718096" />}
          </>
        )}

        {file.isEditing ? (
          <div className={`rename-file-container ${activeLayout}`}>
            {triggerAction.actionType === "createFolder" ? (
              <CreateFolderAction
                filesViewRef={filesViewRef}
                file={file}
                onCreateFolder={onCreateFolder}
                triggerAction={triggerAction}
              />
            ) : (
              <RenameAction
                filesViewRef={filesViewRef}
                file={file}
                onRename={onRename}
                triggerAction={triggerAction}
              />
            )}
          </div>
        ) : (
          <span
            className={`text-truncate file-name ${
              isSuperseded ? "file-name-superseded" : ""
            } ${isArchived ? "file-name-archived" : ""}`}
          >
            {file.name}
          </span>
        )}
      </div>

      {activeLayout === "list" &&
        listColumns
          .filter((col) => col.id !== "name")
          .map((col) => {
            if (col.id === "modified") {
              return (
                <div key={col.id} className="modified-date">
                  {formatDate(file.updatedAt)}
                </div>
              );
            }
            if (col.id === "size") {
              return (
                <div key={col.id} className="size">
                  {file?.size > 0 ? getDataSize(file?.size) : ""}
                </div>
              );
            }
            const value = col.fileKey ? file[col.fileKey] : "";
            const isArrayOfNames = Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === "string");
            if (isServiceDetailsArray(value)) {
              const details = value;
              const triggerRef = col.id === "services" ? servicesTriggerRef : null;
              const isOpen = col.id === "services" && servicesPopoverOpen;
              const onToggle = (e) => {
                if (col.id === "services") {
                  e.stopPropagation();
                  e.preventDefault();
                  setServicesPopoverOpen((v) => !v);
                }
              };
              return (
                <div
                  key={col.id}
                  ref={triggerRef}
                  role={col.id === "services" ? "button" : undefined}
                  tabIndex={col.id === "services" ? 0 : undefined}
                  className={`file-custom file-col-${col.id} ${col.id === "services" ? "file-services-trigger" : ""}`}
                  onClick={col.id === "services" ? onToggle : undefined}
                  onKeyDown={col.id === "services" ? (e) => { if (e.key === "Enter" || e.key === " ") onToggle(e); } : undefined}
                >
                  {col.id === "services" ? (
                    <span className="file-services-badge">{details.length}</span>
                  ) : (
                    details.length
                  )}
                  {col.id === "services" && isOpen && createPortal(
                    <ServicesPopover
                      items={details}
                      anchorRef={triggerRef}
                      onClose={() => setServicesPopoverOpen(false)}
                      fontFamily={fontFamily}
                    />,
                    document.body
                  )}
                </div>
              );
            }
            if (isArrayOfNames) {
              const labels = value.filter(Boolean);
              const tooltipText = labels.join("\n");
              return (
                <div
                  key={col.id}
                  className={`file-custom file-col-${col.id}`}
                  title={tooltipText}
                >
                  {labels.length}
                </div>
              );
            }
            return (
              <div key={col.id} className={`file-custom file-col-${col.id}`}>
                {formatCustomColumnValue(value)}
              </div>
            );
          })}

      {/* Drag Icon & Tooltip Setup */}
      {tooltipPosition && (
        <div
          style={{
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
          }}
          className="drag-move-tooltip"
        >
          Move to <span className="drop-zone-file-name">{file.name}</span>
        </div>
      )}

      <div ref={dragIconRef} className="drag-icon">
        {file.isDirectory ? (
          <FaFolder size={dragIconSize} color="#FFB547" />
        ) : (
          <>
            {dragIcons[file.name?.split(".").pop()?.toLowerCase()] ?? (
              <FaFile size={dragIconSize} color="#718096" />
            )}
          </>
        )}
      </div>
      {/* Drag Icon & Tooltip Setup */}
    </div>
  );
};

export default FileItem;
