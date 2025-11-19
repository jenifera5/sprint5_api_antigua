import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rol, setRol] = useState("usuario")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        nombre,
        email,
        password,
        rol,
      })

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        setSuccess("Usuario registrado correctamente.")
        setTimeout(() => navigate("/"), 1000)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al registrar el usuario. Revisa los campos."
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-purple-200">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-2">
          Crear cuenta nueva
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Regístrate para acceder a la biblioteca
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="tuemail@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {error && (
            <p className="text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="text-center text-green-600 font-medium text-sm">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
