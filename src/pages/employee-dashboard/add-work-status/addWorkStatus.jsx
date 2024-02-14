import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { useAddWorkTaskMutation } from "../../../features/work-status/workStatusApi";
import { AuthContext } from "../../../providers/AuthProviders";

const addWorkStatus = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  //User
  const { user } = useContext(AuthContext);
  //Add work task API
  const [addWorkTask, { isLoading, isSuccess }] = useAddWorkTaskMutation();
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;

  const navigate = useNavigate();

  //Add work status handler
  const handleAddWorkStatus = ({
    task,
    date,
    hour,
    workStatus,
    description,
  }) => {
    const convertHour = parseFloat(hour);

    const workTask = {
      //task data
      task,
      date,
      hour: convertHour,
      workStatus,
      description,
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };

    if (task.trim().length === 0 || description.trim().length === 0) {
      toast.error("Provide valid input", { id: "add-work-status" });
    } else {
      addWorkTask(workTask);
      reset();
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added Successfully", { id: "add-work-task" });
      navigate('/dashboard/work-status')
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
                  <input
                    required
                    type="text"
                    {...register("task", {
                      required: true,
                      maxLength: 50,
                    })}
                  />
                  {errors.task && errors.task.type === "maxLength" && (
                    <div style={{ color: "red" }}>
                      Max length of 50 exceeded
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label>Date of Report</label>
                  <input required type="date" {...register("date")} />
                </div>

                <div className="col-md-6">
                  <label for="hour">Hours Worked</label>
                  <input
                    name="hoursWorked"
                    required
                    type="number"
                    min={"0"}
                    max={"24"}
                    step={".1"}
                    {...register("hour")}
                  />
                </div>

                <div className="col-md-6">
                  <label for="hour">Work Status</label>
                  <select required {...register("workStatus")}>
                    <option value="complete">Complete</option>
                    <option value="in progress">In Progress</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label for="description">Work Description</label>
                  <textarea required  {...register("description", {
                      required: true,
                      maxLength: 1000,
                    })}
                  />
                  {errors.description && errors.description.type === "maxLength" && (
                    <div style={{ color: "red" }}>
                      Max length of 1000 exceeded
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <button className="submit-btn">Add Work Status </button>
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

export default addWorkStatus;
