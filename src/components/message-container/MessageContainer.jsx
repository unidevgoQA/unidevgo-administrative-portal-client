import { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AuthContext } from "../../providers/AuthProviders";
import "./message-container.scss";

const formatTimestamp = (timestamp) => {
  const dateString = typeof timestamp === 'string' ? timestamp : timestamp?.$date;
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString(undefined, {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const MessageContainer = ({ recipientId }) => {
  const { user } = useContext(AuthContext);
  const { socket, messages: socketMessages } = useSocket();
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    async function loadMessages() {
      if (user?.id && recipientId) {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}chat/messages?sender=${user.id}&recipient=${recipientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const fetchedMessages = await response.json();
          setMessages(fetchedMessages);
        } else {
          console.error("Failed to fetch messages:", response.statusText);
        }
      }
    }

    loadMessages();
  }, [recipientId, user?.id]);


  //Getting realtime messages
  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (updatedMessages) => {
        setMessages(updatedMessages); // Replace the entire message list with the updated one
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket]);

  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageContent = (msg) => {
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl);
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
        );
      }
    } else {
      return <p>Unsupported message type</p>;
    }
  };

  return (
    <div className="message-container">
      {messages.length > 0 ? (
        messages.map((msg) => (
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
        <p className="text-white">No messages to display.</p>
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageContainer;
