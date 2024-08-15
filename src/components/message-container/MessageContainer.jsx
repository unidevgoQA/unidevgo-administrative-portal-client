import { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AuthContext } from "../../providers/AuthProviders";
import "./message-container.scss";

// Function to format the timestamp without seconds
const formatTimestamp = (timestamp) => {
  const dateString = typeof timestamp === 'string' ? timestamp : timestamp?.$date;
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
  }
  
  // Format the date as 'MM/DD/YYYY, HH:MM AM/PM'
  return date.toLocaleString(undefined, {
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

const MessageContainer = ({ recipientId }) => {
  const { user } = useContext(AuthContext);
  const { messages: socketMessages } = useSocket();
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null); // Reference to the end of the message list

  async function fetchMessages(senderId, recipientId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}chat/messages?sender=${senderId}&recipient=${recipientId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const messages = await response.json();
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  useEffect(() => {
    async function loadMessages() {
      if (user?.id && recipientId) {
        const fetchedMessages = await fetchMessages(user.id, recipientId);
        setMessages(fetchedMessages);
      }
    }

    loadMessages();
  }, [recipientId, user?.id]);

  // Combine initial fetched messages with real-time socket messages
  const allMessages = [...messages, ...socketMessages];

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const renderMessageContent = (msg) => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(msg.fileUrl);
    const isAudio = /\.(mp3|wav|ogg)$/i.test(msg.fileUrl);
    const isVideo = /\.(mp4|avi|mov|mkv)$/i.test(msg.fileUrl);

    if (msg.messageType === "text") {
      return <p>{msg.content}</p>;
    } else if (msg.messageType === "file") {
      if (isImage) {
        return (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            <img src={msg.fileUrl} alt={msg.content} />
          </a>
        );
      } else if (isAudio) {
        return (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            <audio controls src={msg.fileUrl} />
          </a>
        );
      } else if (isVideo) {
        return (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            <video controls src={msg.fileUrl} />
          </a>
        );
      } else {
        return (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            {msg.content}
          </a>
        ); // Fallback for other file types
      }
    } else {
      return <p>Unsupported message type</p>;
    }
  };

  return (
    <div className="message-container">
      {allMessages.length > 0 ? (
        allMessages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${
              msg.sender === user?.id ? "sent" : "received"
            }`}
          >
            {renderMessageContent(msg)}
            <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
          </div>
        ))
      ) : (
        <p>No messages to display.</p>
      )}
      <div ref={messageEndRef} /> {/* Dummy div to scroll into view */}
    </div>
  );
};

export default MessageContainer;
