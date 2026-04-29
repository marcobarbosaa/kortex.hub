import { useState, useEffect } from "react";

export type ThemeId = "blue" | "violet" | "emerald" | "rose" | "amber" | "cyan";

export interface ThemeOption {
  id: ThemeId;
  label: string;
  primary: string; // HSL values for preview swatch
  gradient: string; // CSS gradient for the swatch preview
}

export const THEMES: ThemeOption[] = [
  {
    id: "blue",
    label: "Blue",
    primary: "210 100% 55%",
    gradient: "linear-gradient(135deg, hsl(210,100%,55%), hsl(220,100%,65%))",
  },
  {
    id: "violet",
    label: "Violet",
    primary: "262 83% 62%",
    gradient: "linear-gradient(135deg, hsl(262,83%,62%), hsl(280,80%,70%))",
  },
  {
    id: "emerald",
    label: "Emerald",
    primary: "160 84% 39%",
    gradient: "linear-gradient(135deg, hsl(160,84%,39%), hsl(175,80%,45%))",
  },
  {
    id: "rose",
    label: "Rose",
    primary: "340 82% 58%",
    gradient: "linear-gradient(135deg, hsl(340,82%,58%), hsl(355,80%,65%))",
  },
  {
    id: "amber",
    label: "Amber",
    primary: "38 96% 54%",
    gradient: "linear-gradient(135deg, hsl(38,96%,54%), hsl(50,92%,60%))",
  },
  {
    id: "cyan",
    label: "Cyan",
    primary: "192 91% 46%",
    gradient: "linear-gradient(135deg, hsl(192,91%,46%), hsl(205,88%,52%))",
  },
];

const STORAGE_KEY = "kortex-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    return (localStorage.getItem(STORAGE_KEY) as ThemeId) ?? "blue";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme, themes: THEMES };
}
