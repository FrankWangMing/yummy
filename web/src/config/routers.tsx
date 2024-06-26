import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/home.tsx";

export const  routers:any = createBrowserRouter([
    {
        path: "/",
        element: (<App/>),
        children:[{
            path:"/home",
            element:<Home/>
        }]
    }
]);
