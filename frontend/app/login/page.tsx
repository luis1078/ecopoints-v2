"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await login(email, password);
      router.push("/inicio");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Correo o contraseña incorrectos."
          : "No se pudo iniciar sesión. Intenta de nuevo."
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

          <h2 className="mb-4 text-center text-2xl font-semibold text-white">Login</h2>

          <div className="mb-3">
            <label htmlFor="email" className="mb-1 block text-sm text-white/90">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-transparent bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              autoComplete="off"
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
              className="w-full rounded border border-transparent bg-white px-3 py-2 text-sm text-dark outline-none focus:border-primary"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mb-3 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-50"
          >
            {enviando ? "Ingresando…" : "Iniciar sesión"}
          </button>

          <Link
            href="/registro"
            className="block w-full rounded-lg border border-white py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
          >
            Registrar
          </Link>
        </form>
      </div>
    </main>
  );
}
