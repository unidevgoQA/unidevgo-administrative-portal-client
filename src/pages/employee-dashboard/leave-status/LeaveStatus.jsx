import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultImg from '../../../assets/default.png';
import {
  useDeleteLeaveMutation,
  useGetAllLeavesQuery,
} from "../../../features/leave-management/leaveManagementApi";
import { AuthContext } from "../../../providers/AuthProviders";


const LeaveStatus = () => {
  //Leave management data
  const { data } = useGetAllLeavesQuery();
  const [deleteLeave, { isSuccess, isLoading }] = useDeleteLeaveMutation();
  const allLeaveManagements = data?.data;
  //User
  const { user } = useContext(AuthContext);
  //Filter leaves based on email
  const filterLeaves = allLeaveManagements?.filter(
    (leave) => leave.employeeEmail === user.email
  );

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
          <div className="heading d-flex justify-content-between">
            <h2>
              <span>Leave Status</span>{" "}
              <i class="fa-solid fa-person-walking-arrow-right"></i>
            </h2>
            <div className="add-new-area">
              <Link
                className="add-btn"
                to={"/dashboard/leave-apply"}
              >
                <i class="fa-regular fa-square-plus"></i>  Leave Apply
              </Link>
            </div>
          </div>
          <div className="table-responsive">
            <table class="table-modify table table-striped">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Apply Date</th>
                  <th>Status</th>
                  <th>Leave From</th>
                  <th>Leave To</th>
                  <th>Total Days</th>
                  <th>Leave Type</th>
                  <th className="action-area">Action</th>
                </tr>
              </thead>
              <tbody>
                {filterLeaves?.map((leave) => (
                  <tr key={leave?._id}>
                    <td>
                      <img
                        className="employee-img"
                        src={leave?.employeeImg ? leave?.employeeImg : defaultImg}
                        alt="employee"
                      />
                    </td>
                    <td>{leave?.leaveApply}</td>
                    <td>{leave?.status}</td>
                    <td>{leave?.leaveFrom}</td>
                    <td>{leave?.leaveTo}</td>
                    <td>{leave?.totalDays}</td>
                    <td>{leave?.type}</td>

                    <td>
                      <button
                        onClick={() => handleDelete(leave._id)}
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
    </div>
  );
};

export default LeaveStatus;
