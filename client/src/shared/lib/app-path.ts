// src/lib/app-path.ts
export function assetPath(path: string) {
  const base = import.meta.env.BASE_URL || "/"
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base

  if (!path || path === "/") {
    return normalizedBase || "/"
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}