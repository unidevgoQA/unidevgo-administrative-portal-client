import * as React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import * as ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./app/store";
import "./index.scss";
import Dashboard from "./layout/dashboard/dashboard/dashboard";
import AddNewEvent from "./pages/admin-dashboard/add-new-event/AddNewEvent";
import AllEmployee from "./pages/admin-dashboard/all-employee/AllEmployee";
import AttendenceReport from "./pages/admin-dashboard/attendence-report/AttendenceReport";
import EmployeeDetails from "./pages/admin-dashboard/employee-details/EmployeeDetails";
import EmployeeWorkStatus from "./pages/admin-dashboard/employee-work-status/EmployeeWorkStatus";
import LeaveManagement from "./pages/admin-dashboard/leave-management/LeaveManagement";
import Projects from "./pages/admin-dashboard/projects/Projects";
import SendEmail from "./pages/admin-dashboard/send-email/SendEmail";
import SupportTIcketManagement from "./pages/admin-dashboard/support-ticket-management/SupportTIcketManagement";
import AddWorkStatus from "./pages/employee-dashboard/add-work-status/AddWorkStatus";
import Attendence from "./pages/employee-dashboard/attendence/Attendence";
import CreateTicket from "./pages/employee-dashboard/create-ticket/CreateTicket";
import LeaveApply from "./pages/employee-dashboard/leave-apply/LeaveApply";
import LeaveStatus from "./pages/employee-dashboard/leave-status/LeaveStatus";

import Profile from "./pages/employee-dashboard/profile/Profile";
import SupportTickets from "./pages/employee-dashboard/support-tickets/SupportTickets";
import UpdateProfile from "./pages/employee-dashboard/update-profile/UpdateProfile";
import WorkStatus from "./pages/employee-dashboard/work-status/WorkStatus";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Calender from "./pages/shared-dashboard/Calender";
import SupportTicketDetails from "./pages/shared-dashboard/SupportTicketDetails";
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
        path: "employee-work-status/:id",
        element: <EmployeeWorkStatus />,
      },
      {
        path: "employee-details/:id",
        element: <EmployeeDetails />,
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
        path: "work-status",
        element: <WorkStatus />,
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
      {
        path: "calender",
        element: <Calender />,
      },
      {
        path: "add-new-event",
        element: <AddNewEvent />,
      },
      {
        path: "attendence",
        element: <Attendence />,
      },
      {
        path: "attendence-report/:id",
        element: <AttendenceReport />,
      },
      {
        path: "support-tickets/:id",
        element: <SupportTicketDetails />,
      },
      {
        path: "send-email",
        element: <SendEmail />,
      },

      {
        path: "create-ticket",
        element: <CreateTicket />,
      },

      {
        path: "support-tickets",
        element: <SupportTickets />,
      },
      {
        path: "support-tickets-management",
        element: <SupportTIcketManagement />,
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
