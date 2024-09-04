import React, { useState } from "react";
import ChatHeader from "../chat-header/ChatHeader";
import VideoCall from "../video-call/VideoCall";

const ChatPage = ({ recipientId }) => {
  const [inCall, setInCall] = useState(false);
  const [callData, setCallData] = useState(null);

  const startCall = (callData) => {
    setInCall(true);
    setCallData(callData);
  };

  const closeCall = () => {
    setInCall(false);
    setCallData(null);
  };

  return (
    <div>
      <ChatHeader recipientId={recipientId} startCall={startCall} />
      {inCall && (
        <VideoCall
          recipientId={recipientId}
          closeCall={closeCall}
          callData={callData}
        />
      )}
    </div>
  );
};

export default ChatPage;
