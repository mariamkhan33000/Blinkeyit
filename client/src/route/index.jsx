import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import SearchPage from "../components/SearchPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";


const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path: "",
                element : <Home/>
            },
            {
                path : "/search",
                element : <SearchPage/>
            },
            {
                path : "/login",
                element : <Login/>
            },
            {
                path : "/register",
                element : <Register/>
            }
        ]
    }
])

export default router;