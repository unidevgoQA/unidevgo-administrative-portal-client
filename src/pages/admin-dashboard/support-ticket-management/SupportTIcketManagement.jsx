import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import {
  useDeleteTicketMutation,
  useGetAllTicketsQuery,
} from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";
import "./support-ticket-management.scss";

const SupportTIcketManagement = () => {
  //User
  const { user } = useContext(AuthContext);
  const [deleteTicket, { isLoading, isSuccess }] = useDeleteTicketMutation();
  //All tickets data
  const { data } = useGetAllTicketsQuery();
  //Set ticket data
  const allTickets = data?.data;


  const [selectedTab, setSelectedTab] = useState("all");
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    // Filter tickets based on the selected tab
    if (selectedTab === "all") {
      setFilteredTickets(allTickets);
    } else if (selectedTab === "active") {
      setFilteredTickets(
        allTickets.filter((ticket) => ticket.status === "active")
      );
    } else if (selectedTab === "close") {
      setFilteredTickets(
        allTickets.filter((ticket) => ticket.status === "close")
      );
    }
  }, [selectedTab, allTickets]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteTicket(id);
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

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Support Tickets Management</span>{" "}
              <i class="fa-solid fa-headset"></i>
            </h2>
          </div>
          <div className="tab-container">
            <div
              className={`tab ${selectedTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              All
            </div>
            <div
              className={`tab ${selectedTab === "active" ? "active" : ""}`}
              onClick={() => handleTabChange("active")}
            >
              Active
            </div>
            <div
              className={`tab ${selectedTab === "closed" ? "active" : ""}`}
              onClick={() => handleTabChange("closed")}
            >
              Close
            </div>
          </div>

          <div className="row g-4 mb-3">
            {filteredTickets?.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table class="table-modify table table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Name</th>
                        <th>Ticket Create</th>
                        <th>Status</th>
                        <th className="description">Ticket Message</th>
                        <th className="action-area">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets?.map((ticket) => (
                        <tr key={ticket?._id}>
                          <td>
                            <img
                              className="employee-img"
                              src={ticket?.employeeImg}
                              alt="employee"
                            />
                          </td>
                          <td>{ticket?.employeeName}</td>
                          <td>{ticket?.date}</td>
                          <td>{ticket?.status}</td>
                          <td>{ticket?.message}</td>
                          <td>
                            <Link
                              to={`/dashboard/support-tickets/${ticket?._id}`}
                            >
                              <button className="update-btn bg-primary">
                                Reply
                              </button>
                            </Link>

                            <button
                              onClick={() =>
                                handleStatusChange(ticket?._id, ticket?.status)
                              }
                              className="update-btn bg-danger text-white"
                            >
                              {ticket?.status == "active"
                                ? "Close Ticket"
                                : "Active Ticket"}
                            </button>

                            <button
                              onClick={() => handleDelete(ticket?._id)}
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
              </>
            ) : (
              <>
                <h6>No Ticket Found</h6>
              </>
            )}
          </div>
          {/* <div className="create-ticket-wrapper">
            <Link className="add-new-event-btn" to={"/dashboard/create-ticket"}>
              Create Ticket <i class="fa-solid fa-chevron-right"></i>
            </Link>
          </div> */}
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default SupportTIcketManagement;
