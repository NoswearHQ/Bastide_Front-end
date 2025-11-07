const STORAGE_PREFIX = "scroll-position:";

export function rememberScrollPosition(targetPath: string, position?: number) {
  if (typeof window === "undefined") return;
  const top = position ?? window.scrollY ?? 0;
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${targetPath}`, String(top));
  } catch (error) {
    console.warn("Unable to persist scroll position", error);
  }
}

export function consumeScrollPosition(targetPath: string): number | null {
  if (typeof window === "undefined") return null;
  const key = `${STORAGE_PREFIX}${targetPath}`;
  const stored = sessionStorage.getItem(key);
  if (stored == null) return null;
  sessionStorage.removeItem(key);
  const value = Number(stored);
  return Number.isFinite(value) ? value : null;
}


