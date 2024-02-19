import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useUpdateWorkTaskMutation } from "../../../features/work-status/workStatusApi";

const UpdateWorkStatus = () => {
  const { handleSubmit } = useForm();

  const navigate = useNavigate();

  //Get id
  const { id } = useParams();

  //Set url
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}work-status/${id}`;

  // state
  const [updateWorkStatus, setUpdateWorkStatus] = useState({});

  //Data load
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setUpdateWorkStatus(data?.data));
  }, [id]);

  //update work status
  const handleTaskChange = (e) => {
    const updatedTask = e.target.value;

    if (updatedTask.trim().length === 0 || updatedTask.trim().length === 0) {
      toast.error("Provide valid input", { id: "update-work-status" });
    } else if (updatedTask.length >= 80) {
      toast.error("Name cannot be more than 80 characters", {
        id: "update-work-status",
      });
    } else {
      const updatedWorkStatus = {
        task: updatedTask,
        description: updateWorkStatus.description,
        hour: updateWorkStatus.hour,
        workStatus: updateWorkStatus.workStatus,
        date: updateWorkStatus.date,
      };
      setUpdateWorkStatus(updatedWorkStatus);
    }
  };

  const handleDateChange = (e) => {
    const updatedDate = e.target.value;

    const updatedWorkStatus = {
      task: updateWorkStatus.task,
      description: updateWorkStatus.description,
      hour: updateWorkStatus.hour,
      workStatus: updateWorkStatus.workStatus,
      date: updatedDate,
    };
    setUpdateWorkStatus(updatedWorkStatus);
  };

  const handleHourChange = (e) => {
    const updatedHour = e.target.value;

    const updatedWorkStatus = {
      task: updateWorkStatus.task,
      description: updateWorkStatus.description,
      hour: updatedHour,
      workStatus: updateWorkStatus.workStatus,
      date: updateWorkStatus.date,
    };
    setUpdateWorkStatus(updatedWorkStatus);
  };

  const handleStatusChange = (e) => {
    const updatedStatus = e.target.value;

    const updatedWorkStatus = {
      task: updateWorkStatus.task,
      description: updateWorkStatus.description,
      hour: updateWorkStatus.hour,
      workStatus: updatedStatus,
      date: updateWorkStatus.date,
    };
    setUpdateWorkStatus(updatedWorkStatus);
  };

  const handleDescriptionChange = (e) => {
    const updatedDescription = e.target.value;

    const updatedWorkStatus = {
      task: updateWorkStatus.task,
      description: updatedDescription,
      hour: updateWorkStatus.hour,
      workStatus: updateWorkStatus.workStatus,
      date: updateWorkStatus.date,
    };
    setUpdateWorkStatus(updatedWorkStatus);
  };

  //Update API
  const [
    handleUpdateWorkStatus,
    { isLoading: worksStatusLoading, isSuccess: workStatusSuccess },
  ] = useUpdateWorkTaskMutation();

  //Update Handler
  const handleWorkStatusUpdate = (e) => {
    handleUpdateWorkStatus({ id: id, data: updateWorkStatus });
  };

  //Update Effects
  useEffect(() => {
    if (workStatusSuccess) {
      toast.success("Update Successfully", { id: "update-work-task" });
      navigate("/dashboard/work-status");
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
              <span>Update Work Status</span>{" "}
              <i class="fa-regular fa-square-plus"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleWorkStatusUpdate)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Task / Project</label>
                  <input
                    required
                    onChange={handleTaskChange}
                    value={updateWorkStatus?.task}
                    type="text"
                  />
                </div>
                <div className="col-md-6">
                  <label>Date of Report</label>
                  <input
                    value={updateWorkStatus?.date}
                    onChange={handleDateChange}
                    required
                    type="date"
                  />
                </div>

                <div className="col-md-6">
                  <label for="hour">Hours Worked</label>
                  <input
                    name="hoursWorked"
                    value={updateWorkStatus?.hour}
                    onChange={handleHourChange}
                    required
                    type="number"
                    min={"0"}
                    max={"24"}
                    step={".1"}
                  />
                </div>

                <div className="col-md-6">
                  <label for="hour">Work Status</label>
                  <select
                    value={updateWorkStatus?.workStatus}
                    required
                    onChange={handleStatusChange}
                  >
                    <option value="complete">Complete</option>
                    <option value="in progress">In Progress</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label for="description">Work Description</label>
                  <textarea
                    value={updateWorkStatus?.description}
                    onChange={handleDescriptionChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <button className="submit-btn">Update Work Status </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default UpdateWorkStatus;
