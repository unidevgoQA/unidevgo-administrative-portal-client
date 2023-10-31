import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/main/Main";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";



  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
       
      ],
    },
   
  ]);
  
  export default routes;