# Local FileManager (editable source)

This folder is the **built output** of the FileManager used by `FolderExplorer`. The **editable source** lives in `components/fileManagerSource/`.

## Adding or changing columns (list view)

1. **List header (column titles):**  
   Edit `components/fileManagerSource/FileManager/FileList/FilesHeader.jsx`  
   Add or remove `<div className="file-name">`, `file-date`, `file-size` (or your custom class), and wire `handleSort` if needed.

2. **List row cells (per file):**  
   Edit `components/fileManagerSource/FileManager/FileList/FileItem.jsx`  
   In list layout, match the same column structure (e.g. name, modified date, size) and add any new fields from `file` (e.g. `file.size`, `file.updatedAt`).

3. **Rebuild after editing:**  
   From project root run:
   ```bash
   yarn build:file-manager
   ```
   This rebuilds from `fileManagerSource` into `fileManager/dist/`. The app imports from `@/components/fileManager`, which uses that build.

## Source layout (fileManagerSource)

- `FileManager/FileManager.jsx` – main component and props
- `FileManager/FileList/FilesHeader.jsx` – list view column headers
- `FileManager/FileList/FileItem.jsx` – each file/folder row (grid + list)
- `FileManager/FileList/FileList.jsx` – list/grid container
- Styles: `FileManager/**/*.scss`, `components/**/*.scss`

You can edit any file under `fileManagerSource` and run `yarn build:file-manager` to see changes.
