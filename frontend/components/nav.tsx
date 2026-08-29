"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { SaldoResponse } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

const enlaces = [
  { href: "/inicio", texto: "Inicio" },
  { href: "/misiones", texto: "Misiones" },
  { href: "/validar", texto: "Validar código" },
  { href: "/recompensas", texto: "Recompensas" },
  { href: "/mis-canjes", texto: "Mis canjes" },
  { href: "/mi-cuenta", texto: "Mi cuenta" },
];

export function Nav() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ["saldo"],
    queryFn: () => api<SaldoResponse>("/api/mi/saldo"),
    enabled: !!usuario,
  });

  if (!usuario) return null;

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center gap-x-8 gap-y-2 bg-white px-4 py-3 shadow-sm dark:bg-surface-800 sm:px-8">
      <Link href="/inicio" className="flex items-center gap-2">
        <Image src="/img/logo-solo.png" alt="EcoPoints" width={36} height={36} />
        <span className="text-xl font-semibold text-dark dark:text-ink">
          EcoPoints
        </span>
      </Link>

      <ul className="flex flex-1 flex-wrap gap-6 text-[15px] font-medium">
        {enlaces.map((e) => (
          <li key={e.href}>
            <Link
              href={e.href}
              className={
                pathname === e.href || pathname.startsWith(e.href + "/")
                  ? "text-primary"
                  : "text-dark/80 transition-colors hover:text-primary dark:text-ink-muted"
              }
            >
              {e.texto}
            </Link>
          </li>
        ))}
        {usuario.rol === "admin" && (
          <li>
            <Link
              href="/admin"
              className={
                pathname.startsWith("/admin")
                  ? "text-primary"
                  : "text-dark/80 transition-colors hover:text-primary dark:text-ink-muted"
              }
            >
              Admin
            </Link>
          </li>
        )}
      </ul>

      <span className="rounded-full bg-light px-4 py-1.5 text-sm font-semibold text-dark dark:bg-surface-700 dark:text-ink">
        {data?.saldo ?? "—"} pts
      </span>

      <ThemeToggle />

      <button
        onClick={logout}
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
      >
        Salir <i className="fas fa-sign-out-alt ms-2" />
      </button>
    </nav>
  );
}
