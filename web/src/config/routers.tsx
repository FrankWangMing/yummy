import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home/home.tsx";
import Test from "../pages/Test";
import App from "../App.tsx";
import Meet from "../pages/Meet/meet.tsx";

export const routers = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/home" />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/meeting",
      element: <Meet />,
    },
    {
      path: "*",
      element: <Navigate to="/home" />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
    },
  },
);
