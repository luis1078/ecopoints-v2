"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/page-header";
import type { Mision } from "@/lib/types";

const IMAGENES = [
  "/img/service-1.jpg",
  "/img/service-2.jpg",
  "/img/service-3.jpg",
  "/img/service-4.jpg",
  "/img/service-5.jpg",
  "/img/service-6.jpg",
];

export default function MisionesPage() {
  return (
    <RequireAuth>
      <Misiones />
    </RequireAuth>
  );
}

function Misiones() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["misiones"],
    queryFn: () => api<Mision[]>("/api/misiones"),
  });

  return (
    <>
      <PageHeader title="Misiones" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-lg font-bold text-primary">Nuestras misiones</p>
          <h2 className="mt-2 text-3xl font-semibold text-dark dark:text-ink">
            Completa las siguientes misiones
          </h2>
        </div>

        {isLoading && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">Cargando misiones…</p>
        )}
        {isError && (
          <p className="mt-10 text-center text-sm text-red-700">
            No se pudieron cargar las misiones.
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((m, i) => (
            <Link
              key={m.id}
              href={`/misiones/${m.id}`}
              className="service-item flex h-full flex-col rounded"
            >
              <div className="service-img relative h-48 rounded">
                <Image
                  src={IMAGENES[i % IMAGENES.length]}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div className="service-text relative mt-40 flex flex-1 flex-col rounded p-8">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-surface-800">
                  <Image src="/img/icon/icon-3.png" alt="" width={40} height={40} />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-dark dark:text-ink">{m.titulo}</h4>
                {m.descripcion && (
                  <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-ink-muted">{m.descripcion}</p>
                )}
                <h6 className="mt-2 font-semibold text-primary">Puntos: {m.puntos}</h6>
              </div>
            </Link>
          ))}
        </div>

        {data?.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500 dark:text-ink-faint">
            No hay misiones disponibles por ahora.
          </p>
        )}
      </div>
    </>
  );
}
