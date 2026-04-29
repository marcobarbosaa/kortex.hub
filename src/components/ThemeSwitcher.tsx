import { useState, useRef, useEffect } from "react";
import { Palette, Check, X } from "lucide-react";
import { useTheme, THEMES, ThemeId } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeTheme = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Trocar tema"
        className={cn(
          "relative h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200",
          "hover:bg-muted text-muted-foreground hover:text-foreground",
          open && "bg-muted text-foreground"
        )}
      >
        <Palette className="h-4 w-4" />
        {/* Active color dot */}
        <span
          className="absolute bottom-1 right-1 h-2 w-2 rounded-full ring-1 ring-background"
          style={{ background: `hsl(${activeTheme.primary})` }}
        />
      </button>

      {/* Floating panel */}
      {open && (
        <div
          ref={panelRef}
          className={cn(
            "absolute right-0 top-11 z-50 w-56",
            "rounded-xl border border-border/60 shadow-2xl",
            "bg-card/95 backdrop-blur-xl",
            "animate-in fade-in-0 zoom-in-95 duration-150"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Cor do tema
            </p>
            <button
              onClick={() => setOpen(false)}
              className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Swatches grid */}
          <div className="grid grid-cols-3 gap-2 p-3 pt-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as ThemeId);
                  setOpen(false);
                }}
                aria-label={`Tema ${t.label}`}
                className={cn(
                  "group relative flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all duration-200",
                  "hover:bg-muted/60",
                  theme === t.id && "bg-muted/80 ring-1 ring-border"
                )}
              >
                {/* Color circle */}
                <span
                  className="h-8 w-8 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110"
                  style={{ background: t.gradient }}
                >
                  {theme === t.id && (
                    <Check className="h-4 w-4 text-white drop-shadow" />
                  )}
                </span>
                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    theme === t.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          <div className="h-px bg-border/40 mx-3" />

          {/* Footer hint */}
          <p className="text-[10px] text-muted-foreground/60 text-center py-2">
            Preferência salva automaticamente
          </p>
        </div>
      )}
    </div>
  );
}
