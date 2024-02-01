import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useGetAllLeavesQuery } from "../../../features/leave-management/leaveManagementApi";

const EmployeeDetails = () => {
  const [profile, setProfile] = useState({});

  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}profile/${id}`;

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.data);
      });
  }, [id]);

  //Leave management data
  const { data } = useGetAllLeavesQuery();
  const allLeaveManagements = data?.data;

  //Filter leaves based on email
  const filterLeaves = allLeaveManagements?.filter(
    (leave) => leave.employeeEmail === profile.email
  );

  const pendingLeaves = filterLeaves?.filter(leave => leave.status === 'pending')

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
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Employee Details</span> <i class="fa-solid fa-user-tie"></i>
            </h2>
          </div>

          <div className="profile-current-task-wrapper">
            <div className="row g-4">
              <div className="col-lg-7 col-md-12">
                <div className="profile-content-wrapper">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <div className="user-img">
                        <img src={profile?.img} alt="employee" />
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      <div className="user-info">
                        <div className="row ">
                          <div className="col-md-12">
                            <h2>{profile?.name}</h2>
                          </div>
                          <div className="col-md-12">
                            <h3>{profile?.desgination}</h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-mobile-screen-button"></i>{" "}
                              <span>{profile?.mobile}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-envelope-open-text"></i>{" "}
                              <span>{profile?.email}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-calendar-days"></i>{" "}
                              <span>Joining Date : {profile?.joiningDate}</span>
                            </h3>
                          </div>
                          <div className="col-md-12">
                            <h3>
                              <i class="fa-solid fa-location-dot"></i>{" "}
                              <span>{profile?.address}</span>
                            </h3>
                          </div>
                        </div>
                        <div className="update-area">
                          <Link
                            to={`/dashboard/update-profile/${profile?._id}`}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-12">
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
                        <h6>Leave Apply</h6>
                        <span>{pendingLeaves?.length} Leave Apply</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="late-coming employee-card">
                        <i class="fa-solid fa-check"></i>
                        <h6>Get Leave</h6>
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
              </div>
            </div>
          </div>

          <div className="work-and-attendence-status-wrapper">
            <Link to={`/dashboard/employee-work-status/${profile?._id}`}>
              <button className="common-btn">Show Work Status</button>
            </Link>
            <Link to={`/dashboard/attendence-report/${profile?._id}`}>
              <button className="common-btn">Show Attendence Report</button>
            </Link>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default EmployeeDetails;
