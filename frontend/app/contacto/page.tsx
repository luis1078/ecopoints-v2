"use client";

import { useState } from "react";
import { Footer } from "@/components/footer";
import { PublicNav } from "@/components/public-nav";
import { PageHeader } from "@/components/page-header";

const CORREO_CONTACTO = "ecopoints@gmail.com";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cuerpo = `${mensaje}\n\n— ${nombre} (${email})`;
    const mailto = `mailto:${CORREO_CONTACTO}?subject=${encodeURIComponent(
      asunto || "Consulta desde EcoPoints"
    )}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = mailto;
    setEnviado(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />

      <main className="flex-1">
        <PageHeader title="Contáctanos" />

        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-8">
          <p className="text-lg font-bold text-primary">Contáctanos</p>
          <h2 className="mt-2 text-3xl font-semibold text-dark dark:text-ink">
            Si tienes alguna consulta, escríbenos
          </h2>
          <p className="text-subtle mt-3 text-sm">
            Al enviar el formulario se abrirá tu cliente de correo con el mensaje
            listo para {CORREO_CONTACTO}.
          </p>

          <form onSubmit={handleSubmit} className="surface-card mt-8 grid gap-4 rounded-xl p-8 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">
                Tu nombre
              </label>
              <input
                id="nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:border-forest-600 dark:bg-surface-900 dark:text-ink"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">
                Tu email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:border-forest-600 dark:bg-surface-900 dark:text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="asunto" className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">
                Asunto
              </label>
              <input
                id="asunto"
                required
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:border-forest-600 dark:bg-surface-900 dark:text-ink"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mensaje" className="mb-1 block text-sm text-slate-700 dark:text-ink-muted">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                required
                rows={5}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:border-forest-600 dark:bg-surface-900 dark:text-ink"
              />
            </div>

            {enviado && (
              <p className="sm:col-span-2 rounded-lg bg-light px-3 py-2 text-sm text-dark">
                Se abrió tu cliente de correo con el mensaje listo para enviar.
              </p>
            )}

            <button
              type="submit"
              className="sm:col-span-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
