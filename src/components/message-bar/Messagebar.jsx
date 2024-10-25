import React, { useContext, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AuthContext } from "../../providers/AuthProviders";
import "./message-bar.scss";
import "./modal.scss";

const MessageBar = ({ recipientId }) => {
  const { sendMessage } = useSocket();
  const { user } = useContext(AuthContext);
  const [messageText, setMessageText] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const message = {
        sender: user.id,
        senderName: user.name,
        recipient: recipientId,
        messageType: "text",
        content: messageText,
        timestamp: new Date(),
      };
      sendMessage(message);
      setMessageText("");
    } else if (filePreview) {
      // If a file is selected, send it
      handleSendFile();
    }
  };

  const handleSendFile = async () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const formData = new FormData();
      const message = {
        sender: user.id,
        senderName: user.name,
        recipient: recipientId,
        messageType: "file",
        content: file.name,
        timestamp: new Date(),
      };

      formData.append("file", file);
      formData.append("message", JSON.stringify(message));

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}chat/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const savedMessage = await response.json();
          sendMessage(savedMessage);
          setFilePreview(null); // Clear the preview after sending
          setFileType(null);
          setIsModalOpen(false); // Close the modal after sending
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      setFilePreview(URL.createObjectURL(file));
      setFileType(fileType);
      setIsModalOpen(true); // Open the modal when a file is selected
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    setFileType(null);
    setIsModalOpen(false); // Close the modal if the file is removed
    fileInputRef.current.value = null;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  const renderFilePreview = () => {
    const fileName = fileInputRef.current?.files[0]?.name; // Get the file name
  
    switch (fileType) {
      case "image":
        return <img src={filePreview} alt="Preview" />;
      case "video":
        return <video controls src={filePreview} />;
      case "audio":
        return (
          <div>
            <audio controls src={filePreview} />
            <p>{fileName}</p> {/* Display the audio file name */}
          </div>
        );
      case "application":
        if (filePreview.endsWith(".pdf")) {
          return (
            <embed
              src={filePreview}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          );
        } else {
          return (
            <div className="file-preview-document">
              <i className="fa-solid fa-file"></i>
              <span>{fileName}</span>
            </div>
          );
        }
      default:
        return (
          <div className="file-preview-document">
            <i className="fa-solid fa-file"></i>
            <span>{fileName}</span>
          </div>
        );
    }
  };

  return (
    <div className="messagebar-wrapper">
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown} // Add the onKeyDown handler
        placeholder="Type your message..."
      />

      <div className="button-wrapper">
        <button onClick={handleFileUploadClick}>
          <i className="fa-solid fa-paperclip"></i>
        </button>
        <button onClick={handleSendMessage}>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content text-white">
            <span className="close" onClick={handleRemoveFile}>
              <i class="fa-solid fa-trash-can"></i>
            </span>
            {renderFilePreview()}
            <button onClick={handleSendFile} className="send-button">
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBar;
