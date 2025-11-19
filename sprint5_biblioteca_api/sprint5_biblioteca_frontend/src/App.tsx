import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Páginas
import Books from "./pages/Books";
import Categories from "./pages/Categories";
import Loans from "./pages/Loans";
import Stats from "./pages/Stats";
import Login from "./pages/login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        {/* Rutas privadas dentro del Dashboard */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Books />
            </DashboardLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <DashboardLayout>
              <Categories />
            </DashboardLayout>
          }
        />
        <Route
          path="/loans"
          element={
            <DashboardLayout>
              <Loans />
            </DashboardLayout>
          }
        />
        <Route
          path="/stats"
          element={
            <DashboardLayout>
              <Stats />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
