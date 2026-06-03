import {
  LuPencil,
  LuCopy,
  LuFileSearch,
  LuFolderPlus,
  LuScissors,
  LuClipboardPaste,
  LuRefreshCw,
  LuUpload,
  LuDownload,
  LuTrash2,
  LuArchive,
  LuSquareCheck,
  LuFolderOpen,
} from "react-icons/lu";
import { useClipBoard } from "../../contexts/ClipboardContext";
import { useEffect, useState } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { duplicateNameHandler } from "../../utils/duplicateNameHandler";
import { validateApiCallback } from "../../utils/validateApiCallback";
import { useTranslation } from "../../contexts/TranslationProvider";

const useFileList = (onRefresh, enableFilePreview, triggerAction, permissions, onFileOpen) => {
  const [selectedFileIndexes, setSelectedFileIndexes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isSelectionCtx, setIsSelectionCtx] = useState(false);
  const [clickPosition, setClickPosition] = useState({ clickX: 0, clickY: 0 });
  const [lastSelectedFile, setLastSelectedFile] = useState(null);

  const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard();
  const { selectedFiles, setSelectedFiles, handleDownload } = useSelection();
  const { currentPath, setCurrentPath, currentPathFiles, setCurrentPathFiles, onFolderChange } =
    useFileNavigation();
  const t = useTranslation();

  // Context Menu
  const handleFileOpen = () => {
    onFileOpen(lastSelectedFile);
    if (lastSelectedFile.isDirectory) {
      setCurrentPath(lastSelectedFile.path);
      onFolderChange?.(lastSelectedFile.path);
      setSelectedFileIndexes([]);
      setSelectedFiles([]);
    } else {
      enableFilePreview && triggerAction.show("previewFile");
    }
    setVisible(false);
  };

  const handleMoveOrCopyItems = (isMoving) => {
    handleCutCopy(isMoving);
    setVisible(false);
  };

  const handleFilePasting = () => {
    handlePasting(lastSelectedFile);
    setVisible(false);
  };

  const handleRenaming = () => {
    setVisible(false);
    triggerAction.show("rename");
  };

  const handleDownloadItems = () => {
    handleDownload();
    setVisible(false);
  };

  const handleDelete = () => {
    setVisible(false);
    triggerAction.show("delete");
  };

  const handleRefresh = () => {
    setVisible(false);
    validateApiCallback(onRefresh, "onRefresh");
    setClipBoard(null);
  };

  const handleCreateNewFolder = () => {
    triggerAction.show("createFolder");
    setVisible(false);
  };

  const handleUpload = () => {
    setVisible(false);
    triggerAction.show("uploadFile");
  };

  const handleselectAllFiles = () => {
    setSelectedFiles(currentPathFiles);
    setVisible(false);
  };

  const emptySelecCtxItems = [
    {
      title: t("refresh"),
      icon: <LuRefreshCw size={14} />,
      onClick: handleRefresh,
    },
    {
      title: t("newFolder"),
      icon: <LuFolderPlus size={14} />,
      onClick: handleCreateNewFolder,
      hidden: !permissions.create,
    },
    {
      title: t("upload"),
      icon: <LuUpload size={14} />,
      onClick: handleUpload,
      hidden: !permissions.upload,
    },
    {
      title: t("selectAll"),
      icon: <LuSquareCheck size={14} />,
      onClick: handleselectAllFiles,
    },
  ];

  const selecCtxItems = [
    {
      title: lastSelectedFile?.isDirectory ? "Open Folder" : t("open"),
      icon: lastSelectedFile?.isDirectory ? <LuFolderOpen size={14} /> : <LuFileSearch size={14} />,
      onClick: handleFileOpen,
    },
    {
      title: t("cut"),
      icon: <LuScissors size={14} />,
      onClick: () => handleMoveOrCopyItems(true),
      hidden: !permissions.move,
    },
    {
      title: t("copy"),
      icon: <LuCopy size={14} />,
      onClick: () => handleMoveOrCopyItems(false),
      hidden: !permissions.copy,
    },
    {
      title: t("paste"),
      icon: <LuClipboardPaste size={14} />,
      onClick: handleFilePasting,
      className: `${clipBoard ? "" : "disable-paste"}`,
      hidden: !lastSelectedFile?.isDirectory || (!permissions.move && !permissions.copy),
    },
    {
      title: t("rename"),
      icon: <LuPencil size={14} />,
      onClick: handleRenaming,
      hidden: selectedFiles.length > 1 || !permissions.rename,
    },
    {
      title: t("download"),
      icon: <LuDownload size={14} />,
      onClick: handleDownloadItems,
      hidden: !permissions.download,
    },
    {
      title: t("delete"),
      icon: <LuArchive size={14} />,
      onClick: handleDelete,
      hidden: !permissions.delete,
      className: "fm-context-menu-danger",
    },
  ];
  //

  const handleFolderCreating = () => {
    setCurrentPathFiles((prev) => {
      return [
        ...prev,
        {
          name: duplicateNameHandler("New Folder", true, prev),
          isDirectory: true,
          path: currentPath,
          isEditing: true,
          key: new Date().valueOf(),
        },
      ];
    });
  };

  const handleItemRenaming = () => {
    setCurrentPathFiles((prev) => {
      const lastFileIndex = selectedFileIndexes.at(-1);

      if (!prev[lastFileIndex]) {
        triggerAction.close();
        return prev;
      }

      return prev.map((file, index) => {
        if (index === lastFileIndex) {
          return {
            ...file,
            isEditing: true,
          };
        }

        return file;
      });
    });

    setSelectedFileIndexes([]);
    setSelectedFiles([]);
  };

  const unselectFiles = () => {
    setSelectedFileIndexes([]);
    setSelectedFiles((prev) => (prev.length > 0 ? [] : prev));
  };

  const handleContextMenu = (e, isSelection = false) => {
    e.preventDefault();
    setClickPosition({ clickX: e.clientX, clickY: e.clientY });
    setIsSelectionCtx(isSelection);
    !isSelection && unselectFiles();
    setVisible(true);
  };

  useEffect(() => {
    if (triggerAction.isActive) {
      switch (triggerAction.actionType) {
        case "createFolder":
          handleFolderCreating();
          break;
        case "rename":
          handleItemRenaming();
          break;
      }
    }
  }, [triggerAction.isActive]);

  useEffect(() => {
    setSelectedFileIndexes([]);
    setSelectedFiles([]);
  }, [currentPath]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setSelectedFileIndexes(() => {
        return selectedFiles.map((selectedFile) => {
          return currentPathFiles.findIndex((f) => f.path === selectedFile.path);
        });
      });
    } else {
      setSelectedFileIndexes([]);
    }
  }, [selectedFiles, currentPathFiles]);

  return {
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
  };
};

export default useFileList;
