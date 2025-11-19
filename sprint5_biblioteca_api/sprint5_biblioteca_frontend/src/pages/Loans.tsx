import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FileText, X } from "lucide-react";

interface Loan {
  id: number;
  id_usuario: number;
  id_libro: number;
  fecha_prestamo: string;
  fecha_devolucion: string;
  estado: string;
  usuario?: { nombre: string };
  libro?: { titulo: string };
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const [formData, setFormData] = useState({
    id_usuario: 1,
    id_libro: 1,
    fecha_prestamo: new Date().toISOString().split('T')[0],
    fecha_devolucion: "",
    estado: "pendiente",
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (Array.isArray(result)) {
        setLoans(result);
      } else if (result.data && Array.isArray(result.data)) {
        setLoans(result.data);
      } else {
        setLoans([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener préstamos:", error);
      setLoans([]);
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "activo":
      case "pendiente":
        return "bg-blue-500 text-white";
      case "vencido":
        return "bg-red-500 text-white";
      case "devuelto":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleOpenModal = (loan?: Loan) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({
        id_usuario: loan.id_usuario,
        id_libro: loan.id_libro,
        fecha_prestamo: loan.fecha_prestamo,
        fecha_devolucion: loan.fecha_devolucion,
        estado: loan.estado,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      setEditingLoan(null);
      setFormData({
        id_usuario: 1,
        id_libro: 1,
        fecha_prestamo: today,
        fecha_devolucion: nextWeek,
        estado: "pendiente",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLoan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const url = editingLoan
      ? `http://127.0.0.1:8000/api/loans/${editingLoan.id}`
      : "http://127.0.0.1:8000/api/loans";

    const method = editingLoan ? "PUT" : "POST";

    try {
     
       const response = await fetch(url, {
    method,  // ✅ Sin el segundo "method"
        
        headers: {
       
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseModal();
        fetchLoans();
      } else {
        const errorData = await response.json();
        console.log("Error del servidor:", errorData);
        alert("Error al guardar el préstamo. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al guardar préstamo:", error);
      alert("Error al guardar el préstamo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este préstamo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/loans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchLoans();
      } else {
        alert("Error al eliminar el préstamo");
      }
    } catch (error) {
      console.error("Error al eliminar préstamo:", error);
      alert("Error al eliminar el préstamo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Préstamos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los préstamos activos y su estado.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Control de Préstamos
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Visualiza y administra todos los préstamos de la biblioteca
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo préstamo
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Cargando préstamos...
            </div>
          ) : loans.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay préstamos registrados</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Libro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha préstamo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha devolución</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {loan.usuario?.nombre || `Usuario #${loan.id_usuario}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {loan.libro?.titulo || `Libro #${loan.id_libro}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.fecha_prestamo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.fecha_devolucion}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.estado)}`}>
                        {loan.estado.charAt(0).toUpperCase() + loan.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(loan)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(loan.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingLoan ? "Editar Préstamo" : "Nuevo Préstamo"}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Usuario</label>
                <input
                  type="number"
                  value={formData.id_usuario}
                  onChange={(e) => setFormData({ ...formData, id_usuario: parseInt(e.target.value) || 1 })}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Libro</label>
                <input
                  type="number"
                  value={formData.id_libro}
                  onChange={(e) => setFormData({ ...formData, id_libro: parseInt(e.target.value) || 1 })}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Préstamo</label>
                <input
                  type="date"
                  value={formData.fecha_prestamo}
                  onChange={(e) => setFormData({ ...formData, fecha_prestamo: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Devolución</label>
                <input
                  type="date"
                  value={formData.fecha_devolucion}
                  onChange={(e) => setFormData({ ...formData, fecha_devolucion: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="activo">Activo</option>
                  <option value="devuelto">Devuelto</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {editingLoan ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}