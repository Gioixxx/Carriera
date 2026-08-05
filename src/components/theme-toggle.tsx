"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Il tema risolto dipende da localStorage/preferenze di sistema, non note al server:
  // evita il mismatch di hydration renderizzando un placeholder finché non siamo sul client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- vedi commento sopra l'effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("h-9 w-9", className)} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface)",
        "text-(--color-text-muted) transition-colors duration-150 hover:border-(--color-accent) hover:text-(--color-text)",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-background)",
        className,
      )}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
