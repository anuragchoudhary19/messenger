import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetLastMessage = (chatId) => {
  const [lastMessage, setLastMessage] = useState({});
  useEffect(() => {
    database.chats.doc(chatId).onSnapshot((doc) => {
      if (doc.exists) {
        let chats = doc.data();
        let dates = Object.keys(chats);
        let latestMessageDate = dates[dates.length - 1];
        let latestMessages = chats[latestMessageDate];
        setLastMessage(latestMessages[latestMessages.length - 1]);
      }
    });
    return () => {
      setLastMessage({});
    };
  }, [chatId]);
  return { lastMessage };
};
