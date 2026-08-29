"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Nav } from "./nav";
import { Footer } from "./footer";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;
    if (!usuario) {
      router.replace("/login");
      return;
    }
    if (usuario.rol !== "admin") router.replace("/inicio");
  }, [usuario, cargando, router]);

  if (cargando || !usuario || usuario.rol !== "admin") {
    return <p className="text-muted p-8 text-sm">Cargando…</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
