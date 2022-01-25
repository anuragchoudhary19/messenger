import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Chat.module.css';
import ChatBox from './ChatBox/ChatBox';
import Navbar from '../../components/Navbar/Navbar';
import { useGetConversationId } from './../../customHooks/useGetConversationId';

const Chat = () => {
  const { currentUser, user } = useAuth();
  const { id } = useParams();
  const { conversationId } = useGetConversationId(currentUser.id, id);
  return (
    <div className={styles.home}>
      <header>
        <Navbar user={user} />
        <Sidebar user={user} />
      </header>
      <div className={styles.main}>
        {id && conversationId ? (
          <ChatBox user={currentUser} recipient={id} conversationId={conversationId} />
        ) : (
          <div className={styles.logo}>Messenger</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
