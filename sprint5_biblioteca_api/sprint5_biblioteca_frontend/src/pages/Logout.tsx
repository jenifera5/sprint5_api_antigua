import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Elimina datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirige al login
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // No renderiza nada visible
}
