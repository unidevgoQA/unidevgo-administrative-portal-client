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
    callSound,
    isCalling,
  } = useSocket();

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [userToCall, setUserToCall] = useState("");

  // Fetch recipient profile data when recipientId changes
  useEffect(() => {
    if (recipientId) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}profile/${recipientId}`
          ); // Replace with your actual API endpoint
          const data = await response.json();
          setUserToCall(data?.data?.name);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUserToCall("Unknown");
        }
      };

      fetchProfile();
    }
  }, [recipientId]);

  useEffect(() => {
    if (incomingCall) {
      setIsCallModalOpen(true);
      if (remoteStream === null) {
        callSound.play().catch((error) => {
          console.error("Failed to play sound:", error);
        });
      }
    }
  }, [incomingCall, remoteStream]);

  const handleAnswerCall = () => {
    callSound.pause();  // Stop the call sound when answering the call
    callSound.currentTime = 0;  // Reset the sound playback position
    answerCall();
    setIsCallModalOpen(false);
  };

  const handleDeclineCall = () => {
    callSound.pause();  // Stop the sound in case of decline
    callSound.currentTime = 0;  // Reset the sound
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
      {isCalling === true && remoteStream === null ? (
        <div className="call-notification">
          <h6 className="text-white">
            Calling <span>{userToCall}</span>
          </h6>
          <div>
            <button className="reject-btn" onClick={handleDeclineCall}>
              {" "}
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {remoteStream !== null ? (
        <VideoCall />
      ) : (
        <>
          <ContactsContainer setRecipientId={setRecipientId} />
          {recipientId ? (
            <ChatContainer recipientId={recipientId} />
          ) : (
            <EmptyChatContainer />
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
