import { useState, useEffect } from "react";

export type ColorMode = "dark" | "light";

const STORAGE_KEY = "kortex-color-mode";

export function useColorMode() {
  const [mode, setMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ColorMode | null;
    if (saved) return saved;
    // Respect OS preference on first visit
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return { mode, toggle, isDark: mode === "dark" };
}
