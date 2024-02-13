import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GoBack from "../../../components/go-back/GoBack";
import {
    useAddLeaveEmailMutation,
    useDeleteLeaveEmailMutation,
    useGetAllEmailQuery,
} from "../../../features/leave-email/leaveEmailApi";
import './leave-email-list.scss';

const LeaveEmailList = () => {
  const [addLeaveEmail, { isLoading, isSuccess }] = useAddLeaveEmailMutation();
  const [removeLeaveEmail, { isLoading : removeLoading, isSuccess : removeSuccess }] = useDeleteLeaveEmailMutation();
  const { data } = useGetAllEmailQuery();


  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  //Add Email Handler
  const handleAddEmail = ({ email }) => {
    const leaveEmail = {
      email: email,
    };
    addLeaveEmail(leaveEmail);
    reset();
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to remove this email from list ?");
    if (deleteConfirm) {
      removeLeaveEmail(id);
    }
  };


  //Add email
  useEffect(() => {
    if (isSuccess) {
      toast.success("Added Successfully", { id: "leave-email" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "leave-email" });
    }
  }, [isSuccess, isLoading]);

  //Remove email
  useEffect(() => {
    if (removeSuccess) {
      toast.success("Remove Successfully", { id: "leave-email" });
    }
    if (removeLoading) {
      toast.loading("Loading", { id: "leave-email" });
    }
  }, [removeSuccess, removeLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Leave Email List</span>{" "}
              <i class="fa-solid fa-check-double"></i>
            </h2>
          </div>

          <div className="row">
            {data?.data.map((singleEmail) => (
              <div className="col-md-3">
                <div className="leave-email">
                  <span>{singleEmail?.email}</span>
                  <i  onClick={() => handleDelete(singleEmail?._id)} class="fa-solid fa-xmark"></i>
                </div>
              </div>
            ))}
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleAddEmail)}>
              <div className="row">
                <div className="col-md-6">
                  <label>Add Email</label>
                  <input required type="email" {...register("email")} />
                </div>

                <div className="col-md-12">
                  <button className="submit-btn">Add Email</button>
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

export default LeaveEmailList;
