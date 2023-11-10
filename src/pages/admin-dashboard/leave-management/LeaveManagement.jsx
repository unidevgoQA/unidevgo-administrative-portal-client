import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useDeleteLeaveMutation,
  useGetAllLeavesQuery,
} from "../../../features/leave-management/leaveManagementApi";
const LeaveManagement = () => {
  //Api
  const { data } = useGetAllLeavesQuery();
  const [deleteLeave, { isSuccess, isLoading }] = useDeleteLeaveMutation();
  //set data
  const allLeaveManagements = data?.data;

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteLeave(id);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Deleted Successfully", { id: "delete-leave" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "delete-leave" });
    }
  }, [isSuccess, isLoading]);

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
                <th className="action-area">Action</th>
              </tr>
            </thead>
            <tbody>
              {allLeaveManagements?.map((leave) => (
                <tr>
                  <td>
                    <img
                      className="employee-img"
                      src={leave?.employeeImg}
                      alt="employee"
                    />
                  </td>
                  <td>{leave?.employeeName}</td>
                  <td>{leave?.leaveApply}</td>
                  <td>{leave?.status}</td>
                  <td>{leave?.leaveFrom}</td>
                  <td>{leave?.leaveTo}</td>
                  <td>{leave?.type}</td>

                  <td>
                    <Link to={`update-leave-status/${leave.id}`}>
                      <button className="update-btn">
                        {" "}
                        <i className="far fa-edit"></i>
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(leave?._id)}
                      className="delete-btn"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
