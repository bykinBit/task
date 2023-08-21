export function isPlainObject(obj) {
  if (obj !== null && typeof obj !== "object") return false;
  return true;
}
