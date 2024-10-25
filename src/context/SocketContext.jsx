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

  // Xirsys ICE servers configuration
  const iceServers = [
    { urls: ["stun:bn-turn2.xirsys.com"] },
    {
      username: import.meta.env.VITE_ICE_SERVER_USERNAME,
      credential: import.meta.env.VITE_ICE_SERVER_CREDENTIAL,
      urls: [
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
        "turns:bn-turn2.xirsys.com:443?transport=tcp",
        "turns:bn-turn2.xirsys.com:5349?transport=tcp",
      ],
    },
  ];

  // Audio files for call and message notifications
  const callSound = useRef(new Audio("/calling-audio.mp3"));
  const messageTone = useRef(new Audio("/message-tone.mp3"));

  // Function to initialize a new Peer instance
  const createPeerInstance = () => {
    if (peer.current) {
      peer.current.destroy(); // Ensure any previous peer instance is destroyed
      peer.current = null;
    }

    peer.current = new Peer(user.id, {
      config: { iceServers }, // Add the iceServers config here
      host: import.meta.env.VITE_PEER_HOST, // Replace with your PeerJS server host
      port: import.meta.env.VITE_PEER_PORT || 9000, // Replace with your PeerJS server port
      path: "/", // Replace with your PeerJS server path if different
      secure: import.meta.env.VITE_PEER_SECURE === "true", // Ensure secure is set based on your server
    });

    // Handle PeerJS events
    peer.current.on("open", (id) => {
      console.log(`PeerJS connection opened with ID: ${id}`);
      // Optionally, emit an event to notify server of the Peer ID
      socket.current.emit("peerId", { peerId: id });
    });

    peer.current.on("call", (call) => {
      console.log("Incoming call from:", call.peer);
      setIncomingCall(call);
    });

    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
      // Handle specific errors if necessary
    });
  };

  // Setup socket and peer connections when user is present
  useEffect(() => {
    if (user) {
      // Initialize Socket.IO client with reconnection settings
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id, userName: user?.name },
        withCredentials: true,
        reconnection: true, // Enable automatic reconnections
        reconnectionAttempts: Infinity, // Retry indefinitely
        reconnectionDelay: 1000, // Initial reconnection delay
        reconnectionDelayMax: 2000, // Maximum reconnection delay
        timeout: 1000, // Set a connection timeout
        autoConnect: true,
      });

      // Connection established
      socket.current.on("connect", () => {
        console.log(`Connected to socket server with ID: ${socket.current.id}`);
        socket.current.emit("getConnectedUsers");

        // Initialize PeerJS upon successful socket connection
        createPeerInstance();
      });

      // Handle disconnection
      socket.current.on("disconnect", (reason) => {
        console.error("Disconnected from the server. Reason:", reason);
        // Destroy PeerJS instance on disconnect
        if (peer.current) {
          peer.current.destroy();
          peer.current = null;
        }
        // Socket.IO will attempt to reconnect automatically
      });

      // Reconnection attempt
      socket.current.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Attempting to reconnect... (Attempt: ${attemptNumber})`);
      });

      // Reconnected successfully
      socket.current.on("reconnect", (attemptNumber) => {
        console.log(
          `Reconnected successfully after ${attemptNumber} attempts.`
        );
        // Reinitialize PeerJS upon reconnection
        createPeerInstance();
      });

      // Reconnection failed
      socket.current.on("reconnect_failed", () => {
        console.error("Reconnection failed. Unable to connect to the server.");
      });

      // Handle online users
      socket.current.on("onlineUsers", (onlineUsers) =>
        setOnlineUsers(onlineUsers)
      );

      // Handle connected users
      socket.current.on("connectedUsers", (users) => setConnectedUsers(users));

      // Handle incoming messages
      socket.current.on("receiveMessage", (updatedMessages) => {
        setMessages(updatedMessages);

        const latestMessage = updatedMessages[updatedMessages.length - 1];

        if (latestMessage.sender !== user?.id) {
          messageTone.current
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

      // Handle user status updates
      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });

      // Handle incoming call notifications
      socket.current.on("caller", ({ from }) => {
        setCallerName(from);
        if (Notification.permission === "granted") {
          new Notification("Incoming Call", {
            body: `${from} is calling you.`,
          });
        }
      });

      // Handle call ended by the other user
      socket.current.on("callEnded", ({ userId }) => {
        console.log(`Call ended by user with ID: ${userId}`);
        setRemoteStream(null);
        setIsCalling(false);
      });

      // Handle call accepted by the other user
      socket.current.on("callAccepted", (signal) => {
        if (peer.current) {
          peer.current.signal(signal);
        }
      });

      // Cleanup on unmount
      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log("Socket disconnected");
        }
        if (peer.current) {
          peer.current.destroy();
          console.log("PeerJS instance destroyed");
        }
      };
    }
  }, [user]);

  // Access webcam and set local stream on component mount
  // Request media access only when needed
  const getMediaDevices = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      setLocalStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error; // Optional: Handle error (e.g., show notification)
    }
  };

  // Initiate a call to a user
  const callUser = async (recipientId) => {
    try {
      const mediaStream = await getMediaDevices(); // Get media access before calling
      
      if (peer.current) {
        const call = peer.current.call(recipientId, mediaStream);
        call.on("stream", (stream) => setRemoteStream(stream));
        call.on("error", (err) => console.error("Call error:", err));

        setCallInProgress(true);
        setIsCalling(true);

        socket.current.emit("callUser", {
          userToCall: recipientId,
          from: user?.name,
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  // Answer an incoming call
  const answerCall = async () => {
    try {
      const mediaStream = await getMediaDevices(); // Get media access before answering
      if (incomingCall) {
        incomingCall.answer(mediaStream);
        incomingCall.on("stream", (remoteStream) =>
          setRemoteStream(remoteStream)
        );
        setIncomingCall(null);
        setCallInProgress(true);
        callSound.current.pause();
      }
    } catch (error) {
      console.error("Failed to answer call:", error);
    }
  };

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

  // End an ongoing call
  const endCall = () => {
    if (peer.current) {
      peer.current.destroy();
      peer.current = null;
      setRemoteStream(null);
      setCallInProgress(false);
      setIsCalling(false);
      callSound.current.pause();
      socket.current.emit("endCall", { userId: user.id });
      if (socket.current && socket.current.connected) createPeerInstance();
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
          // Emit the file message to the server
          socket.current.emit("sendMessage", data);

          // Optimistically add the file message to the sender's chat
          setMessages((prevMessages) => [...prevMessages, data]);
        })
        .catch((error) => console.error("Error uploading file:", error));
    } else {
      // Emit the message to the server
      socket.current.emit("sendMessage", message);

      // Optimistically add the message to the sender's chat
      setMessages((prevMessages) => [...prevMessages, message]);
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
        callSound: callSound.current,
        messageTone: messageTone.current,
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
