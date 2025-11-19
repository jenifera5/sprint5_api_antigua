import { Navigate } from "react-router-dom";
import type { ReactNode } from "react"; // 👈 fijate en el "type" aquí

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
