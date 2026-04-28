export type ThemeMode = "light" | "dark";

const themeStorageKey = "pollpilot-theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
}

export function toggleTheme(currentTheme: ThemeMode): ThemeMode {
  return currentTheme === "dark" ? "light" : "dark";
}