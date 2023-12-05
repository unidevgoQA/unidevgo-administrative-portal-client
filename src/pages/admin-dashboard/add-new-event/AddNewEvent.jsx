import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddNewEvent = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  //Add work status handler
  const handleAddEvent = ({ start, end, title }) => {
    const calenderEvent = {
      start,
      end,
      title,
    };
    console.log(calenderEvent)
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Add New Event</span>{" "}
              <i class="fa-solid fa-check-double"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleAddEvent)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Start Date</label>
                  <input required type="date" {...register("start")} />
                </div>

                <div className="col-md-6">
                  <label>End Date</label>
                  <input required type="date" {...register("end")} />
                </div>

                <div className="col-md-6">
                  <label>Title</label>
                  <input
                    required
                    type="text"
                    {...register("title", {
                      required: true,
                      maxLength: 100,
                    })}
                  />
                  {errors.type &&
                    errors.type.type === "maxLength" &&
                    toast.error("Max length 100 exceeded", {
                      id: "event-title-field",
                    })}
                </div>

                <div className="col-md-12">
                  <button className="submit-btn">Add New Event</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewEvent;