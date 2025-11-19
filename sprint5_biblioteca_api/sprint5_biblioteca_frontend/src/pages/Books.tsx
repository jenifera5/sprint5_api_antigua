import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, BookOpen, Search, X, Tag } from "lucide-react";

interface Categoria {
  id: number;
  nombre: string;
}

interface Book {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  disponibles: number;
  categorias?: Categoria[];
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    anio: new Date().getFullYear(),
    disponibles: 1,
    categorias: [] as number[],
  });

  useEffect(() => {
    fetchBooks();
    fetchCategorias();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();
      setBooks(Array.isArray(result.data) ? result.data : result);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener libros:", error);
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();
      setCategorias(Array.isArray(result.data) ? result.data : result);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // 🔍 BUSCADOR FUNCIONAL CON CATEGORÍAS Y DOBLE RUTA
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }

    setSearching(true);

    try {
      const token = localStorage.getItem("token");

      const urls = [
        `http://127.0.0.1:8000/api/books/search?query=${encodeURIComponent(searchQuery)}`,
        `http://127.0.0.1:8000/books/search?query=${encodeURIComponent(searchQuery)}`
      ];

      let result = null;

      for (const url of urls) {
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            result = data;
            break;
          }
        } catch (err) {
          console.warn(`Ruta no encontrada: ${url}`);
        }
      }

      if (!result) {
        console.error("Ninguna ruta de búsqueda respondió correctamente.");
        setBooks([]);
      } else {
        const data = Array.isArray(result.data) ? result.data : result;
        setBooks(data || []);
      }
    } catch (error) {
      console.error("Error al buscar libros:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchBooks();
  };

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        titulo: book.titulo,
        autor: book.autor,
        anio: book.anio,
        disponibles: book.disponibles,
        categorias: book.categorias?.map((c) => c.id) || [],
      });
    } else {
      setEditingBook(null);
      setFormData({
        titulo: "",
        autor: "",
        anio: new Date().getFullYear(),
        disponibles: 1,
        categorias: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const url = editingBook
      ? `http://127.0.0.1:8000/api/books/${editingBook.id}`
      : "http://127.0.0.1:8000/api/books";

    const method = editingBook ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseModal();
        fetchBooks();
      } else {
        const errorData = await response.json();
        console.error("Error al guardar libro:", errorData);
        alert("Error al guardar el libro. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el libro");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchBooks();
      } else {
        alert("Error al eliminar el libro");
      }
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      alert("Error al eliminar el libro");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-gray-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Libros</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de libros y sus categorías.
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Catálogo de Libros</h2>

          {/* 🔍 Barra de búsqueda */}
          <form onSubmit={handleSearch} className="w-full max-w-sm lg:ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
                >
                  {searching ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>
          </form>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Libro
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Cargando libros...</div>
          ) : books.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No se encontraron resultados para tu búsqueda"
                  : "No hay libros registrados"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Autor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Año</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Disponibles</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Categorías</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
               {Array.isArray(books) && books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{book.titulo}</td>
                    <td className="px-6 py-4">{book.autor}</td>
                    <td className="px-6 py-4">{book.anio}</td>
                    <td className="px-6 py-4">{book.disponibles}</td>
                    <td className="px-6 py-4">
                      {book.categorias?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {book.categorias.map((cat) => (
                            <span
                              key={cat.id}
                              className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded-full"
                            >
                              <Tag className="w-3 h-3" />
                              {cat.nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sin categorías</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(book)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingBook ? "Editar Libro" : "Nuevo Libro"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Autor"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Año"
                value={formData.anio}
                onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Disponibles"
                value={formData.disponibles}
                onChange={(e) => setFormData({ ...formData, disponibles: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              {/* Selector de categorías */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorías
                </label>
                <select
                  multiple
                  value={formData.categorias.map(String)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categorias: Array.from(e.target.selectedOptions, (opt) =>
                        parseInt(opt.value)
                      ),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Usa Ctrl (o Cmd en Mac) para seleccionar varias categorías.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700"
                >
                  {editingBook ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}