"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { PROFILE_TEXTS } from "../constants";
import { Sun, Moon, Laptop, Palette } from "lucide-react";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export const ThemeSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <section className="space-y-3 bg-card border border-border/60 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Palette className="size-4 text-primary" />
          <span>{PROFILE_TEXTS.SECTION_THEME_TITLE}</span>
        </div>
        <div className="h-12 bg-muted/20 animate-pulse rounded-xl" />
      </section>
    );
  }

  return (
    <section className="space-y-3 bg-card border border-border/60 p-4 rounded-2xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Palette className="size-4 text-primary" />
        <span>{PROFILE_TEXTS.SECTION_THEME_TITLE}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all min-h-[52px] justify-center ${
            theme === "light"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <Sun className="size-4" />
          <span>{PROFILE_TEXTS.THEME_LIGHT}</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all min-h-[52px] justify-center ${
            theme === "dark"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <Moon className="size-4" />
          <span>{PROFILE_TEXTS.THEME_DARK}</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all min-h-[52px] justify-center ${
            theme === "system"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <Laptop className="size-4" />
          <span>{PROFILE_TEXTS.THEME_SYSTEM}</span>
        </button>
      </div>
    </section>
  );
};
