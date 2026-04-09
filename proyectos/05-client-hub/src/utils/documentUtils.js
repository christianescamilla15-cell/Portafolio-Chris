export const fileTypeFromName = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "fig") return "Figma";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "IMG";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx"].includes(ext)) return "XLS";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  return ext.toUpperCase();
};

export const parseSizeMB = (sizeStr) => {
  const n = parseFloat(sizeStr);
  return isNaN(n) ? 0 : n;
};
