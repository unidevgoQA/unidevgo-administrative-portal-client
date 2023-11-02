import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((current) => !current);
  };
  return (
    <div className={isOpen === true ? "sidebar" : "sidebar-collapse"}>
      <div className="heading-wrapper">
        <h3>Dashboard</h3>

        <button onClick={() => toggleSidebar()}>
          {isOpen === true ? (
            <i class="fa-solid fa-chevron-left"></i>
          ) : (
            <i class="fa-solid fa-chevron-right"></i>
          )}
        </button>
      </div>
      <hr />
      <div className="side-links">
        <ul>
          <li>
            <i class="fa-solid fa-list-check"></i>
            <Link to={"leave-management"}>Leave Management</Link>
          </li>
          <li>
            <i class="fa-solid fa-people-group"></i>
            <Link to={"all-employee"}>All Employee</Link>
          </li>
          <li>
            <i class="fa-solid fa-sheet-plastic"></i>
            <Link to={"projects"}>All Projects</Link>
          </li>
          <li>
            <i class="fa-solid fa-battery-half"></i>
            <Link to={"work-status"}>Work Status</Link>
          </li>
        </ul>
        <ul>
          <li>
            <i class="fa-regular fa-square-plus"></i>
            <Link to={"add-work-status"}>Add Work Status</Link>
          </li>
        </ul>
        <hr />
        <button className="logout-btn">
          Logout <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
