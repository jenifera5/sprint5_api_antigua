"use client"

import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react" // 👈 Importa ReactNode como tipo

// Tipo del contexto
interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

// Creamos el contexto con tipo seguro
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto (AuthProvider)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))

  // Guardar token al iniciar sesión
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  // Eliminar token al cerrar sesión
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
