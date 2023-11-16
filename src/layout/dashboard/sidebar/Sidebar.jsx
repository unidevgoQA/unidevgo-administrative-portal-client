import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const Sidebar = () => {
  //context
  const { logoutUser, user, isOpen, setIsOpen } = useContext(AuthContext);

  const { data } = useGetProfileByEmailQuery(user.email);

  const registerUser = data?.data;
  //Sidebar toggler
  const toggleSidebar = () => {
    setIsOpen((current) => !current);
  };
  //Logout
  const handleLogout = () => {
    logoutUser()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
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
        {registerUser?.role === "admin" ? (
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
              <i class="fa-solid fa-battery-half"></i>
              <Link to={"work-status"}>Work Status</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <i class="fa-regular fa-square-plus"></i>
              <Link to={"add-work-status"}>Add Work Status</Link>
            </li>
            <li>
              <i class="fa-solid fa-check-double"></i>
              <Link to={"leave-apply"}>Leave Apply</Link>
            </li>
            <li>
              <i class="fa-solid fa-person-walking-arrow-right"></i>
              <Link to={"leave-status"}>Leave Status</Link>
            </li>
            <li>
              <i class="fa-solid fa-user-tie"></i>
              <Link to={"profile"}>Profile</Link>
            </li>
          </ul>
        )}

        <hr />
        <button onClick={() => handleLogout()} className="logout-btn">
          Logout <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
