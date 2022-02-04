import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetConversationId = (chatId) => {
  const [conversationId, setConversationId] = useState('');
  useEffect(() => {
    const getCoversation = () => {
      database.chats.doc(chatId).onSnapshot((doc) => {
        if (doc.exists) {
          setConversationId(doc.data());
        }
      });
    };
    if (chatId) {
      getCoversation();
    }
  }, [chatId]);
  return { conversationId };
};
