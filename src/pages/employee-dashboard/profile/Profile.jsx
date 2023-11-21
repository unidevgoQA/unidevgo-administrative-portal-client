import React, { useContext, useEffect, useState } from "react";

import exportFromJSON from "export-from-json";
import { DateRangePicker } from "react-date-range";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGetAllLeavesQuery } from "../../../features/leave-management/leaveManagementApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import {
  useDeleteWorkTaskMutation,
  useGetWorkTasksQuery,
  useUpdateWorkTaskMutation,
} from "../../../features/work-status/workStatusApi";
import { AuthContext } from "../../../providers/AuthProviders";

const Profile = () => {
  //User
  const { user } = useContext(AuthContext);
  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);

  const [deleteWorkStatus, { isSuccess, isLoading }] =
    useDeleteWorkTaskMutation();
  //Get all task
  const { data: workStatusData } = useGetWorkTasksQuery();
  //Register User
  const registerUser = userData?.data;

  //States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredStatusData, setFilteredStatusData] = useState([]);
  const [filteredStatusDataByEmail, setFilteredStatusDataByEmail] = useState(
    []
  );

  useEffect(() => {
    const filterWorkStatus = workStatusData?.data.filter(
      (status) => status?.employeeEmail === registerUser?.email
    );
    setFilteredStatusDataByEmail(filterWorkStatus);
    setFilteredStatusData(filterWorkStatus);
  }, [workStatusData, registerUser]);

  //Work Hours
  const workHoursNumbers = filteredStatusData?.map((work) => {
    const totalHours = parseInt(work.hour);
    return totalHours;
  });
  const totalWorkHours = workHoursNumbers?.reduce(
    (acc, current) => acc + current,
    0
  );

  // Date select
  const handleSelect = (date) => {
    let filtered = filteredStatusDataByEmail.filter((workStatus) => {
      let statusDate = new Date(workStatus["date"]);
      return (
        statusDate >= date.selection.startDate &&
        statusDate <= date.selection.endDate
      );
    });
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
    setFilteredStatusData(filtered);
  };

  //Select date range
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  //Export Work Status
  const exportWorkStatus = () => {
    const fileName = "Work Status";
    const exportType = exportFromJSON.types.csv;

    const combinedData = [
      ...filteredStatusData,
      { TotalHours: totalWorkHours },
    ];
    exportFromJSON({
      data: combinedData,
      fields: {
        employeeName: "NAME",
        task: "TASK",
        date: "DATE",
        hour: "HOURS",
        workStatus: "STATUS",
        TotalHours: "TOTAL WORK HOURS",
      },
      fileName,
      exportType,
    });
  };

  //Update API
  const [
    handleUpdateWorkStatus,
    { isLoading: worksStatusLoading, isSuccess: workStatusSuccess },
  ] = useUpdateWorkTaskMutation();
  //Leave management data
  const { data } = useGetAllLeavesQuery();
  const allLeaveManagements = data?.data;
  //Filter leaves based on email
  const filterLeaves = allLeaveManagements?.filter(
    (leave) => leave.employeeEmail === user.email
  );

  const filerGetLeave = filterLeaves?.filter(
    (leave) => leave.status === "accepted"
  );

  //handle Update
  const handleStatusChange = (id, workStatus) => {
    const updatedStatus =
      workStatus === "complete" ? "in progress" : "complete";
    const updateWorkTask = {
      workStatus: updatedStatus,
    };
    handleUpdateWorkStatus({ id: id, data: updateWorkTask });
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteWorkStatus(id);
    }
  };
  //Delete Effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-work-task" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-work-task" });
    }
  }, [isSuccess, isLoading]);
  //Update Effects
  useEffect(() => {
    if (workStatusSuccess) {
      toast.success("Update Successfully", { id: "update-work-task" });
    }
    if (worksStatusLoading) {
      toast.loading("Loading", { id: "update-work-task" });
    }
  }, [workStatusSuccess, worksStatusLoading]);

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
              <div className="col-lg-6 col-md-12">
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
                            <h3>{registerUser?.desgination}</h3>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
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
                        <span>{filterLeaves?.length}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="late-coming employee-card">
                        <i class="fa-solid fa-check"></i>
                        <h6>Get Leave</h6>
                        <span>{filerGetLeave?.length}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="absent employee-card">
                        <i class="fa-regular fa-circle-xmark"></i>
                        <h6>Remaining Leave</h6>
                        <span>{30 - filerGetLeave?.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {registerUser?.role === "employee" && (
          <div className="row mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
             <div className="table-responsive">
             <div className="date-range">
                <DateRangePicker
                  direction="horizontal"
                  rangeColors={["#1F8536"]}
                  showDateDisplay={false}
                  showMonthAndYearPickers={false}
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                />
              </div>
             </div>
            </div>
            <div className="col-lg-12 col-md-12col-sm-12">
              {filteredStatusData?.length > 0 ? (
                <div className="table-responsive">
                  <table class="table-modify table table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th className="task">Task</th>
                        <th>Date</th>
                        <th>Hours Of Work</th>
                        <th>Status</th>
                        <th className="description">Description</th>
                        <th className="action-area">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStatusData?.map((work) => (
                        <tr key={work?._id}>
                          <td>
                            <img
                              className="employee-img"
                              src={work?.employeeImg}
                              alt="employee"
                            />
                          </td>
                          <td>{work?.task}</td>
                          <td>{work?.date}</td>
                          <td>{work?.hour}</td>
                          <td>{work?.workStatus}</td>
                          <td>{work?.description}</td>
                          <td>
                            <button
                              onClick={() =>
                                handleStatusChange(work?._id, work?.workStatus)
                              }
                              className="update-btn text-white"
                            >
                              {work?.workStatus == "in progress"
                                ? "Mark as Complete"
                                : "Mark as in Progress"}
                            </button>

                            <button
                              onClick={() => handleDelete(work?._id)}
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
              ) : (
                <>
                  <h6>No Data Found</h6>
                </>
              )}
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="export-data">
                    <h6>Export data to a CSV file ?</h6>
                    <button className="export-btn" onClick={exportWorkStatus}>
                      {" "}
                      Export Work Staus
                    </button>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="working-hours">
                    {totalWorkHours > 0 && (
                      <h6>
                        Total Work Hours : <span>{totalWorkHours}</span> Hour
                      </h6>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Profile;
