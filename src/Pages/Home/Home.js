import React from 'react';
import { useAuth } from '../../AuthProvider';
import Messenger from './Messenger/Messenger';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className={styles.home}>
      <div className={styles.chats}>
        <Navbar user={user} />
        <Sidebar user={user} />
      </div>
      <div className={styles.main}>
        <Messenger />
      </div>
    </div>
  );
};

export default Home;
