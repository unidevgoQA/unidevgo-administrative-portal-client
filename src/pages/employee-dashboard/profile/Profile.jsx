import React from "react";
import userImg from "../../../assets/employee.jpg";
import "./profile.scss";
const Profile = () => {
  const user = {
    id: 9,
    img: userImg,
    name: "Sarah Smith",
    designation: "Software QA Engineer",
    mobile: "+880-1634534522",
    email: "sara.smith@gmail.com",
    address: "Dhanmondi , Dhaka",
    joiningDate: "01-06-22",
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Profile</span> <i class="fa-solid fa-user-tie"></i>
            </h2>
          </div>
          <div className="profile-current-task-wrapper">
            <div className="row">
              <div className="col-md-6">
                <div className="profile-content-wrapper">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="user-img">
                        <img src={userImg} alt="employee" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="user-info">
                        <div className="row">
                          <div className="col-md-12">
                            <h2>{user.name}</h2>
                          </div>
                          <div className="col-md-12">
                            <h3>{user.designation}</h3>
                          </div>
                          <div className="col-md-12">
                            <h3><i class="fa-solid fa-mobile-screen-button"></i> <span>{user.mobile}</span></h3>
                          </div>
                          <div className="col-md-12">
                            <h3><i class="fa-solid fa-envelope-open-text"></i> <span>{user.email}</span></h3>
                          </div>
                          <div className="col-md-12">
                            <h3><i class="fa-solid fa-calendar-days"></i> <span>{user.joiningDate}</span></h3>
                          </div>
                          <div className="col-md-12">
                            <h3><i class="fa-solid fa-location-dot"></i> <span>{user.address}</span></h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="current-task-wrapper"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
