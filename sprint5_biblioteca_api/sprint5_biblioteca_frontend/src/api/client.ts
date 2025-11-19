import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Interceptor para adjuntar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Aseguramos que headers existe y es del tipo correcto
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Normaliza errores y evita "formato inesperado"
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Error de red o respuesta no válida";

    // Si quieres, aquí puedes redirigir al login en 401:
    // if (status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/login";
    // }

    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);
