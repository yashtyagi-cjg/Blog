import App from "./../App.jsx"
import Login from "./../Auth/Login.jsx"
import Dashboard from "../Home/Dashboard.jsx";
import SpecificPost from "../Posts/SpecificPost.jsx";

const routes = [
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "login",
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
                element: <Dashboard/>,
            },
            {
                path: "posts/:postId",
                element: <SpecificPost/>
            }
        ]
    }
]



export default routes;