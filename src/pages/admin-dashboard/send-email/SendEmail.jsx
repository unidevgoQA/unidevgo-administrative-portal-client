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

  const handleSubjectChange = (e) => {
    const inputValue = e.target.value;
    // Check if the input exceeds 60 characters
    if (inputValue.length > 80) {
      // Display an alert or handle it in your preferred way
      toast.error("Subject should not exceed 80 characters", {
        id: "send-email-subject",
      });
    } else {
      // Update the state if within the limit
      setSubject(inputValue);
    }
  };

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

  // Set the maximum file size limit (15 MB)
  const maxFileSizeInBytes = 15 * 1024 * 1024; // 15 MB in bytes

  // Files handler
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 5;

    // Calculate the total size of all selected files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    // Check if the total size exceeds the limit
    if (totalSize > maxFileSizeInBytes) {
      toast.error("Total file size should not exceed 15 MB.", {
        id: "file-size-error",
      });

      // Reset the file input
      event.target.value = "";
    } else if (files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files.`, {
        id: "file-count-error",
      });

      // Reset the file input
      event.target.value = "";
    } else {
      setAttachments(files);
    }
  };
  const sendEmail = () => {
    setLoading(true);

    // Validate entered email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const areAllValidEmails = recipients.every((email) =>
      emailRegex.test(email.trim())
    );

    // Check if subject, message, and recipients are empty
    if (
      subject.trim() === "" ||
      message.trim() === "" ||
      recipients.length === 0
    ) {
      toast.error("Please fill in all required fields.", {
        id: "empty-fields",
      });
      setLoading(false);
      return;
    }

    // Check if all entered emails are valid
    if (!areAllValidEmails) {
      toast.error("Please enter valid email addresses (comma-separated).", {
        id: "invalid-emails",
      });
      setLoading(false);
      return;
    }

    // Continue with the email sending logic
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

  const isButtonDisabled = () => {
    // Add any additional conditions as needed
    return (
      recipients.length === 0 || subject.trim() === "" || message.trim() === ""
    );
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
                  value={subject}
                  onChange={handleSubjectChange}
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
            <button
             className='send-email-btn'
              onClick={sendEmail}
              disabled={isButtonDisabled()}
            >
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
