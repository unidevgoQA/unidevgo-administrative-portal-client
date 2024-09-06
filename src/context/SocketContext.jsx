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


  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id },
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
          audio: true,
        });
        setLocalStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getWebcam();
  }, []);

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


  console.log("PEEEEEER",peer)

  const callUser = (recipientId) => {
    
    if (localStream && peer.current) {

      const call = peer.current.call(recipientId, localStream);

      call.on("stream", (stream) => {
        setRemoteStream(stream);
      });

      call.on("error", (err) => {
        console.error("Call error:", err);
      });

      setCallInProgress(true);
    }
  };

  const answerCall = () => {
    if (incomingCall && localStream) {
      incomingCall.answer(localStream);

      incomingCall.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      setIncomingCall(null);
      setCallInProgress(true);

    }
  };

  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();
      setRemoteStream(null);
      setCallInProgress(false);
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
