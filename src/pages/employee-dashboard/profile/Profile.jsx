import React, { useContext } from "react";

// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from "react-router-dom";
import defaultImg from "../../../assets/default.png";
import GoBack from "../../../components/go-back/GoBack";
import { useGetAllLeavesQuery } from "../../../features/leave-management/leaveManagementApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./profile.scss";

const Profile = () => {
  //User
  const { user } = useContext(AuthContext);

  console.log(user.email);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);

  const registerUser = userData?.data;

  //Leave management data
  const { data } = useGetAllLeavesQuery();
  const allLeaveManagements = data?.data;

  //Filter leaves based on email
  const filterLeaves = allLeaveManagements?.filter(
    (leave) => leave.employeeEmail === user.email
  );

  const pendingLeaves = filterLeaves?.filter(
    (leave) => leave.status === "pending"
  );

  //filter accepted leave
  const filerGetLeave = filterLeaves?.filter(
    (leave) => leave.status === "accepted"
  );

  //calculate total get leave days
  const totalGetLeaveDays = filerGetLeave?.reduce(
    (sum, leave) => sum + leave.totalDays,
    0
  );

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="heading">
            <h2>
              <span>Profile</span> <i class="fa-solid fa-user-tie"></i>
            </h2>
          </div>
          <div className="profile-current-task-wrapper">
            <div className="row g-4">
              <div className="col-lg-6 col-md-12">
                <div className="profile-content-wrapper">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <div className="user-img">
                        <img
                          src={
                            registerUser?.img ? registerUser?.img : defaultImg
                          }
                          alt="employee"
                        />
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      <div className="user-info-profile">
                        <div className="row ">
                          <div className="col-md-12">
                            <h2>{registerUser?.name}</h2>
                          </div>
                          <div className="col-md-12">
                            <h3>{registerUser?.designation}</h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-mobile-screen-button"></i>{" "}
                              <span>{registerUser?.mobile}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-envelope-open-text"></i>{" "}
                              <span>{registerUser?.email}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-calendar-days"></i>{" "}
                              <span>
                                Joining Date :{" "}
                                {registerUser?.joiningDate
                                  ?.split("-")
                                  .reverse()
                                  .join("-")}
                              </span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-location-dot"></i>{" "}
                              <span>{registerUser?.address}</span>
                            </h3>
                          </div>
                        </div>
                        {registerUser?.profileEditPermission === "true" && (
                          <div className="update-area">
                            <Link
                              to={`/dashboard/update-profile/${registerUser?._id}`}
                            >
                              <button
                                title="Update Profile"
                                className="update-btn"
                              >
                                {" "}
                                <i className="far fa-edit"></i>
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                {registerUser?.role === "employee" && (
                  <div className="employee-vailability">
                    <div className="row gy-3">
                      <div className="col-md-6">
                        <div className="attendence employee-card">
                          <i class="fa-solid fa-border-all"></i>
                          <h6>Total Leave</h6>
                          <span>17 Days</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="leave-apply employee-card">
                          <i class="fa-solid fa-person-walking-arrow-right"></i>
                          <h6>Pending Leave</h6>
                          <span>{pendingLeaves?.length} Leave Apply</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="late-coming employee-card">
                          <i class="fa-solid fa-check"></i>
                          <h6>Approved Leave</h6>
                          <span>{totalGetLeaveDays} Days</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="absent employee-card">
                          <i class="fa-regular fa-circle-xmark"></i>
                          <h6>Remaining Leave</h6>
                          <span>{17 - totalGetLeaveDays} Days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default Profile;
