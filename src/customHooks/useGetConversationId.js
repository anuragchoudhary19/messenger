import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export const useGetConversationId = (userId, recipient) => {
  const [conversationId, setConversationId] = useState(null);
  useEffect(() => {
    const getConversationId = async () => {
      await database.users
        .doc(userId)
        .get()
        .then((doc) => {
          let conversations = doc.data().conversations;
          if (!conversations) {
            setConversationId(uuidv4());
            return;
          }
          if (conversations?.length) {
            let conversationIdFound = false;
            for (let obj of conversations) {
              let [c] = Object.entries(obj);
              if (c[1] === recipient) {
                conversationIdFound = true;
                setConversationId(c[0]);
              }
            }
            if (!conversationIdFound) {
              setConversationId(uuidv4());
            }
          }
        });
    };
    if (userId && recipient) {
      getConversationId();
    }
  }, [userId, recipient]);
  return { conversationId };
};
