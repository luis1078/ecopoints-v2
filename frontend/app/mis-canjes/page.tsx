"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import type { Canje } from "@/lib/types";

const ESTADOS: Record<string, { texto: string; clase: string }> = {
  pendiente: {
    texto: "Pendiente de entrega",
    clase: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  entregado: { texto: "Entregado", clase: "bg-light text-dark" },
  cancelado: {
    texto: "Cancelado",
    clase: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
};

export default function MisCanjesPage() {
  return (
    <RequireAuth>
      <MisCanjes />
    </RequireAuth>
  );
}

function MisCanjes() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mis-canjes"],
    queryFn: () => api<Canje[]>("/api/mi/canjes"),
  });

  return (
    <>
      <PageHeader title="Mis canjes" />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <p className="text-center text-sm text-slate-500 dark:text-ink-faint">
          Revisa el estado de tus recompensas canjeadas y recógelas en el punto de
          entrega.
        </p>

        {isLoading && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">Cargando…</p>
        )}
        {isError && (
          <p className="mt-10 text-center text-sm text-red-700">
            No se pudo cargar tu historial de canjes.
          </p>
        )}

        {data?.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">
            Aún no has canjeado ninguna recompensa.
          </p>
        )}

        {data && data.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 dark:border-forest-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="px-4 py-3 font-medium">Recompensa</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Puntos</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-forest-700">
                {data.map((c, i) => {
                  const estado = ESTADOS[c.estado] ?? {
                    texto: c.estado,
                    clase: "bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-ink-muted",
                  };
                  return (
                    <tr key={c.id} className={i % 2 === 0 ? "bg-white dark:bg-surface-800" : "bg-light/40 dark:bg-surface-900/40"}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-ink">
                        {c.recompensa}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-ink-faint">
                        {new Date(c.creadoEn).toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-ink-muted">{c.puntosGastados}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${estado.clase}`}>
                          {estado.texto}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
