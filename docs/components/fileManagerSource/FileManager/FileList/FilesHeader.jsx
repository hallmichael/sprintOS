import { useMemo, useState } from "react";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useFileNavigation } from "../../contexts/FileNavigationContext";
import { useSelection } from "../../contexts/SelectionContext";
import { useTranslation } from "../../contexts/TranslationProvider";

const sortableIds = ["name", "modified", "size"];

const getColumnClass = (id) => {
  if (id === "name") return "file-name";
  if (id === "modified") return "file-date";
  if (id === "size") return "file-size";
  return `file-custom file-col-${id}`;
};

const FilesHeader = ({ unselectFiles, onSort, sortConfig, listColumns = [] }) => {
  const t = useTranslation();

  const [showSelectAll, setShowSelectAll] = useState(false);

  const { selectedFiles, setSelectedFiles } = useSelection();
  const { currentPathFiles } = useFileNavigation();

  const allFilesSelected = useMemo(() => {
    return currentPathFiles.length > 0 && selectedFiles.length === currentPathFiles.length;
  }, [selectedFiles, currentPathFiles]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(currentPathFiles);
      setShowSelectAll(true);
    } else {
      unselectFiles();
    }
  };

  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  const columns =
    listColumns.length > 0
      ? listColumns
      : [
          { id: "name", label: "name" },
          { id: "modified", label: "modified" },
          { id: "size", label: "size" },
        ];

  return (
    <div
      className="files-header"
      onMouseOver={() => setShowSelectAll(true)}
      onMouseLeave={() => setShowSelectAll(false)}
    >
      <div className="file-select-all">
        {(showSelectAll || allFilesSelected) && (
          <Checkbox
            id="selectAll"
            checked={allFilesSelected}
            onChange={handleSelectAll}
            title="Select all"
            disabled={currentPathFiles.length === 0}
          />
        )}
      </div>
      {columns.map((col) => {
        const isSortable = sortableIds.includes(col.id) && (col.sortable !== false);
        const isActive = sortConfig?.key === col.id;
        const label = sortableIds.includes(col.id) ? t(col.id) : col.label;
        return (
          <div
            key={col.id}
            className={`${getColumnClass(col.id)} ${isActive ? "active" : ""}`}
            onClick={isSortable ? () => handleSort(col.id) : undefined}
            role={isSortable ? "button" : undefined}
          >
            {label}
            {isSortable && isActive && (
              <span className="sort-indicator">
                {sortConfig.direction === "asc" ? " ▲" : " ▼"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FilesHeader;