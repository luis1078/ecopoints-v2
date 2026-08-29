"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth";
import type { SaldoResponse } from "@/lib/types";

const ACCESOS = [
  {
    href: "/misiones",
    icono: "fa-bullseye",
    titulo: "Misiones",
    texto: "Descubre qué puedes hacer para sumar puntos.",
  },
  {
    href: "/validar",
    icono: "fa-qrcode",
    titulo: "Validar código",
    texto: "Canjea el código que recibiste al completar una misión.",
  },
  {
    href: "/recompensas",
    icono: "fa-gift",
    titulo: "Recompensas",
    texto: "Usa tus puntos para llevarte premios reales.",
  },
  {
    href: "/mis-canjes",
    icono: "fa-receipt",
    titulo: "Mis canjes",
    texto: "Revisa el estado de tus recompensas canjeadas.",
  },
];

export default function InicioPage() {
  return (
    <RequireAuth>
      <Inicio />
    </RequireAuth>
  );
}

function Inicio() {
  const { usuario } = useAuth();

  const { data } = useQuery({
    queryKey: ["saldo"],
    queryFn: () => api<SaldoResponse>("/api/mi/saldo"),
  });

  return (
    <>
      <PageHeader title="Inicio" />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
        <div className="surface-card flex flex-wrap items-center justify-between gap-6 rounded-xl p-8">
          <div>
            <p className="text-subtle text-sm">Bienvenido de vuelta</p>
            <h1 className="text-2xl font-semibold text-dark dark:text-ink">
              {usuario!.nombre}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">{data?.saldo ?? "—"}</p>
            <p className="text-subtle text-sm uppercase tracking-wide">puntos</p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-lg text-center">
          <p className="text-lg font-bold text-primary">¿Qué quieres hacer hoy?</p>
          <h2 className="mt-2 text-3xl font-semibold text-dark dark:text-ink">
            Accesos rápidos
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {ACCESOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="surface-card group flex items-start gap-4 rounded-xl p-6 transition-colors hover:bg-light dark:hover:bg-surface-700"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-light text-lg text-primary dark:bg-surface-700">
                <i className={`fa ${a.icono}`} />
              </span>
              <span>
                <span className="block font-semibold text-dark dark:text-ink">
                  {a.titulo}
                </span>
                <span className="text-subtle mt-1 block text-sm">{a.texto}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
