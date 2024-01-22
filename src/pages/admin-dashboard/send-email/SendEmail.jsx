import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GoBack from "../../../components/go-back/GoBack";
import { useGetProfilesQuery } from "../../../features/profile/profileApi";
import "./send-email.scss";

const SendEmail = () => {
  const navigate = useNavigate();

  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const { data } = useGetProfilesQuery();
  const allProfiles = data?.data;

  const allEmployees = allProfiles?.filter(
    (employee) => employee?.role === "employee"
  );

  const handleSelectAll = () => {
    const allEmails = allEmployees.map((employee) => employee.email);
    if (recipients?.length === allEmails?.length) {
      // If all are already selected, unselect all
      setRecipients([]);
    } else {
      // If not all are selected, select all
      setRecipients(allEmails);
    }
  };

  const handleCheckboxChange = (employeeEmail) => {
    if (recipients.includes(employeeEmail)) {
      setRecipients(recipients.filter((email) => email !== employeeEmail));
    } else {
      setRecipients([...recipients, employeeEmail]);
    }
  };

  //Files handler
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;

    if (files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`, {
        id: "email-attachments",
      });
      // Reset the file input
      event.target.value = "";
    } else {
      setAttachments(files);
    }
  };

  //Send email handler
  const sendEmail = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("recipients", recipients.join(","));
    formData.append("subject", subject);
    formData.append("message", message);

    if (attachments && Array.isArray(attachments)) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    fetch(`${import.meta.env.VITE_BASE_URL}send-email`, {
      method: "POST",
      headers: {},
      body: formData,
    })
      .then((response) => response.json())
      .then(({ status }) => {
        if (status === true) {
          toast.success("Email sent successfully", { id: "send-email" });
          setLoading(false);
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        toast.error("Error sending email", { id: "send-email" });
      });
  };
  //Send email effects
  useEffect(() => {
    if (loading === true) {
      toast.loading("Loading", { id: "send-email" });
    }
    if (loading === false) {
      setRecipients([]);
      setMessage("");
      setSubject("");
    }
  }, [loading, setLoading]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12">
          <div className="heading">
            <h2>
              <span>Send Email</span> <i class="fa-regular fa-envelope"></i>
            </h2>
          </div>
          <div className="row employees-wrapper">
            <div className="col-md-4">
              <label>
                <input
                  type="checkbox"
                  checked={recipients?.length === allEmployees?.length}
                  onChange={handleSelectAll}
                />
                Select All
              </label>
            </div>
            {allEmployees?.map((employee) => (
              <div key={employee.id} className="col-md-4 profile-item">
                <label>
                  <input
                    type="checkbox"
                    checked={recipients.includes(employee?.email)}
                    onChange={() => handleCheckboxChange(employee?.email)}
                  />
                  {employee?.name}
                </label>

                {/* <img src={employee?.img} alt="employee" /> */}
              </div>
            ))}
          </div>
          <div className="send-email-form">
            <div className="row">
              <div className="col-lg-12">
                <label>Recipients</label>
                <input
                  type="text"
                  required
                  value={recipients}
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
              <div className="col-lg-6">
                <label>Attachment</label>
                <input type="file" onChange={handleFileChange} multiple />
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
