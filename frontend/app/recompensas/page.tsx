"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import type { Recompensa, SaldoResponse } from "@/lib/types";

const IMAGENES = [
  "/img/canje/cupones.webp",
  "/img/canje/doritos.webp",
  "/img/canje/tarjetas.webp",
  "/img/canje/teatro.webp",
  "/img/canje/ticket.webp",
  "/img/canje/ecocanje.jpg",
];

export default function RecompensasPage() {
  return (
    <RequireAuth>
      <Recompensas />
    </RequireAuth>
  );
}

function Recompensas() {
  const qc = useQueryClient();

  const { data: recompensas, isLoading } = useQuery({
    queryKey: ["recompensas"],
    queryFn: () => api<Recompensa[]>("/api/recompensas"),
  });

  const { data: saldoData } = useQuery({
    queryKey: ["saldo"],
    queryFn: () => api<SaldoResponse>("/api/mi/saldo"),
  });

  const saldo = saldoData?.saldo ?? 0;

  const canje = useMutation({
    mutationFn: (recompensaId: string) =>
      api("/api/canjes", {
        method: "POST",
        body: JSON.stringify({ recompensaId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saldo"] });
      qc.invalidateQueries({ queryKey: ["recompensas"] });
    },
  });

  return (
    <>
      <PageHeader title="Recompensas" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-lg font-bold text-primary">
            Consigue puntos y llévate grandes cosas
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-dark dark:text-ink">
            Tienes {saldo} puntos disponibles
          </h2>
        </div>

        {canje.isError && (
          <p role="alert" className="mx-auto mt-6 max-w-lg rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-center text-sm text-red-700 dark:text-red-300">
            {canje.error instanceof ApiError ? canje.error.message : "No se pudo canjear."}
          </p>
        )}

        {canje.isSuccess && (
          <p className="mx-auto mt-6 max-w-lg rounded-lg bg-light px-3 py-2 text-center text-sm text-dark">
            Canje registrado. Puedes recogerlo en el punto de entrega.{" "}
            <Link href="/mis-canjes" className="font-medium underline">
              Ver mis canjes
            </Link>
          </p>
        )}

        {isLoading && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">Cargando catálogo…</p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recompensas?.map((r, i) => {
            const agotada = r.stock === 0;
            const alcanza = saldo >= r.puntosRequeridos;
            const faltan = r.puntosRequeridos - saldo;

            return (
              <div key={r.id} className="portfolio-inner rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.imagenUrl || IMAGENES[i % IMAGENES.length]}
                  alt={r.nombre}
                  className="rounded"
                />
                <div className="portfolio-text rounded">
                  <h4 className="text-lg font-semibold text-white">{r.nombre}</h4>
                  {r.descripcion && (
                    <p className="text-sm text-light">{r.descripcion}</p>
                  )}
                  <h4 className="font-semibold text-white">{r.puntosRequeridos} puntos</h4>
                  <p className="text-xs text-light">
                    {agotada ? "Sin stock" : `${r.stock} disponibles`}
                  </p>
                  <button
                    onClick={() => canje.mutate(r.id)}
                    disabled={agotada || !alcanza || canje.isPending}
                    className="mt-2 rounded bg-white px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-surface-800 dark:disabled:bg-surface-600 dark:disabled:text-ink-faint"
                  >
                    {agotada
                      ? "Agotada"
                      : !alcanza
                      ? `Te faltan ${faltan} pts`
                      : canje.isPending
                      ? "Canjeando…"
                      : "Canjear"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {recompensas?.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">
            Aún no hay recompensas disponibles.
          </p>
        )}
      </div>
    </>
  );
}
