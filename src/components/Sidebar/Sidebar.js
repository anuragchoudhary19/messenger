import React, { useState, useEffect, useCallback } from 'react';
import { database } from '../../firebase';
//
import Card from '../Card/Card';
import Input from './../Elements/Input/Input';
import Loader from './../Elements/Loader/Loader';
//
import styles from './Sidebar.module.css';

const Sidebar = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (q) => {
    setQuery(q);
    if (q.trim() !== '' && chats.length > 0) {
      setChats(chats.filter((chat) => filterChat(chat, q)));
    } else {
      getConversations();
    }
  };

  const filterChat = (chat, q) => {
    let regex = new RegExp('^' + q, 'g', 'i');
    if (regex.test(chat.firstname) || regex.test(chat.lastname)) {
      return chat;
    }
  };
  const getConversations = useCallback(async () => {
    if (user?.conversations.length) {
      setLoading(true);
      let chat = await Promise.all(
        user?.conversations.map(async (conversation) => {
          let conversationId = Object.entries(conversation)[0][0];
          let recipientId = Object.entries(conversation)[0][1];
          let recipient = null;
          recipient = await database.users
            .doc(recipientId)
            .get()
            .then((doc) => {
              let recipientData = doc.data();
              return recipientData;
            });
          return {
            id: recipient.id,
            firstname: recipient.firstname,
            lastname: recipient.lastname,
            photo: recipient.photo,
            conversationId: conversationId,
          };
        })
      );
      setLoading(false);
      setChats(chat);
    }
  }, [user?.conversations]);
  useEffect(() => {
    if (user?.id) {
      getConversations();
    }
    return () => getConversations();
  }, [user?.id, getConversations]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <Input type='text' value={query} placeholder='Search' onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <div className={styles.chats}>
        {loading && <Loader />}
        {!loading && chats?.length > 0 && chats.map((chat) => <Card chat={chat} key={chat.id} />)}
      </div>
    </div>
  );
};

export default Sidebar;
