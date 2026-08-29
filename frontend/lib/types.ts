export type Rol = "usuario" | "admin";

export interface AuthResponse {
  token: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Mision {
  id: string;
  titulo: string;
  descripcion: string | null;
  puntos: number;
}

export interface MisionDetalle extends Mision {
  vigenteDesde: string | null;
  vigenteHasta: string | null;
  cupoMaximo: number | null;
}

export interface Canje {
  id: string;
  recompensa: string;
  puntosGastados: number;
  estado: string;
  creadoEn: string;
}

export interface Recompensa {
  id: string;
  nombre: string;
  descripcion: string | null;
  puntosRequeridos: number;
  stock: number;
  imagenUrl: string | null;
}

export interface Movimiento {
  tipo: "ganancia" | "canje" | "ajuste";
  puntos: number;
  descripcion: string | null;
  fecha: string;
}

export interface SaldoResponse {
  saldo: number;
  movimientos: Movimiento[];
}