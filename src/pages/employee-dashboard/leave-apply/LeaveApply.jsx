import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GoBack from "../../../components/go-back/GoBack";
import { useAddLeaveApplyMutation } from "../../../features/leave-management/leaveManagementApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const LeaveApply = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  //User
  const { user } = useContext(AuthContext);
  //Add work task API
  const [addLeaveApply, { isLoading, isSuccess }] = useAddLeaveApplyMutation();
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;
  //Current date
  let currentDate = new Date().toJSON().slice(0, 10);

  //Add work status handler
  const handleLeaveApply = ({ leaveFrom, leaveTo, type }) => {
    //Calculate Days
    const startDate = new Date(leaveFrom);
    const endDate = new Date(leaveTo);

    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 3600 * 24));

    const leave = {
      //leave data
      leaveApply: currentDate,
      leaveFrom,
      leaveTo,
      type,
      totalDays: days + 1,
      status: "pending",
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };

    if (type.trim().length === 0) {
      toast.error("Provide valid input", { id: "leave-apply" });
    } else {
      addLeaveApply(leave);
      reset();
    }
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
              <span>Leave Apply</span> <i class="fa-solid fa-check-double"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleLeaveApply)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Leave From Date</label>
                  <input required type="date" {...register("leaveFrom")} />
                </div>

                <div className="col-md-6">
                  <label>Leave To Date</label>
                  <input required type="date" {...register("leaveTo")} />
                </div>

                <div className="col-md-6">
                  <label>Leave Type</label>
                  <input
                    required
                    type="text"
                    {...register("type", {
                      required: true,
                      maxLength: 100,
                    })}
                  />
                  {errors.type &&
                    errors.type.type === "maxLength" &&
                    toast.error("Max length 100 exceeded", {
                      id: "register-designation-field",
                    })}
                </div>

                <div className="col-md-12">
                  <button className="submit-btn">Apply</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <GoBack/>
    </div>
  );
};

export default LeaveApply;
