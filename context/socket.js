import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create a new socket connection
    const connection = io(); // Assuming the default URL is sufficient
    console.log("socket connection", connection);

    setSocket(connection);

    const handleConnectError = async (err) => {
      console.log("Error establishing socket", err);
      await fetch('/api/socket'); // This will connect to the backend socket so that connection is established between client and server
      console.log("Client socket is connected");
    };

    // Set up event listener for connect_error
    connection.on('connect_error', handleConnectError);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      connection.off('connect_error', handleConnectError); // Remove the listener
      connection.disconnect(); // Disconnect the socket
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
