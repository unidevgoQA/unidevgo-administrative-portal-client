import React, { useContext, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AuthContext } from "../../providers/AuthProviders";
import "./message-bar.scss";

const MessageBar = ({ recipientId }) => {
  const { sendMessage } = useSocket();
  const { user } = useContext(AuthContext);
  const [messageText, setMessageText] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      const message = {
        sender: user.id,
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
        recipient: recipientId,
        messageType: "file",
        content: file.name,
        timestamp: new Date(),
      };

      formData.append("file", file);
      formData.append("message", JSON.stringify(message));

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}chat/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const savedMessage = await response.json();
          console.log(savedMessage)
          sendMessage(savedMessage);
          setFilePreview(null); // Clear the preview after sending
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
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFilePreview(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className="messagebar-wrapper">
      {filePreview && (
        <div className="file-preview">
          <img width={"20px"} src={filePreview} alt="Preview" />
          <button onClick={handleRemoveFile}>Remove</button>
        </div>
      )}
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        placeholder="Type your message..."
      />

      <div className="button-wrapper">
        {/* <button>
          <i className="fa-regular fa-face-smile"></i>
        </button> */}
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
    </div>
  );
};

export default MessageBar;
