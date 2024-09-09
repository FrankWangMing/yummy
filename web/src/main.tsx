import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routers } from "./config/routers";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={routers}></RouterProvider>,
);
