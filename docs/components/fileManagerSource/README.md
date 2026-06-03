# FileManager editable source

This is the **source** of the FileManager used in the app. It is built from the [react-file-manager](https://github.com/Saifullah-dev/react-file-manager) repo (frontend/src) so you can edit it in-tree.

## Build

From project root:

```bash
yarn build:file-manager
```

Output goes to `components/fileManager/dist/`. The app imports from `@/components/fileManager`, which uses that build.

## Adding or changing list columns

- **Column headers:** `FileManager/FileList/FilesHeader.jsx` — add/remove `<div className="file-name">`, `file-date`, `file-size`, and wire `handleSort` as needed.
- **Row cells:** `FileManager/FileList/FileItem.jsx` — in list layout, match the same columns and add any new fields from the `file` object.

See `components/fileManager/README.md` for more detail.
