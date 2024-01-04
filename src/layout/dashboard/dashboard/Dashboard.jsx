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
      {/* <div className="row g-0">
        <div
          className={
            isOpen === true
              ? "col-lg-2 col-md-2 col-sm-0"
              : "col-lg-1 col-md-2 col-sm-0"
          }
        >
          <Sidebar />
        </div>
        <div
          className={
            isOpen === true
              ? "dash-content col-lg-10 col-md-10 col-sm-12"
              : "col-lg-11 col-md-10 col-sm-11"
          }
        >
          <Topbar />
          <Outlet />
        </div>
      </div> */}
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
