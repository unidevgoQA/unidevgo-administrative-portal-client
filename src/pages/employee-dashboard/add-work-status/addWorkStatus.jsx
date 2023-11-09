import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { useAddWorkTaskMutation } from "../../../features/work-status/workStatus";
import { AuthContext } from "../../../providers/AuthProviders";
import "./add-work-status.scss";

const addWorkStatus = () => {
  const { handleSubmit, register } = useForm();
  //User
  const { user } = useContext(AuthContext);
  //Add work task API
  const [addWorkTask, { isLoading, isSuccess }] = useAddWorkTaskMutation();
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;

  //Add work status handler
  const handleAddWorkStatus = ({
    task,
    date,
    hour,
    workStatus,
    description,
  }) => {
    const workTask = {
      //task data
      task,
      date,
      hour,
      workStatus,
      description,
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };

    addWorkTask(workTask);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added Successfully", { id: "add-work-task" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "add-work-task" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Add Work Status</span>{" "}
              <i class="fa-regular fa-square-plus"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleAddWorkStatus)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Task / Project</label>
                  <input {...register("task")} />
                </div>
                <div className="col-md-6">
                  <label>Date of Report</label>
                  <input type="date" {...register("date")} />
                </div>

                <div className="col-md-6">
                  <label for="hour">Hours Worked</label>
                  <input type="number" {...register("hour")} />
                </div>

                <div className="col-md-6">
                  <label for="hour">Work Status</label>
                  <select {...register("workStatus")}>
                    <option value="complete">Complete</option>
                    <option value="in progress">In Progress</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label for="description">Work Description</label>
                  <textarea {...register("description")} />
                </div>
                <div className="col-md-6">
                  <button className="submit-btn">Add Work Status </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default addWorkStatus;
