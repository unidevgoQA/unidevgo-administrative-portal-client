import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
    useDeleteTicketMutation,
    useGetAllTicketsQuery,
} from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";

const SupportTIcketManagement = () => {
  //User
  const { user } = useContext(AuthContext);
  const [deleteTicket, { isLoading, isSuccess }] = useDeleteTicketMutation();
  //All tickets data
  const { data } = useGetAllTicketsQuery();
  //Set ticket data
  const allTickets = data?.data;

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
              <span>Support Tickets</span>{" "}
              <i class="fa-solid fa-clipboard-user"></i>
            </h2>
          </div>

          <div className="row g-4 mb-3">
            {allTickets?.length > 0 ? (
              <>
                {allTickets?.map((ticket) => (
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="ticket-wrapper">
                      <div className="left-content">
                        <img src={ticket?.employeeImg} alt="" />
                        <h6>{ticket?.employeeName}</h6>
                        <p>Ticket Message : {ticket?.message}</p>
                        <button
                          onClick={() => handleDelete(ticket?._id)}
                          className="delete-btn"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                      <div className="right-content">
                        <h6>Ticket Create</h6>
                        <span>{ticket?.date}</span>
                        <Link to={`/dashboard/support-tickets/${ticket?._id}`}>
                          <button>Reply</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default SupportTIcketManagement;
