import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export const useManageChat = (user, recipient, conversationId) => {
  const [chat, setChat] = useState([]);
  const [text, setText] = useState('');
  const [picture, setPicture] = useState('');
  const [video, setVideo] = useState('');
  useEffect(() => {
    if (conversationId) {
      database.chats.doc(conversationId).onSnapshot((doc) => {
        if (doc.exists) {
          setChat(doc.data().messages);
        }
      });
    }
    return () => setChat([]);
  }, [conversationId]);

  const sendMessage = async () => {
    await database.chats
      .doc(conversationId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let newMessages = [...doc.data().messages];
          newMessages.push({
            id: uuidv4(),
            sender: user,
            message: { text },
            createdAt: new Date(),
          });
          doc.ref.update({
            messages: newMessages,
          });
        } else {
          doc.ref.set({
            messages: [
              {
                id: uuidv4(),
                sender: user,
                message: { text },
                createdAt: new Date(),
              },
            ],
          });
          updateUsers(conversationId);
        }
      });
    setText('');
    setPicture('');
    setVideo('');
  };

  const updateUsers = async (conversationId) => {
    let users = [user, recipient];
    for (let id of users) {
      await database.users
        .doc(id)
        .get()
        .then((doc) => {
          let userDoc = doc.data();
          let conversations = [];
          if (userDoc.conversations?.length > 0) {
            conversations = [...userDoc.conversations];
          }
          conversations.push({ [conversationId]: users.find((user) => user !== id) });
          doc.ref.update({
            conversations: conversations,
          });
        });
    }
  };

  return { text, picture, video, setText, sendMessage, chat };
};
