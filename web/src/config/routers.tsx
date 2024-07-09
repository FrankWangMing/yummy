import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home/home.tsx";

export const  routers = createBrowserRouter([
    {
        path: "/",
        element: (<App/>),
        children:[{
            path:"/home",
            element:<Home/>
        }]
    }
]);
