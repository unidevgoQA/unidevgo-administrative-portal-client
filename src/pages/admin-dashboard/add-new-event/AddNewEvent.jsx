import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useAddCalenderEventMutation } from "../../../features/calender-events/calenderEvents";

const AddNewEvent = () => {
  //Add event api
  const [addEvent, { isLoading, isSuccess }] = useAddCalenderEventMutation();
  //Form
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  //Current year
  const currentYear = new Date().getFullYear();
  //Add event handler
  const handleAddEvent = ({ start, end, title }) => {
    const calenderEvent = {
      start,
      end,
      title,
    };
    addEvent(calenderEvent);
    reset();
  };

  //Add event effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added Successfully", { id: "add-event" });
      navigate("/dashboard/calender");
    }
    if (isLoading) {
      toast.loading("Loading", { id: "add-event" });
    }
  }, [isSuccess, isLoading]);

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
                  <label>
                    Start Date <span>*</span>
                  </label>
                  <input
                    required
                    type="date"
                    {...register("start")}
                    min={`${currentYear}-01-01`}
                    max={`${currentYear + 1}-12-31`}
                  />
                </div>

                <div className="col-md-6">
                  <label>
                    End Date <span>*</span>
                  </label>
                  <input
                    required
                    type="date"
                    {...register("end")}
                    min={`${currentYear}-01-01`}
                    max={`${currentYear + 1}-12-31`}
                  />
                </div>

                <div className="col-md-6">
                  <label>
                    Title <span>*</span>
                  </label>
                  <input
                    required
                    {...register("title", { required: true, maxLength: 35 })}
                  />
                  {errors.title &&
                    errors.title.type === "maxLength" &&
                    toast.error("Max length 35 exceeded", {
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
      <GoBack />
    </div>
  );
};

export default AddNewEvent;
