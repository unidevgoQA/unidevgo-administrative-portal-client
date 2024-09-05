import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import './video-call.scss'; // Import the CSS file

const VideoCall = () => {
  const {
    localStream,
    remoteStream,
    answerCall,
    endCall,
    incomingCall,
  } = useSocket();
  


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

  const handleEndCall = () => {
    endCall();
    setIsCallModalOpen(false);
  };

  // console.log(remoteStream,localStream)

  return (
    <div className="video-call-container">
      {isCallModalOpen && incomingCall && (
        <div className="call-notification">
          <h2>Incoming Call</h2>
          <p>From: {incomingCall.from}</p>
          <button onClick={handleAnswerCall}>Accept Call</button>
          <button onClick={handleEndCall}>Decline Call</button>
        </div>
      )}

      <div className="video-wrapper">
        <div className="video-container">
          <h5>My Video</h5>
          <video ref={localVideoRef} autoPlay muted className="local-video" />
        </div>
        <div className="video-container">
          <h5>Partner's Video</h5>
          <video ref={remoteVideoRef} autoPlay className="remote-video" />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
