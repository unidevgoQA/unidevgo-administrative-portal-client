import React, { useContext } from "react";

import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { useGetWorkTasksQuery } from "../../../features/work-status/workStatusApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./profile.scss";
const Profile = () => {
  //User
  const { user } = useContext(AuthContext);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);
  //Get all task
  const { data: workStatusData } = useGetWorkTasksQuery();
  //Register User
  const registerUser = userData?.data;

  //Filter work status based on email
  const filterWorkStatus = workStatusData?.data.filter(
    (status) => status?.employeeEmail === registerUser?.email
  );

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
                        <img src={registerUser?.img} alt="employee" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="user-info">
                        <div className="row">
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
                                Joining Date : {registerUser?.joiningDate}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="employee-vailability">
                  <div className="row gy-3">
                    <div className="col-md-6">
                      <div className="attendence employee-card">
                        <i class="fa-solid fa-border-all"></i>
                        <h6>Total Leave</h6>
                        <span>30</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="leave-apply employee-card">
                        <i class="fa-solid fa-person-walking-arrow-right"></i>
                        <h6>Leave Apply</h6>
                        <span>20</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="late-coming employee-card">
                        <i class="fa-solid fa-check"></i>
                        <h6>Get Leave</h6>
                        <span>20</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="absent employee-card">
                        <i class="fa-regular fa-circle-xmark"></i>
                        <h6>Remaining Leave</h6>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-task-status">
        <div className="row">
          <div className="col-md-12">
            <div className="heading">
              <h2>
                <span>My Work Status</span>{" "}
                <i class="fa-solid fa-battery-half"></i>{" "}
              </h2>
            </div>
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th className="task">Task</th>
                  <th>Date</th>
                  <th>Hours Of Work</th>
                  <th>Status</th>
                  <th className="description">Desciption</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {filterWorkStatus?.map((work) => (
                  <tr>
                    <td>
                      <img
                        className="employee-img"
                        src={registerUser?.img}
                        alt="employee"
                      />
                    </td>
                    <td>{work?.task}</td>
                    <td>{work?.date}</td>
                    <td>{work?.hour}</td>
                    <td>{work?.workStatus}</td>
                    <td>{work?.description}</td>
                    <td>
                      <button className="update-btn text-white">
                        {work?.workStatus == "in progress"
                          ? "Mark as Complete"
                          : "Mark as in Progress"}
                      </button>

                      <button
                        // onClick={() => handleDelete(employee.id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
