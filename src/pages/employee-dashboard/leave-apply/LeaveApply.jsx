import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddLeaveApplyMutation } from "../../../features/leave-management/leaveManagementApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";

const LeaveApply = () => {
  const { handleSubmit, register } = useForm();
  //User
  const { user } = useContext(AuthContext);
  //Add work task API
    const [addLeaveApply, { isLoading, isSuccess }] = useAddLeaveApplyMutation();
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;

  //Add work status handler
  const handleLeaveApply = ({ leaveApply, leaveFrom, leaveTo, type }) => {
    const leave = {
      //leave data
      leaveApply,
      leaveFrom,
      leaveTo,
      type,
      status: "pending",
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };
  
    addLeaveApply(leave);
    // addWorkTask(workTask);
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
              <span>Leave Apply</span> <i class="fa-solid fa-file-pen"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleLeaveApply)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Leave Apply Date</label>
                  <input type="date" {...register("leaveApply")} />
                </div>

                <div className="col-md-6">
                  <label>Leave From Date</label>
                  <input type="date" {...register("leaveFrom")} />
                </div>

                <div className="col-md-6">
                  <label>Leave To Date</label>
                  <input type="date" {...register("leaveTo")} />
                </div>

                <div className="col-md-6">
                  <label>Leave Type</label>
                  <input type="text" {...register("type")} />
                </div>

                <div className="col-md-6">
                  <button className="submit-btn">Apply</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApply;
