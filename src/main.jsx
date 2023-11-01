import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.scss";
import Dashboard from "./layout/dashboard/dashboard/dashboard";
import AllEmployee from "./pages/admin-dashboard/all-employee/AllEmployee";
import LeaveManagement from "./pages/admin-dashboard/leave-management/LeaveManagement";
import Projects from "./pages/admin-dashboard/projects/Projects";
import WorkStatus from "./pages/admin-dashboard/work-status/WorkStatus";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
 



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    children: [
      {
        path: "all-employee",
        element: <AllEmployee />,
      },
      {
        path: "leave-management",
        element: <LeaveManagement />,
      },
      {
        path: "work-status",
        element: <WorkStatus />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);