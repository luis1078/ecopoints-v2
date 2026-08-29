"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { RequireAdmin } from "@/components/RequireAdmin";
import { PageHeader } from "@/components/page-header";
import type { Mision } from "@/lib/types";

export default function AdminPage() {
  return (
    <RequireAdmin>
      <Admin />
    </RequireAdmin>
  );
}

function Admin() {
  return (
    <>
      <PageHeader title="Administración" />

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-8">
        <CrearMisionSeccion />
        <GenerarCodigosSeccion />
        <CrearRecompensaSeccion />
      </div>
    </>
  );
}

function Seccion({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-dark dark:text-ink">{titulo}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-ink-faint">{subtitulo}</p>
      <div className="mt-6 rounded-xl bg-white dark:bg-surface-800 p-6 shadow-[0_0_45px_rgba(0,0,0,0.08)] dark:shadow-[0_0_45px_rgba(0,0,0,0.35)]">
        {children}
      </div>
    </section>
  );
}

const campo =
  "w-full rounded-lg border border-slate-300 dark:border-forest-600 px-3 py-2 text-sm outline-none focus:border-primary";

function CrearMisionSeccion() {
  const qc = useQueryClient();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [puntos, setPuntos] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState("");
  const [vigenteHasta, setVigenteHasta] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api("/api/misiones", {
        method: "POST",
        body: JSON.stringify({
          titulo,
          descripcion: descripcion || null,
          puntos: Number(puntos),
          vigenteDesde: null,
          vigenteHasta: vigenteHasta || null,
          cupoMaximo: cupoMaximo ? Number(cupoMaximo) : null,
        }),
      }),
    onSuccess: () => {
      setTitulo("");
      setDescripcion("");
      setPuntos("");
      setCupoMaximo("");
      setVigenteHasta("");
      qc.invalidateQueries({ queryKey: ["misiones"] });
    },
  });

  return (
    <Seccion titulo="Crear misión" subtitulo="Publica una nueva misión para que los usuarios la completen.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Título</label>
          <input required value={titulo} onChange={(e) => setTitulo(e.target.value)} className={campo} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={campo}
            rows={2}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Puntos</label>
          <input
            required
            type="number"
            min={1}
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
            className={campo}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Cupo máximo (opcional)</label>
          <input
            type="number"
            min={1}
            value={cupoMaximo}
            onChange={(e) => setCupoMaximo(e.target.value)}
            className={campo}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Vigente hasta (opcional)</label>
          <input
            type="date"
            value={vigenteHasta}
            onChange={(e) => setVigenteHasta(e.target.value)}
            className={campo}
          />
        </div>

        {mutation.isError && (
          <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {mutation.error instanceof ApiError ? mutation.error.message : "No se pudo crear la misión."}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="sm:col-span-2 rounded-lg bg-light px-3 py-2 text-sm text-dark">
            Misión creada correctamente.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="sm:col-span-2 rounded-lg bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {mutation.isPending ? "Creando…" : "Crear misión"}
        </button>
      </form>
    </Seccion>
  );
}

function GenerarCodigosSeccion() {
  const { data: misiones } = useQuery({
    queryKey: ["misiones"],
    queryFn: () => api<Mision[]>("/api/misiones"),
  });

  const [misionId, setMisionId] = useState("");
  const [cantidad, setCantidad] = useState("10");
  const [expiraEn, setExpiraEn] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api<{ generados: number; codigos: string[] }>("/api/codigos/generar", {
        method: "POST",
        body: JSON.stringify({
          misionId,
          cantidad: Number(cantidad),
          expiraEn: expiraEn || null,
        }),
      }),
  });

  return (
    <Seccion
      titulo="Generar códigos de validación"
      subtitulo="Crea códigos únicos para que los usuarios canjeen puntos al completar una misión."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Misión</label>
          <select
            required
            value={misionId}
            onChange={(e) => setMisionId(e.target.value)}
            className={campo}
          >
            <option value="" disabled>
              Selecciona una misión
            </option>
            {misiones?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Cantidad</label>
          <input
            required
            type="number"
            min={1}
            max={500}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className={campo}
          />
        </div>

        <div className="sm:col-span-3">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Expira el (opcional)</label>
          <input
            type="date"
            value={expiraEn}
            onChange={(e) => setExpiraEn(e.target.value)}
            className={campo}
          />
        </div>

        {mutation.isError && (
          <p role="alert" className="sm:col-span-3 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {mutation.error instanceof ApiError ? mutation.error.message : "No se pudieron generar los códigos."}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="sm:col-span-3 rounded-lg bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {mutation.isPending ? "Generando…" : "Generar códigos"}
        </button>
      </form>

      {mutation.isSuccess && (
        <div className="mt-6">
          <p className="text-sm font-medium text-dark dark:text-ink">
            {mutation.data.generados} códigos generados:
          </p>
          <div className="mt-2 max-h-56 overflow-y-auto rounded-lg bg-light p-3">
            <ul className="grid grid-cols-2 gap-1 font-mono text-xs text-dark dark:text-ink sm:grid-cols-3">
              {mutation.data.codigos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Seccion>
  );
}

function CrearRecompensaSeccion() {
  const qc = useQueryClient();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [puntosRequeridos, setPuntosRequeridos] = useState("");
  const [stock, setStock] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api("/api/recompensas", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          descripcion: descripcion || null,
          puntosRequeridos: Number(puntosRequeridos),
          stock: Number(stock),
          imagenUrl: imagenUrl || null,
        }),
      }),
    onSuccess: () => {
      setNombre("");
      setDescripcion("");
      setPuntosRequeridos("");
      setStock("");
      setImagenUrl("");
      qc.invalidateQueries({ queryKey: ["recompensas"] });
    },
  });

  return (
    <Seccion titulo="Crear recompensa" subtitulo="Publica un nuevo artículo canjeable por puntos.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Nombre</label>
          <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className={campo}
            rows={2}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Puntos requeridos</label>
          <input
            required
            type="number"
            min={1}
            value={puntosRequeridos}
            onChange={(e) => setPuntosRequeridos(e.target.value)}
            className={campo}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">Stock</label>
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={campo}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">URL de imagen (opcional)</label>
          <input value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} className={campo} />
        </div>

        {mutation.isError && (
          <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {mutation.error instanceof ApiError ? mutation.error.message : "No se pudo crear la recompensa."}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="sm:col-span-2 rounded-lg bg-light px-3 py-2 text-sm text-dark">
            Recompensa creada correctamente.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="sm:col-span-2 rounded-lg bg-primary py-2 text-sm font-medium text-white transition-colors hover:bg-secondary disabled:opacity-50"
        >
          {mutation.isPending ? "Creando…" : "Crear recompensa"}
        </button>
      </form>
    </Seccion>
  );
}
