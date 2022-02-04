import { useState } from 'react';
import { database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export const useManageChat = (myId, userId, chatId) => {
  const [text, setText] = useState('');
  const [picture, setPicture] = useState('');
  const [video, setVideo] = useState('');

  const getLatestMessageDate = (chats) => {
    let chatsDates = Object.keys(chats);
    if (chatsDates.length === 0) return;
    let latestMessageDate = chatsDates[chatsDates.length - 1];
    return latestMessageDate;
  };
  const sendMessage = async () => {
    await database.chats
      .doc(chatId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let time = new Date();
          let chats = doc.data();
          let latestMessageDate = getLatestMessageDate(chats);
          if (latestMessageDate === new Date().toDateString()) {
            let latestMessages = [...chats[latestMessageDate]];
            latestMessages.push({
              id: uuidv4(),
              sender: myId,
              message: { text },
              seen: false,
              createdAt: time,
            });
            doc.ref.update({
              ...chats,
              [latestMessageDate]: latestMessages,
            });
          }
          if (latestMessageDate !== new Date().toDateString()) {
            doc.ref.update({
              ...chats,
              [new Date().toDateString()]: [
                {
                  id: uuidv4(),
                  sender: myId,
                  message: { text },
                  seen: false,
                  createdAt: time,
                },
              ],
            });
          }
        } else {
          let time = new Date();
          doc.ref.set({
            [new Date().toDateString()]: [
              {
                id: uuidv4(),
                sender: myId,
                message: { text },
                seen: false,
                createdAt: time,
              },
            ],
          });
          addChatIdToChatsList(chatId);
        }
      });
    setText('');
    setPicture('');
    setVideo('');
  };

  const userChatsExist = (chats, userId) => {
    let chatExist = false;
    if (!chats.length) return false;
    for (let i = 0; i < chats.length; i++) {
      if (Object.keys(chats[i])[0] === userId) {
        chatExist = true;
        return;
      }
    }
    return chatExist;
  };
  const addChatIdToChatsList = (chatId) => {
    let users = [myId, userId];
    for (let id of users) {
      database.users
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) return;
          let chats = [...doc.data().chats];
          let recipient = users.find((user) => user !== id);
          if (userChatsExist(chats, recipient)) return;
          chats.push({
            [recipient]: chatId,
          });
          doc.ref.update({
            chats: chats,
          });
        });
    }
  };

  return { text, picture, video, setText, sendMessage };
};
