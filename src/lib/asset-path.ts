export function withBasePath(path: string): string {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const base = import.meta.env.BASE_URL ?? "/";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (base === "/") return normalizedPath;
  if (path.startsWith(base)) return path;

  const normalizedBase = base.replace(/\/$/, "");
  return `${normalizedBase}${normalizedPath}`;
}
