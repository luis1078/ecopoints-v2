"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth";
import type { SaldoResponse } from "@/lib/types";

export default function MiCuentaPage() {
  return (
    <RequireAuth>
      <MiCuenta />
    </RequireAuth>
  );
}

function MiCuenta() {
  const { usuario } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["saldo"],
    queryFn: () => api<SaldoResponse>("/api/mi/saldo"),
  });

  return (
    <>
      <PageHeader title="Mi cuenta" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <div className="rounded-xl bg-white dark:bg-surface-800 p-8 text-center shadow-[0_0_45px_rgba(0,0,0,0.08)] dark:shadow-[0_0_45px_rgba(0,0,0,0.35)]">
          <p className="text-xl font-semibold text-dark dark:text-ink">{usuario!.nombre}</p>
          <p className="text-sm text-slate-500 dark:text-ink-faint">{usuario!.email}</p>
          <p className="mt-6 text-5xl font-bold text-primary">
            {data?.saldo ?? 0}
          </p>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-ink-faint">
            puntos disponibles
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-dark dark:text-ink">Historial de movimientos</h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-ink-faint">Cargando…</p>
        ) : data!.movimientos.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-ink-faint">
            Aún no tienes movimientos. Valida un código para empezar.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-forest-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 text-right font-medium">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-forest-700">
                {data!.movimientos.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-surface-800" : "bg-light/40 dark:bg-surface-900/40"}>
                    <td className="px-4 py-3 text-slate-900 dark:text-ink">{m.descripcion ?? m.tipo}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-ink-faint">
                      {new Date(m.fecha).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        m.puntos > 0 ? "text-primary" : "text-slate-600 dark:text-ink-muted"
                      }`}
                    >
                      {m.puntos > 0 ? "+" : ""}
                      {m.puntos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
