import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../providers/AuthProviders";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [localStream, setLocalStream] = useState(null); 
  const localVideoRef = useRef(null); 


  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id },
        withCredentials: true,
      });

      socket.current.on("connect", () => {
        console.log(`Connected with ID: ${socket.current.id}`);
        // Request connected users after connecting
        socket.current.emit("getConnectedUsers");
      });

      socket.current.on("onlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers); // Assuming setOnlineUsers is a state setter function
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
    // Get user media (video/audio)
    const getWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
          localVideoRef.current.play().catch((error) => {
            console.error("Error playing local video:", error);
          });
        }
        setLocalStream(mediaStream);

        mediaStream.getTracks().forEach((track) => {
          track.onended = () => {
            console.error("Webcam stream ended");
          };
        });
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    getWebcam();

  }, []); 

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
