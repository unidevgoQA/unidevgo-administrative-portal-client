import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useGetAllTicketsQuery } from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";
import "./support-tickets.scss";

const SupportTickets = () => {
  //User
  const { user } = useContext(AuthContext);
  //All tickets data
  const { data } = useGetAllTicketsQuery();
  //Set ticket data
  const allTickets = data?.data;
  

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
          <div className="create-ticket-wrapper">
            <Link className="add-new-event-btn" to={"/dashboard/create-ticket"}>
              Create Ticket <i class="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
