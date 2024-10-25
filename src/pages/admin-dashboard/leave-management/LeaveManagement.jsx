import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import defaultImg from "../../../assets/default.png";
import GoBack from "../../../components/go-back/GoBack";
import { useGetAllEmailQuery } from "../../../features/leave-email/leaveEmailApi";
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
  const [activeTab, setActiveTab] = useState("pending");

  const filterItems = (status) => {
    setActiveTab(status);
    setCurrentPage(1);
    setSearchedPage("");
  };

  const getFilteredItems = () => {
    if (activeTab === "All") return allLeaveManagements?.slice().reverse();
    return allLeaveManagements
      ?.slice()
      .reverse()
      .filter((item) => item.status === activeTab);
  };
  //Tab

  console.log(getFilteredItems());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchedPage, setSearchedPage] = useState("");

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredItems()?.length / itemsPerPage);

  // Determine the range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getFilteredItems()?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchedPage("");
  };

  // Handle page search
  const handleSearch = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(searchedPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSearchedPage("");
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSearchedPage("");
    }
  };

  //Get Emails
  const { data: leaveEmails } = useGetAllEmailQuery();
  const allLeaveEmails = leaveEmails?.data;
  const getEmails = allLeaveEmails?.map((email) => email?.email);

  console.log(getEmails);

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
      recipients: [employeeEmail, ...getEmails],
      totalDays,
      employeeName,
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
      recipients: [employeeEmail, ...getEmails],
      totalDays,
      employeeName,
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
          <div className="row">
            <div className="col-md-12">
              <div className="heading d-flex justify-content-between">
                <h2>
                  <span>Leave Management</span>{" "}
                  <i class="fa-solid fa-list-check"></i>
                </h2>
                {registerUser?.role === "super admin" && (
                  <div className="add-new-area">
                    <Link
                      className="add-btn"
                      to={"/dashboard/leave-email-list"}
                    >
                      <i class="fa-regular fa-envelope"></i> Control Leave Email
                    </Link>
                  </div>
                )}
              </div>
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
                      {activeTab === "pending" && (
                        <th className="action-area">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems?.map((leave) => (
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
                        <td>
                          {leave?.leaveApply?.split("-").reverse().join("-")}
                        </td>
                        <td>{leave?.status}</td>
                        <td>
                          {leave?.leaveFrom?.split("-").reverse().join("-")}
                        </td>
                        <td>
                          {leave?.leaveTo?.split("-").reverse().join("-")}
                        </td>
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
                        {activeTab === "pending" && (
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
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination controls */}
              <div className="pagination-main-wrapper">
                {/* Search field for specific page */}
                <form className="pagination-form" onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchedPage}
                    onChange={(e) => setSearchedPage(e.target.value)}
                    placeholder={`Go to page (1-${totalPages})`}
                  />
                  <button type="submit">Go</button>
                </form>

                {/* Pagination buttons */}
                <div>
                  <button
                    className="pagination-btn"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-btn ${
                          currentPage === index + 1 ? "active" : ""
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                  <button
                    className="pagination-btn"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <h6 className="mt-4">No Leave Found</h6>
          )}
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default LeaveManagement;
