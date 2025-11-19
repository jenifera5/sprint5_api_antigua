import { api } from "./client";

export async function listLoans() {
  const { data } = await api.get("/loans");
  return data as any[];
}

export async function createLoan(payload: {
  id_usuario: number;
  id_libro: number;
  fecha_prestamo: string;      // YYYY-MM-DD
  fecha_devolucion?: string;   // YYYY-MM-DD
  estado: string;
}) {
  const { data } = await api.post("/loans", payload);
  return data;
}

export async function deleteLoan(id: number) {
  const { data } = await api.delete(`/loans/${id}`);
  return data;
}

