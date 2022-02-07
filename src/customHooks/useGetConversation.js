import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { useAuth } from './../AuthProvider';
import { v4 as uuidv4 } from 'uuid';

export const useGetConversation = (userId) => {
  const { user } = useAuth();
  const { chats } = user;
  const [chatId, setChatId] = useState('');
  const [conversation, setConversation] = useState([]);
  useEffect(() => {
    const getCoversation = (id) => {
      database.chats.doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          setConversation(doc.data());
        }
      });
    };
    if (chats?.length > 0) {
      for (let i = 0; i < chats.length; i++) {
        for (const [recipient, chatId] of Object.entries(chats[i])) {
          if (recipient === userId) {
            setChatId(chatId);
            getCoversation(chatId);
            return;
          }
        }
      }
      setChatId(uuidv4());
      setConversation([]);
    } else {
      setChatId(uuidv4());
      setConversation([]);
    }
    return () => {
      setConversation([]);
      setChatId('');
    };
  }, [userId, chats]);
  return { chatId, conversation };
};
