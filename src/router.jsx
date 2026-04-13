// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Payments from "./pages/Payments";
import Client from "./pages/client-main";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, // shared layout
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "client-main/:id",
        element: <Client />,
      },
    ],
  },
]);