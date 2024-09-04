import React from 'react';
import { useSocket } from '../../context/SocketContext';
import { useGetProfileByIdQuery } from "../../features/profile/profileApi";
import "./chat-header.scss";

const ChatHeader = ({ recipientId }) => {
  const { data: recipientData } = useGetProfileByIdQuery(recipientId);
  const recipient = recipientData?.data;
  const { callUser } = useSocket();

  const handleVideoCall = () => {
    if (callUser) {
      callUser(recipientId);
    } else {
      console.error("callUser function is not defined in SocketContext");
    }
  };

  return (
    <div className="chat-header">
      <div className="user text-white">
        <img src={recipient?.img} alt="recipient" />
        <h6>{recipient?.name}</h6>
      </div>
      <div className="audio-video-wrapper">
        <button>
          <i className="fa-solid fa-phone"></i>
        </button>
        <button onClick={handleVideoCall}>
          <i className="fa-solid fa-video"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
