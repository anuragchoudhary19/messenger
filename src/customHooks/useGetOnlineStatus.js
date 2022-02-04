import { useState, useEffect } from 'react';
import { useSocket } from './../SocketProvider';

export const useGetOnlineStatus = (userId) => {
  const socket = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    if (!socket || !userId) return;
    socket.on('online', (id) => {
      if (id === userId) {
        setIsOnline(true);
      }
    });
    socket.on('offline', (id) => {
      if (id === userId) {
        setIsOnline(false);
      }
    });
  }, [socket, userId]);
  return isOnline;
};
