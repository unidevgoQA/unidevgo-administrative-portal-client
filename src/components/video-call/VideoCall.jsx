import React, { useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import "./video-call.scss";

const VideoCall = () => {
  const { localStream, remoteStream, endCall } = useSocket();

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();


  console.log("localVideoRef",localVideoRef)
  console.log("remoteVideoRef",remoteVideoRef)

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
        <button onClick={endCall}>
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
