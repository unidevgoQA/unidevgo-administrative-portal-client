import React, { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { AuthContext } from "../../providers/AuthProviders";
import "./video-call.scss";

const VideoCall = () => {
  const {
    localStream,
    remoteStream,
    answerCall,
    declineCall,
    endCall,
    incomingCall,
  } = useSocket();

  const { user } = useContext(AuthContext);

  console.log(remoteStream);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (incomingCall) {
      setIsCallModalOpen(true);
    }
  }, [incomingCall]);

  const handleAnswerCall = () => {
    answerCall();
    setIsCallModalOpen(false);
  };

  const handleDeclineCall = () => {
    declineCall();
    setIsCallModalOpen(false);
  };

  return (
    <div className="video-call-container">
      {isCallModalOpen && incomingCall && (
        <div className="call-notification">
          <h2>Incoming Call</h2>
          <button onClick={handleAnswerCall}>Accept Call</button>
          <button onClick={handleDeclineCall}>Decline Call</button>
        </div>
      )}

      <div className="stream-wrapper">
        <div className="video-wrapper">
          <div className="video-container">
            <h6>My Video</h6>
            <video ref={localVideoRef} autoPlay muted className="local-video" />
          </div>
          <div className="video-container">
            <h5>Partner's Video</h5>
            <video ref={remoteVideoRef} autoPlay className="remote-video" />
          </div>
        </div>
        {remoteStream && <button onClick={endCall}>End</button>}
      </div>
    </div>
  );
};

export default VideoCall;
