import { FaFilePdf, FaFileWord, FaFileExcel, FaImage, FaFile } from "react-icons/fa6";

// Colors matching AttachmentCell.tsx
const FILE_COLORS = {
  pdf: "#E53E3E",
  word: "#3182CE",
  excel: "#38A169",
  image: "#805AD5",
  other: "#718096",
};

export const useFileIcons = (size) => {
  const fileIcons = {
    pdf: <FaFilePdf size={size} color={FILE_COLORS.pdf} />,
    jpg: <FaImage size={size} color={FILE_COLORS.image} />,
    jpeg: <FaImage size={size} color={FILE_COLORS.image} />,
    png: <FaImage size={size} color={FILE_COLORS.image} />,
    gif: <FaImage size={size} color={FILE_COLORS.image} />,
    webp: <FaImage size={size} color={FILE_COLORS.image} />,
    bmp: <FaImage size={size} color={FILE_COLORS.image} />,
    ico: <FaImage size={size} color={FILE_COLORS.image} />,
    tiff: <FaImage size={size} color={FILE_COLORS.image} />,
    tif: <FaImage size={size} color={FILE_COLORS.image} />,
    svg: <FaImage size={size} color={FILE_COLORS.image} />,
    txt: <FaFile size={size} color={FILE_COLORS.other} />,
    doc: <FaFileWord size={size} color={FILE_COLORS.word} />,
    docx: <FaFileWord size={size} color={FILE_COLORS.word} />,
    mp4: <FaFile size={size} color={FILE_COLORS.other} />,
    webm: <FaFile size={size} color={FILE_COLORS.other} />,
    mp3: <FaFile size={size} color={FILE_COLORS.other} />,
    m4a: <FaFile size={size} color={FILE_COLORS.other} />,
    zip: <FaFile size={size} color={FILE_COLORS.other} />,
    ppt: <FaFile size={size} color={FILE_COLORS.other} />,
    pptx: <FaFile size={size} color={FILE_COLORS.other} />,
    xls: <FaFileExcel size={size} color={FILE_COLORS.excel} />,
    xlsx: <FaFileExcel size={size} color={FILE_COLORS.excel} />,
    exe: <FaFile size={size} color={FILE_COLORS.other} />,
    html: <FaFile size={size} color={FILE_COLORS.other} />,
    css: <FaFile size={size} color={FILE_COLORS.other} />,
    js: <FaFile size={size} color={FILE_COLORS.other} />,
    php: <FaFile size={size} color={FILE_COLORS.other} />,
    py: <FaFile size={size} color={FILE_COLORS.other} />,
    java: <FaFile size={size} color={FILE_COLORS.other} />,
    cpp: <FaFile size={size} color={FILE_COLORS.other} />,
    c: <FaFile size={size} color={FILE_COLORS.other} />,
    ts: <FaFile size={size} color={FILE_COLORS.other} />,
    jsx: <FaFile size={size} color={FILE_COLORS.other} />,
    tsx: <FaFile size={size} color={FILE_COLORS.other} />,
    json: <FaFile size={size} color={FILE_COLORS.other} />,
    xml: <FaFile size={size} color={FILE_COLORS.other} />,
    sql: <FaFile size={size} color={FILE_COLORS.other} />,
    csv: <FaFile size={size} color={FILE_COLORS.other} />,
    md: <FaFile size={size} color={FILE_COLORS.other} />,
  };

  return fileIcons;
};
