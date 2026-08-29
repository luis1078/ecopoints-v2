"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function PublicNav() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-3 shadow-sm dark:bg-surface-800 sm:px-8">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/img/logo-solo.png" alt="EcoPoints" width={36} height={36} />
        <span className="text-xl font-semibold text-dark dark:text-ink">
          EcoPoints
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/contacto"
          className="text-sm font-medium text-dark/80 transition-colors hover:text-primary dark:text-ink-muted"
        >
          Contacto
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-dark/80 transition-colors hover:text-primary dark:text-ink-muted"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary"
        >
          Registrarme
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
