import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProviders";
import Sidenav from "../Sidenav/Sidenav";
import Topbar from "../Topbar/Topbar";
import "./dashboard.scss";

const dashboard = () => {
  const { isOpen, setIsOpen } = useContext(AuthContext);
  return (
    <div className="dashboard overflow-x-hidden">
      <div className="with-sidenav">
        <Sidenav />
      </div>
      <div className="with-topbar">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

export default dashboard;
