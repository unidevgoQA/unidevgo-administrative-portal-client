import { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const Topbar = () => {
  //context
  const { logoutUser, user } = useContext(AuthContext);

  const { data } = useGetProfileByEmailQuery(user.email);

  const registerUser = data?.data;

  //Logout
  const handleLogout = () => {
    logoutUser()
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <nav className="topbar navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img width={"150px"} src={logo} alt="Logo" className="navbar-logo" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            {" "}
            <i class="fa-solid fa-bars"></i>
          </span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <hr />
          <div className="side-links">
            {registerUser?.role === "admin" ||
            registerUser?.role === "super admin" ? (
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
                  <i class="fa-solid fa-user-tie"></i>
                  <Link to={"profile"}>Profile</Link>
                </li>
                <li>
                  <i class="fa-regular fa-calendar-days"></i>
                  <Link to={"calender"}>Calender</Link>
                </li>
                <li>
                  <i class="fa-regular fa-envelope"></i>
                  <Link to={"send-email"}>Send Email</Link>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <i class="fa-solid fa-user-tie"></i>
                  <Link to={"profile"}>Profile</Link>
                </li>
                <li>
                  <i class="fa-solid fa-clipboard-user"></i>
                  <Link to={"attendence"}>Attendence</Link>
                </li>
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
                  <i class="fa-regular fa-calendar-days"></i>
                  <Link to={"calender"}>Calender</Link>
                </li>
              </ul>
            )}

            <hr />
            <button onClick={() => handleLogout()} className="logout-btn">
              Logout <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
