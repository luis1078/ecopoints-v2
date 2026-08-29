"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import type { MisionDetalle } from "@/lib/types";

interface ValidarResponse {
  mision: string;
  puntosGanados: number;
  saldoActual: number;
}

export default function MisionDetallePage() {
  return (
    <RequireAuth>
      <MisionDetalleContenido />
    </RequireAuth>
  );
}

function MisionDetalleContenido() {
  const { id } = useParams<{ id: string }>();
  const [codigo, setCodigo] = useState("");
  const qc = useQueryClient();

  const { data: mision, isLoading, isError } = useQuery({
    queryKey: ["mision", id],
    queryFn: () => api<MisionDetalle>(`/api/misiones/${id}`),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (codigo: string) =>
      api<ValidarResponse>("/api/codigos/validar", {
        method: "POST",
        body: JSON.stringify({ codigo }),
      }),
    onSuccess: () => {
      setCodigo("");
      qc.invalidateQueries({ queryKey: ["saldo"] });
    },
  });

  if (isLoading) {
    return (
      <>
        <PageHeader title="Misión" />
        <p className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500 dark:text-ink-faint sm:px-8">
          Cargando misión…
        </p>
      </>
    );
  }

  if (isError || !mision) {
    return (
      <>
        <PageHeader title="Misión no encontrada" />
        <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-8">
          <p className="text-sm text-slate-500 dark:text-ink-faint">
            Esta misión no existe o ya no está disponible.
          </p>
          <Link href="/misiones" className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Volver a misiones
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title={mision.titulo} />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <Link href="/misiones" className="text-sm text-primary hover:underline">
          ← Volver a misiones
        </Link>

        <div className="mt-6 rounded-xl bg-white dark:bg-surface-800 p-8 shadow-[0_0_45px_rgba(0,0,0,0.08)] dark:shadow-[0_0_45px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold text-dark dark:text-ink">{mision.titulo}</h2>
            <span className="shrink-0 rounded-full bg-light px-4 py-1.5 text-sm font-semibold text-dark">
              +{mision.puntos} puntos
            </span>
          </div>

          {mision.descripcion && (
            <p className="mt-4 text-slate-600 dark:text-ink-muted">{mision.descripcion}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-ink-faint">
            {mision.cupoMaximo != null && (
              <span>
                <i className="fa fa-users me-1" /> Cupo máximo: {mision.cupoMaximo}
              </span>
            )}
            {mision.vigenteHasta && (
              <span>
                <i className="fa fa-calendar me-1" /> Disponible hasta{" "}
                {new Date(mision.vigenteHasta).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          <div className="mt-8 border-t border-slate-200 dark:border-forest-700 pt-6">
            <h3 className="text-lg font-semibold text-dark dark:text-ink">¿Cómo completarla?</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-ink-faint">
              Realiza la acción descrita arriba en un punto de acopio EcoPoints. Al
              hacerlo, recibirás un código de validación — ingrésalo aquí para sumar
              tus puntos.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(codigo.trim().toUpperCase());
              }}
              className="mt-4 flex flex-col gap-3 sm:flex-row"
            >
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="ECO-XXXXX-XXXXX"
                required
                className="flex-1 rounded-lg border border-slate-300 dark:border-forest-600 px-4 py-3 text-center font-mono text-sm uppercase outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:opacity-50"
              >
                {mutation.isPending ? "Validando…" : "Validar código"}
              </button>
            </form>

            {mutation.isSuccess && (
              <div className="mt-4 rounded-lg bg-light p-4 text-center">
                <p className="font-semibold text-dark dark:text-ink">
                  +{mutation.data.puntosGanados} puntos
                </p>
                <p className="mt-1 text-sm text-dark/80 dark:text-ink-muted">
                  {mutation.data.mision} · Saldo actual: {mutation.data.saldoActual}
                </p>
              </div>
            )}

            {mutation.isError && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-center text-sm text-red-700 dark:text-red-300">
                {mutation.error instanceof ApiError
                  ? mutation.error.message
                  : "No se pudo validar el código."}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
