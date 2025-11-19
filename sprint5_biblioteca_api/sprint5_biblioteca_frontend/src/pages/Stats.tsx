import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface PopularBook {
  id: number;
  titulo: string;
  autor: string;
  prestamos_count: number;
}

export default function Stats() {
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularBooks();
  }, []);

const fetchPopularBooks = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/api/books/stats/popular", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    });
    const result = await response.json();
    
    // La API ya devuelve { data: [...] } según tu documentación
    setPopularBooks(result.data || []);
    setLoading(false);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    setPopularBooks([]);
    setLoading(false);
  }
};

  const maxPrestamos = popularBooks.length > 0 
    ? Math.max(...popularBooks.map(b => b.prestamos_count))
    : 0;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
          <p className="text-gray-600 mt-1">Visualiza los datos más relevantes de la biblioteca.</p>
        </div>
      </div>

      {/* Card de libros populares */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Libros más populares</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ranking de libros con mayor cantidad de préstamos
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Cargando estadísticas...</div>
        ) : popularBooks.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No hay datos disponibles</div>
        ) : (
          <div className="space-y-4">
            {/* Gráfico de barras */}
            <div className="space-y-3 mb-8">
              {popularBooks.map((book, index) => {
                const percentage = (book.prestamos_count / maxPrestamos) * 100;
                return (
                  <div key={book.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{book.titulo}</span>
                      <span className="text-gray-500">{book.prestamos_count}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="h-full bg-black transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top 5 Libros */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs">📊</span>
                Top 5 Libros
              </h3>
              <div className="space-y-3">
                {popularBooks.slice(0, 5).map((book, index) => (
                  <div key={book.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{book.titulo}</p>
                      <p className="text-xs text-gray-500">{book.autor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-purple-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600"
                          style={{ width: `${(book.prestamos_count / maxPrestamos) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                        {book.prestamos_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
