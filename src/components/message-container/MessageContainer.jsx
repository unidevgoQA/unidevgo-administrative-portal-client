import { useContext, useEffect, useRef } from "react";
import { useGetMessagesQuery } from "../../features/chat/chatApi";
import { AuthContext } from "../../providers/AuthProviders";
import "./message-container.scss";

const formatTimestamp = (timestamp) => {
  const dateString =
    typeof timestamp === "string" ? timestamp : timestamp?.$date;
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
  const messageEndRef = useRef(null);

  const { data: allMessages } = useGetMessagesQuery(
    {
      senderId: user?.id,
      recipientId,
    },
    { pollingInterval: 2000 }
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

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
            <audio className="text" controls src={msg.fileUrl} />
            <span>{msg?.content}</span>
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
    <>
      <div className="message-container">
        {allMessages?.length > 0 ? (
          allMessages?.map((msg) => (
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
    </>
  );
};

export default MessageContainer;
