"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { tema, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={tema === "dark" ? "Modo claro" : "Modo oscuro"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-dark/80 transition-colors hover:bg-light hover:text-primary dark:text-ink-muted dark:hover:bg-surface-700"
    >
      <i className={`fa ${tema === "dark" ? "fa-sun" : "fa-moon"}`} />
    </button>
  );
}
