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
      className={cn(
        "group relative h-9 w-16 rounded-full p-1 transition-all duration-500",
        "bg-foreground/[0.03] border border-foreground/[0.08] hover:border-kortex-orange/30",
        "shadow-inner"
      )}
    >
      <div
        className={cn(
          "h-full w-7 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm",
          isDark 
            ? "translate-x-7 bg-kortex-orange shadow-kortex-orange/20" 
            : "translate-x-0 bg-white"
        )}
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-white animate-in zoom-in spin-in-90 duration-500" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-slate-900 animate-in zoom-in spin-in-90 duration-500" />
        )}
      </div>
    </button>
  );
}
