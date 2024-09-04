import React, { useContext } from "react";
import logo from "../../../assets/logo.png";
import { useSocket } from "../../../context/SocketContext";
import { useGetProfilesQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./contact-container.scss";

const ContactsContainer = ({ setRecipientId }) => {
  // Fetch profiles data using the custom hook
  const { data } = useGetProfilesQuery();
  const { user, logoutUser } = useContext(AuthContext);
  const { onlineUsers } = useSocket(); // onlineUsers is expected to be an array of user IDs

  // Ensure onlineUsers is an array or an empty array if undefined
  const onlineUsersList = Array.isArray(onlineUsers) ? onlineUsers : [];

  // Extract all profiles from the response
  const allProfiles = data?.data;

  // Filter profiles to get only employees and exclude the current user
  const employees = allProfiles?.filter(
    (profile) => profile?._id !== user?.id && profile?.role === "employee"
  );

  // Logout
  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="contacts-container-wrapper">
      <div className="logo-contacts-wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="contacts-wrapper">
          {employees?.map((employee) => (
            <div
              key={employee?._id}
              className="user"
              onClick={() => setRecipientId(employee?._id)}
            >
              <img src={employee?.img} alt="Employee" />
              <h6>{employee?.name}</h6>
              <span
                className={`status ${
                  onlineUsersList.includes(employee?._id) ? "online" : "offline"
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>
      <div className="profile-info">
        <div className="name-img-wrapper">
          <img src={user?.img} alt="" />
          <h6>{user?.name}</h6>
        </div>
        <button onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default ContactsContainer;
