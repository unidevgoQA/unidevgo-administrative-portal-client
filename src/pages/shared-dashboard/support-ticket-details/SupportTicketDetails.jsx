import React, { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import {
  useGetSingleTicketsQuery,
  useReplyTicketMutation,
} from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";
import "./support-ticket-details.scss";

const SupportTicketDetails = () => {
  //Get id
  const { id } = useParams();
  const { data: ticket } = useGetSingleTicketsQuery(id, {
    pollingInterval: 3000,
  });
  const [sendReply] = useReplyTicketMutation();
  const ticketDetails = ticket?.data;

  console.log(ticketDetails)


  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  //User
  const { user } = useContext(AuthContext);
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;
  //Current date
  let currentDate = new Date().toJSON().slice(0, 10);

  //Add work status handler
  const handleReply = ({ reply }) => {
    const suportTicket = {
      //ticket data
      date: currentDate,
      time: new Date().toLocaleTimeString(),
      parentId: ticketDetails?._id,
      reply,
      // attachment: attachment[0],
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };
    if (reply.trim().length === 0) {
      toast.error("Provide valid input", { id: "reply-support-ticket" });
    } else {
      sendReply(suportTicket);
      reset();
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Support Ticket Chat</span>{" "}
              <i class="fa-regular fa-comments"></i>
            </h2>
          </div>
          <div className="message-area mb-3 p-3">
            <div className="text-wrapper">
              <div className="left-content">
                <img src={ticketDetails?.employeeImg} alt="" />
              </div>
              <div className="right-content">
                <div className="name-message">
                  {" "}
                  <h6>{ticketDetails?.employeeName}</h6>
                  <p>{ticketDetails?.message}</p>
                </div>
                <div className="date-time">
                  <p>
                    {ticketDetails?.date} - {ticketDetails?.time}
                  </p>
                </div>
              </div>
            </div>
            {ticketDetails?.replies.map((chat, index) => {
              const lastMessage = ticketDetails?.replies.length - 1 === index;
              return (
                <div
                  className="text-wrapper"
                  key={chat._id}
                  ref={lastMessage ? setRef : null}
                >
                  <div className="left-content">
                    <img src={chat?.employeeImg} alt="" />
                  </div>
                  <div className="right-content">
                    <div className="name-message">
                      {" "}
                      <h6>{chat?.employeeName}</h6>
                      <p>{chat.reply}</p>
                    </div>
                    <div className="date-time">
                      <p>
                        {chat?.date} | {chat?.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleReply)}>
              <div className="chat-input">
                <div className="text-area">
                  <input
                    required
                    type="text"
                    placeholder="Your Reply"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent default behavior (form submission)
                        handleSubmit(handleReply)();
                      }
                    }}
                    {...register("reply", {
                      required: true,
                    })}
                  />
                </div>
                {/* <div className="attach-file-area">
                  <input
                    {...register("attachment")}
                    className="file"
                    type="file"
                  />
                </div> */}
                <div className="submit-area d-flex align-items-center justify-content-between">
                  <GoBack />
                  <button type="submit" className="send-message-btn">
                    <i class="fa-regular fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetails;
