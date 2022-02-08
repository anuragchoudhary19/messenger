import { useState, useEffect } from 'react';
import { useSocket } from './../SocketProvider';

export const useIsTyping = (recieverId, senderId, text) => {
  const socket = useSocket();
  const [isRecieverTyping, setIsRecieverTyping] = useState(false);
  useEffect(() => {
    if (!socket || !recieverId) return;
    if (text !== '') {
      socket.emit('typing', senderId, recieverId);
    }
    if (text === '') {
      socket.emit('notTyping', senderId, recieverId);
    }
    socket.on('typing', (sender, reciever) => {
      if (sender === recieverId && reciever === senderId) {
        setIsRecieverTyping(true);
      } else {
        setIsRecieverTyping(false);
      }
    });
    socket.on('notTyping', (sender, reciever) => {
      if (sender === recieverId && reciever === senderId) {
        setIsRecieverTyping(false);
      }
    });
    return () => {
      setIsRecieverTyping(false);
    };
  }, [socket, text, senderId, recieverId]);
  return { isRecieverTyping };
};
