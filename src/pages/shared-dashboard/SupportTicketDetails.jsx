import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useGetProfileByEmailQuery } from "../../features/profile/profileApi";
import {
  useGetSingleTicketsQuery,
  useReplyTicketMutation,
} from "../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../providers/AuthProviders";
import './support-ticket-details.scss';

const SupportTicketDetails = () => {
  //Get id
  const { id } = useParams();
  const { data: ticket } = useGetSingleTicketsQuery(id,{pollingInterval:3000});
  const [sendReply] = useReplyTicketMutation();
  const ticketDetails = ticket?.data;

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
      parentId: ticketDetails?._id,
      reply,
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
              <span>{ticketDetails?.message}</span>{" "}
              <i class="fa-solid fa-headset"></i>
            </h2>
          </div>
          <div className="message-area mb-3 p-3">
            {ticketDetails?.replies.map((text) => (
              <div className="text-wrapper">
                <div className="left-content">
                  <img src={text?.employeeImg} alt="" />
                </div>
                <div className="right-content">
                  <h6>{text?.employeeName}</h6>
                  <p>{text.reply}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="add-form send-message">
            <form onSubmit={handleSubmit(handleReply)}>
              <div className="chat-input-area">
                <div className="text-area">
                  <input
                    required
                    type="text"
                    placeholder="Your Message"
                    {...register("reply", {
                      required: true,
                    })}
                  />
                </div>

                {/* <div className="attach-file-area">
                  <input
                    {...register("attachment")}
                    className="file"
                    placeholder="Attach FIle?"
                    type="file"
                    required
                  />
                </div> */}

                <div className="submit-area">
                  <button className="submit-btn">
                    <i class="fa-solid fa-angle-right"></i>
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
