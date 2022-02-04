import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
//
import SearchCard from '../SearchCard/SearchCard';
import Input from './../Elements/Input/Input';
//
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './SearchUsers.module.css';

const SearchUsers = ({ closeModal }) => {
  const [query, setQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  useEffect(() => {
    const getUsers = () => {
      database.users
        .orderBy('email')
        .limit(5)
        .get()
        .then((data) => {
          let usersFound = [];
          data.docs.forEach((doc) => {
            usersFound.push(doc.data());
          });
          setSearchedUsers(usersFound);
        });
    };
    if (query === '') {
      getUsers();
    }
  }, [query]);
  useEffect(() => {
    const handleSearch = (q) => {
      setSearchedUsers([]);
      database.users
        .where('email', '>=', query.trim())
        .where('email', '<=', query.trim() + '\uf8ff')
        .get()
        .then((querySnapshot) => {
          let usersFound = [];
          querySnapshot.docs.forEach((doc) => {
            usersFound.push(doc.data());
          });
          setSearchedUsers(usersFound);
        });
    };
    if (query.trim() === '') {
      setSearchedUsers([]);
      return;
    } else {
      handleSearch(query);
    }
  }, [query]);

  const close = () => {
    closeModal();
  };

  return (
    <div className={styles.modal}>
      <header>
        <h2>Find Friends</h2>
        <FontAwesomeIcon
          icon={faTimes}
          style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={close}
        />
      </header>
      <div className={styles.search}>
        <Input type='text' value={query} placeholder='Search' onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className={styles.result}>
        <div className={styles.users}>
          {searchedUsers.length > 0 &&
            searchedUsers.map((user) => (
              <SearchCard close={closeModal} user={user} room={{ _id: user._id }} key={user.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
