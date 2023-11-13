import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./app/store";
import "./index.scss";
import Dashboard from "./layout/dashboard/dashboard/dashboard";
import AllEmployee from "./pages/admin-dashboard/all-employee/AllEmployee";
import LeaveManagement from "./pages/admin-dashboard/leave-management/LeaveManagement";
import Projects from "./pages/admin-dashboard/projects/Projects";
import WorkStatus from "./pages/admin-dashboard/work-status/WorkStatus";
import AddWorkStatus from "./pages/employee-dashboard/add-work-status/AddWorkStatus";
import LeaveApply from "./pages/employee-dashboard/leave-apply/LeaveApply";
import LeaveStatus from "./pages/employee-dashboard/leave-status/LeaveStatus";
import Profile from "./pages/employee-dashboard/profile/Profile";
import UpdateProfile from "./pages/employee-dashboard/update-profile/UpdateProfile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AuthProviders from "./providers/AuthProviders";
import PrivateRoute from "./routes/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Profile />,
      },
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
      {
        path: "add-work-status",
        element: <AddWorkStatus />,
      },
      {
        path: "leave-apply",
        element: <LeaveApply />,
      },
      {
        path: "leave-status",
        element: <LeaveStatus />,
      },
      {
        path: "update-profile/:id",
        element: <UpdateProfile />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProviders>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </AuthProviders>
    </Provider>
  </React.StrictMode>
);
