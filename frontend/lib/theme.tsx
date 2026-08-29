"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Tema = "light" | "dark";

interface ThemeContextValue {
  tema: Tema;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Arranca en "light" para coincidir con el render del servidor. El script
  // inline en <head> (ver layout.tsx) ya aplicó la clase .dark real al <html>
  // antes del primer paint, así que no hay parpadeo visual — este efecto solo
  // sincroniza el ícono del botón con lo que el script ya decidió.
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    setTema(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "dark");
    localStorage.setItem("tema", tema);
  }, [tema]);

  function toggle() {
    setTema((t) => (t === "dark" ? "light" : "dark"));
  }

  return <ThemeContext.Provider value={{ tema, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}
