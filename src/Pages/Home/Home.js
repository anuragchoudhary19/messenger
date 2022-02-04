import React from 'react';
import Messenger from './Messenger/Messenger';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.chats}>
        <Navbar />
        <Sidebar />
      </div>
      <div className={styles.main}>
        <Messenger />
      </div>
    </div>
  );
};

export default Home;
