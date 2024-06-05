import App from "./../App.jsx"
import Login from "./../Auth/Login.jsx"
import Dashboard from "../home/Dashboard.jsx";

const routes = [
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Login/>
            },
            // {
            //     path: "signup",
            //     element: <SignUp/>
            // },
            // {
            //     path: "/",
            //     element: <Home/>
            // },
            {
                path: "dashboard",
                element: <Dashboard/>
            }
        ]
    }
]



export default routes;