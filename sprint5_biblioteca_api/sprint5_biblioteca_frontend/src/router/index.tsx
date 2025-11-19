import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import { DashboardLayout } from "../components/layout/DashboardLayout";

// Páginas
import Login from "../pages/login";
import Register from "../pages/Register";
import Books from "../pages/Books";
import Categories from "../pages/Categories";
import Loans from "../pages/Loans";
import Stats from "../pages/Stats";

function DashboardShell() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas dentro del layout */}
      <Route element={<DashboardShell />}>
        <Route path="/" element={<Books />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </>
  )
);