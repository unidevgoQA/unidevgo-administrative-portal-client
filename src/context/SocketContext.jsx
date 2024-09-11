import Peer from "peerjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../providers/AuthProviders";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Refs for socket and peer connections
  const socket = useRef(null);
  const peer = useRef(null);
  
  // Get the current user from AuthContext
  const { user } = useContext(AuthContext);

  // State variables to manage messages, users, streams, and call status
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callerName, setCallerName] = useState(null);
  const [reloadWindow, setReloadWindow] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);  // Track video state
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);  // Track audio state

  // Sound for incoming call
  const callSound = new Audio("/public/calling-audio.mp3");

  // Setup socket connection when user is available
  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id, userName: user?.name },
        withCredentials: true,
      });

      // Handle socket events
      socket.current.on("connect", () => {
        console.log(`Connected with ID: ${socket.current.id}`);
        socket.current.emit("getConnectedUsers");
      });

      socket.current.on("onlineUsers", (onlineUsers) => setOnlineUsers(onlineUsers));

      socket.current.on("connectedUsers", (users) => setConnectedUsers(users));

      socket.current.on("receiveMessage", (updatedMessages) => setMessages(updatedMessages));

      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      socket.current.on("caller", ({ from }) => setCallerName(from));  // Set caller name

      socket.current.on("callEnded", ({ userId }) => {
        console.log(`Call ended by user with ID: ${userId}`);
        setRemoteStream(null);
        setReloadWindow(true);  // Trigger window reload on call end
      });

      socket.current.on("callAccepted", (signal) => {
        if (peer.current) peer.current.signal(signal);  // Pass signal to peer
      });

      socket.current.on("disconnect", () => console.log("Disconnected from the socket server"));

      return () => socket.current.disconnect();
    }
  }, [user]);

  // Get user media stream (audio enabled, video off by default)
  useEffect(() => {
    const getWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },  // Video will be disabled initially
          audio: true,  // Audio enabled
        });

        // Disable video track initially
        mediaStream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });

        setLocalStream(mediaStream);
        setIsVideoEnabled(false);  // Set video state to false
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getWebcam();
  }, []);

  // Toggle video on/off
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;  // Toggle video track
      });
      setIsVideoEnabled((prev) => !prev);  // Update video state
    }
  };

  // Toggle audio on/off
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;  // Toggle audio track
      });
      setIsAudioEnabled((prev) => !prev);  // Update audio state
    }
  };

  // Initialize PeerJS when the user and local stream are available
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

      peer.current.on("call", (call) => setIncomingCall(call));  // Handle incoming calls

      peer.current.on("error", (err) => console.error("PeerJS error:", err));

      return () => peer.current && peer.current.destroy();  // Cleanup PeerJS on unmount
    }
  }, [user, localStream]);

  // Function to initiate a call
  const callUser = (recipientId) => {
    if (localStream && peer.current) {
      console.log("Initializing call...");
      
      const call = peer.current.call(recipientId, localStream);  // Start call with recipient
  
      call.on("stream", (stream) => setRemoteStream(stream));  // Set remote stream
  
      call.on("error", (err) => console.error("Call error:", err));
  
      setCallInProgress(true);  // Set call in progress state
  
      // Emit callUser event to the backend
      socket.current.emit("callUser", {
        userToCall: recipientId,
        from: user?.name,
      });
    }
  };
  
  // Function to answer an incoming call
  const answerCall = () => {
    if (incomingCall && localStream) {
      incomingCall.answer(localStream);  // Answer call with local stream
  
      incomingCall.on("stream", (remoteStream) => setRemoteStream(remoteStream));  // Set remote stream
  
      setIncomingCall(null);
      setCallInProgress(true);
      callSound.pause();  // Stop the ringing sound
  
      // Emit answerCall event to the backend
      socket.current.emit("answerCall", {
        to: incomingCall.from,
        signal: peer.current.signal,  // Send SDP answer/ICE candidates
      });
    }
  };
  
  // Function to end a call
  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();  // Destroy the peer connection
      setRemoteStream(null);  // Clear remote stream
      setCallInProgress(false);  // Reset call status
      callSound.pause();  // Stop any ongoing call sound
      socket.current.emit("endCall", { userId: user.id });  // Notify the backend
    }
  };

  // Function to send a message or file to the server
  const sendMessage = (message, isFile = false) => {
    if (isFile) {
      // Upload file to the server
      fetch(`${import.meta.env.VITE_BASE_URL}/chat/upload`, {
        method: "POST",
        body: message,
      })
        .then((response) => response.json())
        .then((data) => {
          socket.current.emit("sendMessage", data);  // Emit sendMessage event after upload
        })
        .catch((error) => console.error("Error uploading file:", error));
    } else {
      socket.current.emit("sendMessage", message);  // Emit sendMessage event
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
