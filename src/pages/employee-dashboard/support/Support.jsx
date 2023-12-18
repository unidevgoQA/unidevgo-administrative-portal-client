import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useGetProfileByEmailQuery } from "../../../features/profile/profileApi";
import { useAddTicketMutation } from "../../../features/support-ticket/SupportTicket";
import { AuthContext } from "../../../providers/AuthProviders";

const LeaveApply = () => {
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
  const handleSendSupport = ({ message, attachment }) => {
    const suportTicket = {
      //ticket data
      date: currentDate,
      message,
      attachment: attachment[0],
      //user info
      employeeEmail: registerUser?.email,
      employeeImg: registerUser?.img,
      employeeName: registerUser?.name,
    };
    if (message.trim().length === 0) {
      toast.error("Provide valid input", { id: "support-ticket" });
    } else {
      addTickets(suportTicket);
      //   reset();
    }
  };

  //   useEffect(() => {
  //     if (isSuccess) {
  //       toast.success("Added Successfully", { id: "add-work-task" });
  //     }
  //     if (isLoading) {
  //       toast.loading("Loading", { id: "add-work-task" });
  //     }
  //   }, [isSuccess, isLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Support</span> <i class="fa-solid fa-headset"></i>
            </h2>
          </div>
          <div className="add-form">
            <form onSubmit={handleSubmit(handleSendSupport)}>
              <div className="row">
                <div className="col-md-12">
                  <label>Message</label>
                  <input
                    required
                    type="text"
                    {...register("message", {
                      required: true,
                    })}
                  />
                </div>

                <div className="col-md-6">
                  <label>Attach file</label>
                  <input
                    {...register("attachment")}
                    className="file"
                    type="file"
                    required
                  />
                </div>

                <div className="col-md-12">
                  <button className="submit-btn">Send Message</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApply;
