import { Sun, Moon } from "lucide-react";
import { useColorMode } from "@/hooks/useColorMode";
import { cn } from "@/lib/utils";

export function ColorModeToggle() {
  const { mode, toggle } = useColorMode();
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className={cn(
        "relative h-9 w-9 rounded-lg flex items-center justify-center",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "transition-colors duration-200 overflow-hidden"
      )}
    >
      {/* Sun icon — shown in dark mode (click → go light) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        )}
      >
        <Sun className="h-4 w-4" />
      </span>

      {/* Moon icon — shown in light mode (click → go dark) */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-300",
          !isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        )}
      >
        <Moon className="h-4 w-4" />
      </span>
    </button>
  );
}
