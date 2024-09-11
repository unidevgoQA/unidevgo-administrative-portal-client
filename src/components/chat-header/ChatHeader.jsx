import React from "react";
import { useSocket } from "../../context/SocketContext";
import { useGetProfileByIdQuery } from "../../features/profile/profileApi";
import "./chat-header.scss";

const ChatHeader = ({ recipientId }) => {
  const { data: recipientData } = useGetProfileByIdQuery(recipientId);
  const recipient = recipientData?.data;
  const { callUser } = useSocket();

  const handleCallClick = () => {
    callUser(recipientId);
  };

  return (
    <div className="chat-header">
      <div className="user text-white">
        <img src={recipient?.img} alt="recipient" />
        <h6>{recipient?.name}</h6>
      </div>
      <div className="audio-video-wrapper">
        <button title="Start Huddle" onClick={handleCallClick}>
          <i class="fa-solid fa-headphones-simple"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
