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
  if (base === "/" || path.startsWith(base)) return path;

  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
