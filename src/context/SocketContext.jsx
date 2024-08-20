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



  useEffect(() => {
    if (user) {
      socket.current = io(import.meta.env.VITE_BASE_URL, {
        query: { userId: user?.id },
        withCredentials: true,
      });

      //Connect user with socket
      socket.current.on("connect", () => {
        console.log(`Connected with ID: ${socket.current.id}`);
      });
      //Get socket messages from DB
      socket.current.on("receiveMessage", (updatedMessages) => {
        setMessages(updatedMessages);
      });
      //User online / offline status
      socket.current.on("userStatus", ({ userId, status }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
      });
      //Disconnect
      socket.current.on("disconnect", () => {
        console.log("Disconnected from the socket server");
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  //Socket send message functions
  const sendMessage = (message, isFile = false) => {
    if (isFile) {
      fetch(`${import.meta.env.VITE_BASE_URL}/chat/upload`, {
        method: "POST",
        body: message,
      })
        .then((response) => response.json())
        .then((data) => {
          // Emit the message after upload is successful
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
      value={{ socket: socket.current, messages, sendMessage,onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};
