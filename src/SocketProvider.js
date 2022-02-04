import React, { useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthProvider';

const SocketContext = React.createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    let socketConnection;
    if (user?.id !== '') {
      socketConnection = io(process.env.REACT_APP_API_SOCKET_IO_URL, {
        transports: ['websocket', 'polling', 'flashsocket'],
        credentials: true,
        query: { id: user.id },
      });
      setSocket(socketConnection);
    }
    return () => {
      setSocket(null);
    };
  }, [user?.id]);
  useEffect(() => {
    if (!socket) return;
    let onlineStatus = window.setInterval(() => {
      socket.emit('online', user?.id);
    }, 50);
    return () => {
      clearInterval(onlineStatus);
    };
  }, [socket, user?.id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
