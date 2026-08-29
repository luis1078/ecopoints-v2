"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function RegistroPage() {
  const { registrar } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const passwordCorta = password.length > 0 && password.length < 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await registrar(email, password, nombre);
      router.push("/inicio");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "Ese correo ya está registrado."
          : "No se pudo completar el registro."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-register-page flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="login-register-form">
          <Link href="/" className="mx-auto block w-fit py-3">
            <Image src="/img/logo.png" alt="EcoPoints" width={150} height={60} />
          </Link>

          <h2 className="mb-4 text-center text-2xl font-semibold text-white">Registrar</h2>

          <div className="mb-3">
            <label htmlFor="nombre" className="mb-1 block text-sm text-white/90">
              Nombres
            </label>
            <input
              id="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded border border-transparent bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="mb-1 block text-sm text-white/90">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-transparent bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block text-sm text-white/90">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="password-ayuda"
              className="w-full rounded border border-transparent bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary"
            />
            <p
              id="password-ayuda"
              className={`mt-1 text-xs ${passwordCorta ? "text-red-200" : "text-white/70"}`}
            >
              Mínimo 8 caracteres
            </p>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || password.length < 8}
            className="mb-3 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {enviando ? "Creando cuenta…" : "Guardar"}
          </button>

          <Link
            href="/login"
            className="block w-full rounded-lg border border-white py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
          >
            Regresar
          </Link>
        </form>
      </div>
    </main>
  );
}
