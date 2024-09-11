import Peer from "peerjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../providers/AuthProviders";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const peer = useRef(null);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callerName, setCallerName] = useState(null);
  const [reloadWindow, setReloadWindow] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Sound for incoming call
  const callSound = new Audio("/public/calling-audio.mp3");

  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id, userName: user?.name },
        withCredentials: true,
      });

      socket.current.on("connect", () => {
        console.log(`Connected with ID: ${socket.current.id}`);
        socket.current.emit("getConnectedUsers");
      });

      socket.current.on("onlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      socket.current.on("connectedUsers", (users) => {
        setConnectedUsers(users);
      });

      socket.current.on("receiveMessage", (updatedMessages) => {
        setMessages(updatedMessages);
      });

      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      socket.current.on("caller", ({ from }) => {
        // Set the incoming call state and the caller's name
        setCallerName(from);
      });

      socket.current.on("callEnded", ({ userId }) => {
        console.log(`Call ended by user with ID: ${userId}`);
        setRemoteStream(null);
        setReloadWindow(true);
      });

      socket.current.on("callAccepted", (signal) => {
        if (peer.current) {
          peer.current.signal(signal); // Send signal to peer
        }
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from the socket server");
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    const getWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true, // Only audio enabled at the start
        });

        // Disable video track initially
        mediaStream.getVideoTracks().forEach((track) => {
          track.enabled = false; // Video is off by default
        });

        setLocalStream(mediaStream);
        setIsVideoEnabled(false); // Set initial video state to false
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getWebcam();
  }, []);

  // Function to toggle video on/off
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Function to toggle audio on/off
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled((prev) => !prev);
    }
  };

  useEffect(() => {
    if (user && localStream) {
      peer.current = new Peer(user.id, {
        host: import.meta.env.VITE_PEER_HOST,
        port: import.meta.env.VITE_PEER_PORT || 9000,
        path: "/",
        secure: false,
      });

      peer.current.on("open", (id) => {
        console.log(`PeerJS connection opened with ID: ${id}`);
      });

      peer.current.on("call", (call) => {
        // Save the call, but don't automatically answer
        setIncomingCall(call);
      });

      peer.current.on("error", (err) => {
        console.error("PeerJS error:", err);
      });

      return () => {
        if (peer.current) {
          peer.current.destroy();
        }
      };
    }
  }, [user, localStream]);

  const callUser = (recipientId) => {
    if (localStream && peer.current) {
      console.log("Initializing call...");
      
      const call = peer.current.call(recipientId, localStream);
  
      call.on("stream", (stream) => {
        setRemoteStream(stream);
      });
  
      call.on("error", (err) => {
        console.error("Call error:", err);
      });
  
      setCallInProgress(true);
  
      // Emit callUser event to the backend
      socket.current.emit("callUser", {
        userToCall: recipientId,
        from: user?.name,
      });
    }
  };
  

  const answerCall = () => {
    if (incomingCall && localStream) {
      incomingCall.answer(localStream); // Answer with the media stream
  
      incomingCall.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
  
      setIncomingCall(null);
      setCallInProgress(true);
      callSound.pause();
      socket.current.emit("answerCall", {
        to: incomingCall.from,
        signal: peer.current.signal, // SDP answer/ICE candidates
      });
    }
  };
  

  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();
      setRemoteStream(null);
      setCallInProgress(false);
      callSound.pause();
      socket.current.emit("endCall", { userId: user.id });
    }
  };
  // Send a message (or file) to the server
  const sendMessage = (message, isFile = false) => {
    if (isFile) {
      fetch(`${import.meta.env.VITE_BASE_URL}/chat/upload`, {
        method: "POST",
        body: message,
      })
        .then((response) => response.json())
        .then((data) => {
          socket.current.emit("sendMessage", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      socket.current.emit("sendMessage", message);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        messages,
        sendMessage,
        onlineUsers,
        connectedUsers,
        localStream,
        remoteStream,
        callUser,
        answerCall,
        endCall,
        incomingCall,
        callInProgress,
        callerName,
        reloadWindow,
        callSound,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
