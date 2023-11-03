import React from "react";
import { useForm } from "react-hook-form";
import "./add-work-status.scss";

const addWorkStatus = () => {
  const { handleSubmit, control, register } = useForm();
  const onSubmit = (data) => {
    console.log(data); // You can process the form data here
  };
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                  <select {...register("work-status")}>
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
