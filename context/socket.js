import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = io(); //one connection is made for the client
    console.log("socket connection", connection)
    setSocket(connection);
  }, []);

  socket?.on('connect_error', async (err) => {
    console.log("Error establishing socket", err)

    await fetch('/api/socket') //this will connect to the backend socket so that connection is established between client and server
    console.log("Client socket is connected")
  })

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}
