import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
//
import Sidebar from '../../components/Sidebar/Sidebar';
import ChatBox from './ChatBox/ChatBox';
import Navbar from '../../components/Navbar/Navbar';
//
import styles from './Chat.module.css';

const Chat = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();

  return (
    <div className={styles.chat}>
      <div className={styles.chats}>
        <Navbar />
        <Sidebar />
      </div>
      <div className={styles.main}>
        <ChatBox currentUser={currentUser} userId={userId} />
      </div>
    </div>
  );
};

export default Chat;
