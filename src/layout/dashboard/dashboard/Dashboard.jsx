import React from "react";
import { Outlet } from "react-router-dom";
import Sidenav from "../Sidenav/Sidenav";
import Topbar from "../Topbar/Topbar";
import "./dashboard.scss";

const dashboard = () => {
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
