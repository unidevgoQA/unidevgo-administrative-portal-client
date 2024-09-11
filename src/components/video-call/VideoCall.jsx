import React, { useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import "./video-call.scss";

const VideoCall = () => {
  const {
    localStream,
    remoteStream,
    endCall,
    toggleVideo,
    toggleAudio,
    isVideoEnabled,
    isAudioEnabled,
  } = useSocket();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

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

  return (
    <div className="video-call-container">
      <div className="stream-wrapper">
        <div className="video-wrapper">
          <div className="video-container">
            <video ref={remoteVideoRef} autoPlay className="remote-video" />
            <div>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="local-video"
              />
            </div>
          </div>
        </div>

        {/* Buttons to toggle video and audio */}
        <div className="audio-video-controller">
          <button onClick={toggleVideo}>
            {isVideoEnabled ? (
              <i class="fa-solid fa-video"></i>
            ) : (
              <i class="fa-solid fa-video-slash"></i>
            )}
          </button>
          <button onClick={toggleAudio}>
            {isAudioEnabled ? (
              <i class="fa-solid fa-microphone"></i>
            ) : (
              <i class="fa-solid fa-microphone-slash"></i>
            )}
          </button>
        </div>
        <button className="end-call" onClick={endCall}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
