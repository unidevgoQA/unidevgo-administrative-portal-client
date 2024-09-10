import React, { useEffect, useState } from "react";
import VideoCall from "../../../components/video-call/VideoCall";
import { useSocket } from "../../../context/SocketContext";
import ChatContainer from "../chat-container/ChatContainer";
import ContactsContainer from "../contacts-container/ContactsContainer";
import EmptyChatContainer from "../empty-chat-container/EmptyChatContainer";
import "./chat.scss";

const Chat = () => {
  // State to hold the selected user ID
  const [recipientId, setRecipientId] = useState(null);
  const {
    remoteStream,
    incomingCall,
    answerCall,
    endCall,
    reloadWindow,
    callerName,
    callSound
  } = useSocket();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);



  useEffect(() => {
    if (incomingCall) {
      setIsCallModalOpen(true);
      if (remoteStream === null) {
        callSound.play().catch((error) => {
          console.error("Failed to play sound:", error);
        });
      }
    }
  }, [incomingCall,remoteStream]);

  const handleAnswerCall = () => {
    answerCall();
    setIsCallModalOpen(false);
  };

  const handleDeclineCall = () => {
    endCall();
    setIsCallModalOpen(false);
  };

  useEffect(() => {
    if (reloadWindow === true) {
      window.location.reload();
    }
  }, [reloadWindow]);

  return (
    <div className="chat-wrapper">
      {isCallModalOpen && incomingCall && (
        <div className="call-notification">
          <h6 className="text-white">
            <span>{callerName}</span> Calling
          </h6>
          <div>
            <button onClick={handleAnswerCall}>
              {" "}
              <i class="fa-solid fa-check"></i>
            </button>
            <button className="reject-btn" onClick={handleDeclineCall}>
              {" "}
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}
      <ContactsContainer setRecipientId={setRecipientId} />
      {remoteStream !== null ? (
        <VideoCall />
      ) : recipientId ? (
        <ChatContainer recipientId={recipientId} />
      ) : (
        <EmptyChatContainer />
      )}
    </div>
  );
};

export default Chat;
