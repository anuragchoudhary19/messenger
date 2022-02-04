import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './../../AuthProvider';
//
import Card from '../Card/Card';
import Input from './../Elements/Input/Input';
//
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { user } = useAuth();
  const { chats } = user;
  const [query, setQuery] = useState('');

  return (
    <div className={styles.sidebar}>
      <div className={styles.search}>
        <Input type='text' value={query} placeholder='Search' onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className={styles.chats}>
        {chats?.length > 0 && chats.map((chat) => <Card chat={chat} query={query} key={uuidv4()} />)}
      </div>
    </div>
  );
};

export default Sidebar;
