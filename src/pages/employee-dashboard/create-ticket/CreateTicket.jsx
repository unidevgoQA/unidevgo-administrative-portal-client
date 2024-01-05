import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import GoBack from "../../../components/go-back/GoBack";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { useAddTicketMutation } from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";

const CreateTicket = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  //User
  const { user } = useContext(AuthContext);
  const [addTickets, { isSuccess, isLoading }] = useAddTicketMutation();
  //Get user using email API
  const { data } = useGetProfileByEmailQuery(user.email);
  //Set register user
  const registerUser = data?.data;
  //Current date
  let currentDate = new Date().toJSON().slice(0, 10);

  //Add work status handler
  const handleCreateTicket = ({ message }) => {
    const suportTicket = {
      //ticket data
      date: currentDate,
      time : new Date().toLocaleTimeString(),
      message,
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };
    if (message.trim().length === 0) {
      toast.error("Provide valid input", { id: "support-ticket" });
    } else {
      addTickets(suportTicket);
      reset();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Ticket Create Successfully", { id: "create-ticket" });
    }
    if (isLoading) {
      toast.loading("Loading", { id: "create-ticket" });
    }
  }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Create Ticket</span> <i class="fa-solid fa-headset"></i>
            </h2>
          </div>
          <div className="add-form send-message">
            <form onSubmit={handleSubmit(handleCreateTicket)}>
              <div className="chat-input-area">
                <div className="text-area">
                  <label>About Ticket</label>
                  <input
                    required
                    type="text"
                    {...register("message", {
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
                  <button className="submit-btn">Create Ticket</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <GoBack/>
    </div>
  );
};

export default CreateTicket;
