import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { useSocket } from "../../../context/SocketContext";
import { useGetProfilesQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./contact-container.scss";

const ContactsContainer = ({ setRecipientId }) => {
  const { data } = useGetProfilesQuery();
  const { user, logoutUser } = useContext(AuthContext);
  const { onlineUsers, unreadMessages, markMessagesAsRead } = useSocket(); // Get unreadMessages from socket context

  const onlineUsersList = Array.isArray(onlineUsers) ? onlineUsers : [];
  const allProfiles = data?.data;

  const employees = allProfiles?.filter(
    (profile) => profile?._id !== user?.id && profile?.role === "employee"
  );

  const [selectedUserId, setSelectedUserId] = useState(null);

  // Handle user selection
  const handleUserClick = (employee) => {
    setSelectedUserId(employee?._id);
    setRecipientId(employee?._id);
    markMessagesAsRead(employee?._id); // Call the function to reset the count
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
  };


  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="contacts-container-wrapper">
      <div className="logo-contacts-wrapper">
        <div className="logo">
          <img src={logo} alt="logo" />
          <button title="Go Back" onClick={goBack}><i class="fa-solid fa-chevron-left"></i></button>
        </div>
        <div className="contacts-wrapper">
          {employees?.map((employee) => (
            <div
              key={employee?._id}
              className={`user-info ${
                selectedUserId === employee?._id ? "selected" : ""
              }`}
              onClick={() => handleUserClick(employee)}
            >
              <img src={employee?.img} alt="Employee" />
              <h6>{employee?.name}</h6>
              <span
                className={`status ${
                  onlineUsersList.includes(employee?._id) ? "online" : "offline"
                }`}
              ></span>

              {/* Display unread message count if greater than 0 */}
              {unreadMessages[employee._id] > 0 && (
                <span className="unread-count">
                  {unreadMessages[employee._id]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="profile-info">
        <div className="name-img-wrapper">
          <img src={user?.img} alt="" />
          <h6>{user?.name}</h6>
        </div>
        <button title="Logout" onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  );
};

export default ContactsContainer;
