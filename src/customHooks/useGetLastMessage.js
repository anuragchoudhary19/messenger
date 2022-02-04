import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetLastMessage = (chatId) => {
  const [lastMessage, setLastMessage] = useState({});
  useEffect(() => {
    database.chats.doc(chatId).onSnapshot((doc) => {
      if (doc.exists) {
        let chats = doc.data();
        console.log(chats);
        let dates = Object.keys(chats);
        console.log(dates);
        let latestMessageDate = dates[dates.length - 1];
        let latestMessages = chats[latestMessageDate];
        console.log(latestMessages);
        setLastMessage(latestMessages[latestMessages.length - 1]);
      }
    });
  }, [chatId]);
  return { lastMessage };
};
