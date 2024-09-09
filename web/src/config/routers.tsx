import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/home.tsx";
import Test from "../pages/Test";
import App from "../App.tsx";
import Meet from "../pages/Meet/meet.tsx";

export const routers: any = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/meeting",
        element: <Meet />,
      },
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },
]);
