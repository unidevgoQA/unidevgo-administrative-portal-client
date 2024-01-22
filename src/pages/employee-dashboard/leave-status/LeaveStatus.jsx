import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultImg from "../../../assets/default.png";
import GoBack from "../../../components/go-back/GoBack";
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

  //Tab
  const [activeTab, setActiveTab] = useState("All");

  const filterItems = (status) => {
    setActiveTab(status);
  };

  const getFilteredItems = () => {
    if (activeTab === "All") return filterLeaves;
    return filterLeaves?.filter((item) => item.status === activeTab);
  };
  //Tab

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
              <Link className="add-btn" to={"/dashboard/leave-apply"}>
                <i class="fa-regular fa-square-plus"></i> Leave Apply
              </Link>
            </div>
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
          <div className="table-responsive">
            {getFilteredItems()?.length > 0 ? (
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
                  {getFilteredItems()?.map((leave) => (
                    <tr key={leave?._id}>
                      <td>
                        <img
                          className="employee-img"
                          src={
                            leave?.employeeImg ? leave?.employeeImg : defaultImg
                          }
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
            ) : (
              <h6>No Data Found</h6>
            )}
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default LeaveStatus;
