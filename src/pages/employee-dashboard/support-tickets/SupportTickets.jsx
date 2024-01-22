import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import {
  useDeleteTicketMutation,
  useGetAllTicketsQuery,
  useUpdateTicketMutation,
} from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";
import "./support-tickets.scss";

const SupportTickets = () => {
  //User
  const { user } = useContext(AuthContext);
  const [deleteTicket, { isLoading, isSuccess }] = useDeleteTicketMutation();
  const [
    updateTicketStatus,
    { isLoading: updateTicketLoading, isSuccess: updateTicketSuccess },
  ] = useUpdateTicketMutation();
  //All tickets data
  const { data } = useGetAllTicketsQuery();
  //Set ticket data
  const allTickets = data?.data;

  const filterTickets = allTickets?.filter(
    (ticket) => ticket?.employeeEmail === user?.email
  );

  //handle Update
  const handleStatusChange = (id, ticketStatus) => {
    const updatedStatus = ticketStatus === "active" ? "close" : "active";
    const updateTicket = {
      status: updatedStatus,
    };
    console.log(updateTicket);
    updateTicketStatus({ id: id, data: updateTicket });
  };

  //handle Delete
  const handleDelete = (id) => {
    const deleteConfirm = window.confirm("Want to delete?");
    if (deleteConfirm) {
      deleteTicket(id);
    }
  };

  // Update effects
  useEffect(() => {
    if (updateTicketSuccess) {
      toast.success("Update Successfully", { id: "update-ticket" });
    }
    if (updateTicketLoading) {
      toast.loading("Loading", { id: "update-ticket" });
    }
  }, [updateTicketSuccess, updateTicketLoading]);

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
          <div className="heading d-flex justify-content-between">
            <h2>
              <span>Support Tickets</span> <i class="fa-solid fa-headset"></i>
            </h2>
            <div className="add-new-area">
              <Link className="add-btn" to={"/dashboard/create-ticket"}>
                <i class="fa-regular fa-square-plus"></i> Create Ticket
              </Link>
            </div>
          </div>

          <div className="row g-4 mb-3">
            {filterTickets?.length > 0 ? (
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
                      {filterTickets?.map((ticket) => (
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
                              <button className="update-btn bg-primary">Reply</button>
                            </Link>

                            <button
                              onClick={() =>
                                handleStatusChange(ticket?._id, ticket?.status)
                              }
                              className="update-btn text-white"
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
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default SupportTickets;
