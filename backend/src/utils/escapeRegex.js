const escapeRegex = (string) => {
  if (!string) return "";
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export default escapeRegex;
