import Peer from "peerjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../providers/AuthProviders";

// Create a context for managing socket and peer connections
const SocketContext = createContext(null);

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  // Refs for socket and peer connections
  const socket = useRef(null);
  const peer = useRef(null);

  // Access user from AuthContext
  const { user } = useContext(AuthContext);

  // State variables
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
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
  const [isCalling, setIsCalling] = useState(false);
   


  // Audio files for call and message notifications
  const callSound = new Audio("/calling-audio.mp3");
  const messageTone = new Audio("/message-tone.mp3");

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  }, []);

  // Setup socket and peer connections when user is present
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

      socket.current.on("onlineUsers", (onlineUsers) =>
        setOnlineUsers(onlineUsers)
      );

      socket.current.on("connectedUsers", (users) => setConnectedUsers(users));

      socket.current.on("receiveMessage", (updatedMessages) => {
        setMessages(updatedMessages);

        console.log("update message from socket context",updatedMessages)

        const latestMessage = updatedMessages[updatedMessages.length - 1];

        if (latestMessage.sender !== user?.id) {
          messageTone
            .play()
            .catch((error) =>
              console.error("Failed to play message tone:", error)
            );

          if (Notification.permission === "granted") {
            new Notification("New Message", {
              body: `${latestMessage.senderName}: ${latestMessage.content}`,
            });
          }

          setUnreadMessages((prev) => ({
            ...prev,
            [latestMessage.sender]: (prev[latestMessage.sender] || 0) + 1,
          }));
        }
      });

      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      socket.current.on("caller", ({ from }) => {
        setCallerName(from);
        if (Notification.permission === "granted") {
          new Notification("Incoming Call", {
            body: `${from} is calling you.`,
          });
        }
      });

      socket.current.on("callEnded", ({ userId }) => {
        console.log(`Call ended by user with ID: ${userId}`);
        setRemoteStream(null);
        setIsCalling(false);
        setReloadWindow(true);
      });

      socket.current.on("callAccepted", (signal) => {
        if (peer.current) {
          peer.current.signal(signal);
        }
      });

      socket.current.on("disconnect", () =>
        console.log("Disconnected from the socket server")
      );

      return () => socket.current.disconnect();
    }
  }, [user]);

  // Access webcam and set local stream on component mount
  useEffect(() => {
    const getWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        mediaStream.getVideoTracks().forEach((track) => {
          track.enabled = false; // Start with video off
        });

        setLocalStream(mediaStream);
        setIsVideoEnabled(false);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };
    getWebcam();
  }, []);

  // Toggle video stream
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio stream
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // Initialize PeerJS and handle peer events
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

      peer.current.on("call", (call) => setIncomingCall(call));

      peer.current.on("error", (err) => console.error("PeerJS error:", err));

      return () => peer.current && peer.current.destroy();
    }
  }, [user, localStream]);

  // Initiate a call to a user
  const callUser = (recipientId) => {
    if (localStream && peer.current) {
      console.log("Initializing call...");

      const call = peer.current.call(recipientId, localStream);

      call.on("stream", (stream) => setRemoteStream(stream));

      call.on("error", (err) => console.error("Call error:", err));

      setCallInProgress(true);
      setIsCalling(true);

      socket.current.emit("callUser", {
        userToCall: recipientId,
        from: user?.name,
      });
    }
  };

  // Answer an incoming call
  const answerCall = () => {
    if (incomingCall && localStream) {
      incomingCall.answer(localStream);

      incomingCall.on("stream", (remoteStream) =>
        setRemoteStream(remoteStream)
      );

      setIncomingCall(null);
      setCallInProgress(true);
      callSound.pause();

      socket.current.emit("answerCall", {
        to: incomingCall.from,
        signal: peer.current.signal,
      });
    }
  };

  // End an ongoing call
  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();
      setRemoteStream(null);
      setCallInProgress(false);
      callSound.pause();
      socket.current.emit("endCall", { userId: user.id });
    }
  };

  // Send a message or file
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
        .catch((error) => console.error("Error uploading file:", error));
    } else {
      socket.current.emit("sendMessage", message);
    }
  };

  // Mark messages as read for a specific contact
  const markMessagesAsRead = (contactId) => {
    setUnreadMessages((prev) => {
      const updatedMessages = { ...prev, [contactId]: 0 };
      return updatedMessages;
    });
  };

  // Provide the context values to children components
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
        messageTone,
        toggleVideo,
        toggleAudio,
        isVideoEnabled,
        isAudioEnabled,
        isCalling,
        unreadMessages,
        markMessagesAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
