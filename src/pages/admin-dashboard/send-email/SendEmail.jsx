import React, { useState } from "react";
import toast from "react-hot-toast";
import GoBack from "../../../components/go-back/GoBack";
import "./send-email.scss";

const SendEmail = () => {
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = () => {
    fetch(`${import.meta.env.VITE_BASE_URL}send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipients, subject, message }),
    })
      .then((response) => response.json())
      .then(({ status }) => {
        if (status === true) {
          toast.success("Email sent successfully", { id: "send-email" });
          setRecipients([]);
          setSubject("");
          setMessage("");
        }
      })
      .catch(err => {
        console.error("Error sending email:", err);
        toast.error("Error sending email", { id: "send-email" });
      });
  };
  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Send Email</span> <i class="fa-regular fa-envelope"></i>
            </h2>
          </div>
          <div className="send-email-form">
            <div className="row">
              <div className="col-lg-6">
                <label>Recipients</label>
                <input
                  type="text"
                  required
                  placeholder="Recipients (comma-separated)"
                  onChange={(e) => setRecipients(e.target.value.split(","))}
                />
              </div>
              <div className="col-lg-6">
                <label>Subject</label>
                <input
                  required
                  type="text"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="col-lg-12">
                <label>Message</label>
                <textarea
                  required
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <button className="send-email-btn" onClick={sendEmail}>
              Send Email
            </button>
          </div>
        </div>
      </div>
      <GoBack />
    </div>
  );
};

export default SendEmail;
