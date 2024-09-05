import { createContext, useContext, useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { io } from "socket.io-client";
import { AuthContext } from "../providers/AuthProviders";

// Create a context for managing socket and peer connections
const SocketContext = createContext(null);

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const peer = useRef(null);

  console.log("Peeer",peer)
  console.log("Incoming Call",incomingCall)

  // console.log("localStream", localStream);
  // console.log("remoteStream", remoteStream);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id },
        withCredentials: true,
      });

      // Handle socket connection
      socket.current.on("connect", () => {
        console.log(`Connected with ID: ${socket.current.id}`);
        socket.current.emit("getConnectedUsers");
      });

      // Update online users
      socket.current.on("onlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      // Update connected users
      socket.current.on("connectedUsers", (users) => {
        setConnectedUsers(users);
      });

      // Handle received messages
      socket.current.on("receiveMessage", (updatedMessages) => {
        setMessages(updatedMessages);
      });

      // Update user status (online/offline)
      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      // Handle incoming call
      socket.current.on("receiveCall", ({ signal, from }) => {
        setIncomingCall({ signal, from });
      });

      // Handle accepted call
      socket.current.on("callAccepted", (signal) => {
        if (peer.current) {
          peer.current.signal(signal);
        }
      });

      // Clean up on socket disconnect
      socket.current.on("disconnect", () => {
        console.log("Disconnected from the socket server");
      });

      // Clean up socket connection on unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    // Get local webcam stream
    const getWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        setLocalStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getWebcam();
  }, []);

  // Initiate a call to a user
  const callUser = (recipientId) => {
    if (localStream) {
      console.log("Initializing peer...");
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: localStream,
      });

      peer.on("signal", (signal) => {
        console.log("Outgoing signal:", signal);
        socket.current.emit("callUser", {
          recipientId,
          signalData: signal,
          from: user.id,
        });
      });

      peer.on("connect", () => {
        console.log("Peer connection established");
      });

      peer.on("stream", (stream) => {
        console.log("Received remote stream:", stream);
        setRemoteStream(stream);
      });

      peer.on("error", (err) => {
        console.error("Peer error:", err);
      });

      peer.on("close", () => {
        console.log("Peer connection closed");
        setRemoteStream(null);
      });

      peer.current = peer; // Store the peer instance
    } else {
      console.error("Local stream is not available");
    }
  };

  // Answer an incoming call
  const answerCall = () => {
    if (incomingCall && localStream) {
      console.log('Answering call...');
  
      peer.current = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: localStream,
      });
  
      peer.current.on('signal', (signal) => {
        console.log('Answering with signal:', signal);
        socket.current.emit('answerCall', {
          to: incomingCall.from,
          signal,
        });
      });
  
      peer.current.on('connect', () => {
        console.log('Peer connection established (answering)');
      });
  
      peer.current.on('stream', (stream) => {
        console.log('Received remote stream after answering:', stream);
        setRemoteStream(stream);
      });
  
      peer.current.on('error', (err) => {
        console.error('Peer error:', err);
      });
  
      peer.current.on('close', () => {
        console.log('Peer connection closed');
        setRemoteStream(null);
      });
  
      // Signal the incoming call's signal to establish the connection
      peer.current.signal(incomingCall.signal);
      
      setIncomingCall(null); // Clear incoming call notification
    } else {
      console.error('Incoming call or local stream is not available');
    }
  };
  

  // End the current call
  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();
      setRemoteStream(null);
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
