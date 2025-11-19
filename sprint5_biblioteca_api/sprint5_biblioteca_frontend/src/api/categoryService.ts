import { api } from "./client";

export async function listCategories() {
  const { data } = await api.get("/categories");
  return data as any[];
}

export async function createCategory(payload: { nombre: string; descripcion: string }) {
  const { data } = await api.post("/categories", payload);
  return data;
}

export async function deleteCategory(id: number) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}
