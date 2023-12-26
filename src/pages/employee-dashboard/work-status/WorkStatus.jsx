import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import exportFromJSON from "export-from-json";
import toast from "react-hot-toast";
// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from "react-router-dom";
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import defaultImg from "../../../assets/default.png";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import {
    useDeleteWorkTaskMutation,
    useGetWorkTasksQuery,
    useUpdateWorkTaskMutation,
} from "../../../features/work-status/workStatusApi";
import { AuthContext } from "../../../providers/AuthProviders";

const WorkStatus = () => {
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
  const [filteredStatusData, setFilteredStatusData] = useState([]);
  const [filteredStatusDataByEmail, setFilteredStatusDataByEmail] = useState(
    []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());


  //Filter work status based on user
  useEffect(() => {
    const filterWorkStatus = workStatusData?.data.filter(
      (status) => status?.employeeEmail === registerUser?.email
    );
    setFilteredStatusDataByEmail(filterWorkStatus);
    setFilteredStatusData(filterWorkStatus);
  }, [workStatusData, registerUser]);

  //Work Hours
  const workHoursNumbers = filteredStatusData?.map((work) => {
    const totalHours = parseFloat(work.hour);
    return totalHours;
  });
  const totalWorkHours = workHoursNumbers?.reduce(
    (acc, current) => acc + current,
    0
  );
  
  //Show all data handler
  const showAllData = () => {
    setFilteredStatusData(filteredStatusDataByEmail);
  };

  //Select date and filter data
  const handleSelect = (date) => {
    setSelectedDate(date);

    const formattedDate = date.toISOString().split("T")[0];

    const filtered = filteredStatusDataByEmail.filter(
      (item) => item.date === formattedDate
    );
    setFilteredStatusData(filtered);
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
          <div className="heading d-flex justify-content-between">
            <h2>
              <span>Work Status</span> <i class="fa-solid fa-user-tie"></i>
            </h2>
            <div className="add-new-area">
              <Link className="add-btn" to={"/dashboard/add-work-status"}>
                <i class="fa-regular fa-square-plus"></i> Add Work Status
              </Link>
            </div>
          </div>
        </div>
      </div>
      <>
        {registerUser?.role === "employee" && (
          <div className="row mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="date-picker-wrapper">
                    <div className="table-responsive">
                      <div className="date-range">
                        {/* <button
                    className="show-all-task-btn"
                    onClick={() => showAllData()}
                  >
                    All
                  </button> */}
                        <DatePicker
                          inline
                          open={true}
                          selected={selectedDate}
                          onChange={handleSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12">
                  <div style={{ width: "100%", height: "100%" }}>
                    <ResponsiveContainer>
                      <ComposedChart
                        data={filteredStatusData}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="task"
                          fill="#8884d8"
                          stroke="#8884d8"
                        />
                        <Bar dataKey="hour" barSize={20} fill="#208436" />
                        <Line
                          type="string"
                          dataKey="workStatus"
                          stroke="#ff7300"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12col-sm-12 mt-3">
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
                              src={
                                work?.employeeImg
                                  ? work?.employeeImg
                                  : defaultImg
                              }
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
                  {filteredStatusData?.length > 0 && (
                    <div className="export-data">
                      <h6>Export data to a CSV file ?</h6>
                      <button className="export-btn" onClick={exportWorkStatus}>
                        {" "}
                        Export Work Staus
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="working-hours">
                    {totalWorkHours > 0 && (
                      <h6>
                        Total Work Hours :{" "}
                        <span>{parseFloat(totalWorkHours).toFixed(1)}</span>{" "}
                        Hour
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

export default WorkStatus;
