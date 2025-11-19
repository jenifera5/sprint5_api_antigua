// src/api/bookService.ts
import { api } from "./client";

export type BookPayload = {
  titulo: string;
  autor: string;
  anio: number;
  disponibles: number;
};

// helper para devolver siempre el array/obj correcto
function unwrap<T = any>(payload: any): T {
  return (payload && payload.data !== undefined ? payload.data : payload) as T;
}

// GET lista
export async function listBooks() {
  const { data } = await api.get("/books");
  return unwrap<any[]>(data);
}

// POST crear
export async function createBook(payload: BookPayload) {
  const { data } = await api.post("/books", payload);
  return unwrap(data);
}

// PUT actualizar
export async function updateBook(id: number, payload: BookPayload) {
  const { data } = await api.put(`/books/${id}`, payload);
  return unwrap(data);
}

// DELETE eliminar
export async function deleteBook(id: number) {
  const { data } = await api.delete(`/books/${id}`);
  return unwrap(data);
}

// GET búsqueda
export async function searchBooks(query: string) {
  const { data } = await api.get("/books/search", { params: { query } });
  return unwrap<any[]>(data);
}

// GET populares / stats
export async function popularBooks() {
  const { data } = await api.get("/books/stats/popular");
  return unwrap<any[]>(data); // espera array con { ..., prestamos_count }
}
