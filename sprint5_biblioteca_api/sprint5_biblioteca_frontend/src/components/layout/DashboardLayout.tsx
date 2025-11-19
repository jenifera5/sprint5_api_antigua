import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, FolderOpen, FileText, BarChart3, Menu, X, ChevronDown } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: "Libros", icon: BookOpen, path: "/" },
    { title: "Categorías", icon: FolderOpen, path: "/categories" },
    { title: "Préstamos", icon: FileText, path: "/loans" },
    { title: "Estadísticas", icon: BarChart3, path: "/stats" },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    
    try {
      await fetch("http://127.0.0.1:8000/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo del sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Biblioteca</h2>
              <p className="text-sm text-gray-500">Sistema de gestión</p>
            </div>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1 p-4 mt-2">
          <div className="space-y-1">
            {menuItems.map(({ title, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={title}
                  onClick={() => {
                    navigate(path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {title}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      )}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Biblioteca Universo de Libros
                </h1>
              </div>
            </div>

            {/* Avatar con dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">U</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Perfil
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      Configuración
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Contenido con scroll */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}