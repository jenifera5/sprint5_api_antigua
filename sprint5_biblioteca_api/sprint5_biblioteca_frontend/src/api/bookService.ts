import { api } from "./client";

export type BookPayload = {
  titulo: string;
  autor: string;
  anio: number;
  disponibles: number;
};

// GET lista (Swagger dice /api/books)
export async function listBooks() {
  const { data } = await api.get("/api/books");
  return data as any[];
}

// POST crear (Swagger dice /books)
export async function createBook(payload: BookPayload) {
  const { data } = await api.post("/books", payload);
  return data;
}

export async function updateBook(id: number, payload: BookPayload) {
  const { data } = await api.put(`/books/${id}`, payload);
  return data;
}

export async function deleteBook(id: number) {
  const { data } = await api.delete(`/books/${id}`);
  return data;
}

export async function searchBooks(query: string) {
  const { data } = await api.get("/books/search", { params: { query } });
  // devuelve { message, data: [...] }
  return data;
}

export async function popularBooks() {
  const { data } = await api.get("/books/stats/popular");
  // { message, data: [ { ..., prestamos_count } ] }
  return data;
}



