import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  useDeleteWorkTaskMutation,
  useGetWorkTasksQuery,
  useUpdateWorkTaskMutation,
} from "../../../features/work-status/workStatusApi";

const WorkStatus = () => {
  //APIs
  const { data: workStatusData } = useGetWorkTasksQuery();

  const allStatusData = workStatusData?.data;
  //Update API
  const [
    handleUpdateWorkStatus,
    { isLoading: worksStatusLoading, isSuccess: workStatusSuccess },
  ] = useUpdateWorkTaskMutation();
  //Delete API
  const [deleteWorkStatus, { isSuccess, isLoading }] =
    useDeleteWorkTaskMutation();

  //States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [profile, setProfile] = useState({});
  const [filteredStatusData, setFilteredStatusData] = useState([]);

  const [filteredStatusDataByEmail, setFilteredStatusDataByEmail] = useState(
    []
  );
  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}profile/${id}`;

  const workHoursNumbers = filteredStatusData?.map((work) => {
    const totalHours = parseInt(work.hour);
    return totalHours;
  });

  const totalWorkHours = workHoursNumbers?.reduce(
    (acc, current) => acc + current,
    0
  );

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.data);
      });
  }, [id]);

  useEffect(() => {
    const filterWorkStatus = allStatusData?.filter(
      (workStatus) => workStatus.employeeEmail === profile.email
    );
    setFilteredStatusDataByEmail(filterWorkStatus);
    setFilteredStatusData(filterWorkStatus);
  }, [allStatusData, profile]);

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

  const data = [
    {
      name: "Sarah Smith",
      desgination: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
    },
    {
      name: "Sarah Smith",
      desgination: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
    },
    {
      name: "Sarah Smith",
      desgination: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
    },
    {
      name: "Sarah Smith",
      desgination: "Software QA Engineer",
      mobile: "+880-1634534522",
      email: "sara.smith@gmail.com",
    },
  ];
  //Export Work Status
  const exportWorkStatus = () => {

  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteWorkStatus(id);
    }
  };

  //handle Update
  const handleStatusChange = (id, workStatus) => {
    const updatedStatus =
      workStatus === "complete" ? "in progress" : "complete";
    const updateWorkTask = {
      workStatus: updatedStatus,
    };
    handleUpdateWorkStatus({ id: id, data: updateWorkTask });
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
              <span>Work Status</span> <i class="fa-solid fa-battery-half"></i>{" "}
            </h2>
          </div>

          <div className="row mb-5">
            <div className="col-lg-1 col-md-1 col-sm-12">
              <div className="date-range">
                <DateRangePicker
                  direction="horizontal"
                  showDateDisplay={false}
                  showMonthAndYearPickers={false}
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                />
              </div>
            </div>
            <div className="col-lg-11 col-md-11 col-sm-12">
            {filteredStatusData?.length > 0 ? (
              <>
              
                  <table class="table-modify table table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th className="task">Task</th>
                        <th>Date</th>
                        <th>Hours Of Work</th>
                        <th>Status</th>
                        <th className="description">Desciption</th>
                        <th className="action-area">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStatusData?.map((work) => (
                        <tr>
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
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <div className="export-data">
                        <h6>Export data to a CSV file ?</h6>
                        <button
                          className="export-btn"
                          onClick={exportWorkStatus}
                        >
                          {" "}
                          Export Work Staus
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="working-hours">
                        <h6>
                          Total Work Hours : <span>{totalWorkHours}</span> Hour
                        </h6>
                      </div>
                    </div>
                  </div>
              
              </>
            ) : (
              <>
                <h6>No Data Found</h6>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkStatus;
