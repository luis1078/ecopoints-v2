"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Footer } from "@/components/footer";
import { PublicNav } from "@/components/public-nav";

const PASOS = [
  {
    icono: "/img/icon/icon-1.png",
    titulo: "Recicla",
    texto: "Lleva tus residuos reciclables a un punto de acopio EcoPoints.",
  },
  {
    icono: "/img/icon/icon-3.png",
    titulo: "Valida tu código",
    texto: "Recibe un código único y canjéalo en la misión correspondiente.",
  },
  {
    icono: "/img/icon/icon-5.png",
    titulo: "Canjea tu recompensa",
    texto: "Usa tus puntos acumulados para llevarte premios reales.",
  },
];

export default function Home() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (usuario) router.replace("/inicio");
  }, [usuario, cargando, router]);

  // No bloqueamos el render en `cargando`: la landing debe verse de inmediato
  // para visitantes anónimos. Si hay sesión, el efecto de arriba redirige.
  if (usuario) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNav />

      <main className="flex-1">
        <div className="page-header px-4 py-24 text-center sm:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-6xl">EcoPoints</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-light">
            Convierte tus hábitos de reciclaje en puntos y canjéalos por recompensas
            reales.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/registro"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
            >
              Crear cuenta gratis
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-lg font-bold text-primary">¿Cómo funciona?</p>
            <h2 className="mt-2 text-3xl font-semibold text-dark dark:text-ink">
              Tres pasos para empezar a ganar puntos
            </h2>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PASOS.map((p) => (
              <div key={p.titulo} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-light dark:bg-surface-800">
                  <Image src={p.icono} alt="" width={48} height={48} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-dark dark:text-ink">
                  {p.titulo}
                </h3>
                <p className="text-subtle mt-2 text-sm">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
