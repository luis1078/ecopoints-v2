"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";

interface ValidarResponse {
  mision: string;
  puntosGanados: number;
  saldoActual: number;
}

export default function ValidarPage() {
  return (
    <RequireAuth>
      <Validar />
    </RequireAuth>
  );
}

function Validar() {
  const [codigo, setCodigo] = useState("");
  const qc = useQueryClient();

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

  return (
    <>
      <PageHeader title="Validar código" />

      <div className="mx-auto max-w-lg px-4 py-16 sm:px-8">
        <div className="rounded-xl bg-white dark:bg-surface-800 p-8 shadow-[0_0_45px_rgba(0,0,0,0.08)] dark:shadow-[0_0_45px_rgba(0,0,0,0.35)]">
          <h2 className="text-center text-2xl font-semibold text-dark dark:text-ink">
            Ingresa tu código de validación
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-ink-faint">
            Lo recibiste al completar una misión.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate(codigo.trim().toUpperCase());
            }}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
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
              {mutation.isPending ? "Validando…" : "Validar"}
            </button>
          </form>

          {mutation.isSuccess && (
            <div className="mt-6 rounded-lg bg-light p-4 text-center">
              <p className="text-lg font-semibold text-dark dark:text-ink">
                +{mutation.data.puntosGanados} puntos
              </p>
              <p className="mt-1 text-sm text-dark/80 dark:text-ink-muted">
                {mutation.data.mision} · Saldo actual: {mutation.data.saldoActual}
              </p>
            </div>
          )}

          {mutation.isError && (
            <p role="alert" className="mt-6 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-center text-sm text-red-700 dark:text-red-300">
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : "No se pudo validar el código."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
