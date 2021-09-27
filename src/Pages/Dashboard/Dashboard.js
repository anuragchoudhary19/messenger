import React from 'react';
import { useAuth } from '../../AuthProvider';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Dashboard.module.css';
import Messenger from './Messenger/Messenger';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className={styles.home}>
      <header>
        <Navbar user={user} />
        <Sidebar user={user} />
      </header>
      <div className={styles.main}>
        <Messenger />
      </div>
    </div>
  );
};

export default Dashboard;
