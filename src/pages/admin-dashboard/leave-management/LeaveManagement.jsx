import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import defaultImg from "../../../assets/default.png";
import GoBack from "../../../components/go-back/GoBack";
import {
  useDeleteLeaveMutation,
  useGetAllLeavesQuery,
  useLeaveEmailMutation,
  useUpdateLeaveMutation,
} from "../../../features/leave-management/leaveManagementApi";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { AuthContext } from "../../../providers/AuthProviders";
import "./leave-management.scss";

const LeaveManagement = () => {
  //User
  const { user } = useContext(AuthContext);

  //Get user by email Api
  const { data: userData } = useGetProfileByEmailQuery(user.email);

  //Register User
  const registerUser = userData?.data;

  //Api
  const { data } = useGetAllLeavesQuery();
  const [deleteLeave, { isSuccess, isLoading }] = useDeleteLeaveMutation();
  const [
    leaveEmail,
    { isLoading: leaveEmailSuccess, isLoading: loadingEmailSuccess },
  ] = useLeaveEmailMutation();
  const [
    updateLeave,
    { isSuccess: leaveUpdateSuccess, isLoading: leaveUpdateLoading },
  ] = useUpdateLeaveMutation();

  //set data
  const allLeaveManagements = data?.data;

  //Tab
  const [activeTab, setActiveTab] = useState("All");

  const filterItems = (status) => {
    setActiveTab(status);
  };

  const getFilteredItems = () => {
    if (activeTab === "All") return allLeaveManagements;
    return allLeaveManagements.filter((item) => item.status === activeTab);
  };
  //Tab

  //Accept leave handler
  const handleAcceptLeave = (
    leaveId,
    employeeEmail,
    totalDays,
    employeeName,
    leaveApply,
    type
  ) => {
    const leave = {
      leaveStatus: "accepted",
      employeeEmail,
      employeeName,
      totalDays,
      leaveApply,
      type,
    };
    const acceptLeave = window.confirm("Want to Accept this leave request?");
    if (acceptLeave) {
      updateLeave({ id: leaveId, data: { leave } });
      leaveEmail(leave);
    }
  };
  //Accept leave handler

  //Rejected leave handler
  const handleRejectLeave = (
    leaveId,
    employeeEmail,
    totalDays,
    employeeName,
    leaveApply,
    type
  ) => {
    const leave = {
      leaveStatus: "rejected",
      employeeEmail,
      employeeName,
      totalDays,
      leaveApply,
      type,
    };
    const rejectLeave = window.confirm("Want to Reject this leave request?");
    if (rejectLeave) {
      updateLeave({ id: leaveId, data: { leave } });
      leaveEmail(leave);
    }
  };
  //Rejected leave handler

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteLeave(id);
    }
  };

  // Delete effects
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-leave" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-leave" });
    }
  }, [isSuccess, isLoading]);

  // Update effects
  useEffect(() => {
    if (leaveUpdateSuccess) {
      toast.success("Updated Successfully", { id: "update-leave" });
    }
    if (leaveUpdateLoading) {
      toast.loading("Loading", { id: "update-leave" });
    }
  }, [leaveUpdateSuccess, leaveUpdateLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Leave Management</span>{" "}
              <i class="fa-solid fa-list-check"></i>
            </h2>
          </div>

          <div className="tab">
            <button
              onClick={() => filterItems("All")}
              className={activeTab === "All" ? "active" : ""}
            >
              All
            </button>
            <button
              onClick={() => filterItems("pending")}
              className={activeTab === "pending" ? "active" : ""}
            >
              Pending
            </button>
            <button
              onClick={() => filterItems("accepted")}
              className={activeTab === "accepted" ? "active" : ""}
            >
              Accepted
            </button>
            <button
              onClick={() => filterItems("rejected")}
              className={activeTab === "rejected" ? "active" : ""}
            >
              Rejected
            </button>
          </div>

          {getFilteredItems()?.length > 0 ? (
            <>
              <div className="table-responsive">
                <table class="table-modify table table-striped">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Apply Date</th>
                      <th>Status</th>
                      <th>Leave From</th>
                      <th>Leave To</th>
                      <th>Leave Type</th>
                      <th>Total Days</th>
                      {/* <th>Update Status</th> */}
                      {registerUser?.role === "super admin" && (
                        <th className="action-area">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredItems()?.map((leave) => (
                      <tr key={leave?._id}>
                        <td>
                          <img
                            className="employee-img"
                            src={
                              leave?.employeeImg
                                ? leave?.employeeImg
                                : defaultImg
                            }
                            alt="employee"
                          />
                        </td>
                        <td>{leave?.employeeName}</td>
                        <td>{leave?.leaveApply}</td>
                        <td>{leave?.status}</td>
                        <td>{leave?.leaveFrom}</td>
                        <td>{leave?.leaveTo}</td>
                        <td>{leave?.type}</td>
                        <td>{leave?.totalDays}</td>
                        {/* <td className="update-status">
                      <select
                        value={leaveStatuses[leave._id] || leave.status}
                        onChange={(e) =>
                          handleStatusChange(leave._id, e.target.value)
                        }
                        name="status"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        title="Update Status"
                        onClick={() =>
                          handleLeaveStatusChange(
                            leave?._id,
                            leave?.employeeEmail,
                            leave?.totalDays,
                            leave?.employeeName,
                            leave?.leaveApply,
                            leave?.type
                          )
                        }
                        className="update-btn status"
                      >
                        
                        <i className="fa-solid fa-pen-nib"></i>
                      </button>
                    </td> */}
                        {registerUser?.role === "admin" ||
                          (registerUser?.role === "super admin" && (
                            <td>
                              <button
                                className="leave-accept-btn"
                                onClick={() =>
                                  handleAcceptLeave(
                                    leave?._id,
                                    leave?.employeeEmail,
                                    leave?.totalDays,
                                    leave?.employeeName,
                                    leave?.leaveApply,
                                    leave?.type
                                  )
                                }
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectLeave(
                                    leave?._id,
                                    leave?.employeeEmail,
                                    leave?.totalDays,
                                    leave?.employeeName,
                                    leave?.leaveApply,
                                    leave?.type
                                  )
                                }
                                className="leave-reject-btn"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleDelete(leave?._id)}
                                className="delete-btn"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <h6 className="mt-4">No Data Found</h6>
          )}
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default LeaveManagement;
