import React, { useState } from 'react';
import { useAuth } from '../../AuthProvider';
//
import EditProfile from '../EditProfile/EditProfile';
import Modal from '../Modal/Modal';
import Button from '../Elements/Button/Button';
import SearchUsers from '../SearchUsers/SearchUsers';
//
import styles from './Navbar.module.css';

const Navbar = () => {
  const { logout, user } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [searcUsers, setSearcUsers] = useState(false);
  const handleEditProfileModal = () => {
    setEditProfile(true);
  };
  const handleSearchUsersModal = () => {
    setSearcUsers(true);
  };
  return (
    <div className={styles.navbar}>
      <div className={styles.photo} onClick={() => handleEditProfileModal()}>
        {user?.photo ? (
          <img src={user.photo} alt='profile-pic' width='50' height='50' />
        ) : user?.firstname ? (
          <div>{user.firstname.substring(0, 1)}</div>
        ) : (
          <div>{user?.email.substring(0, 1)}</div>
        )}
      </div>
      <div className={styles.connect}>
        <Button width='fit-content' type='button' onClick={handleSearchUsersModal}>
          Connect
        </Button>
      </div>
      <div className={styles.logout}>
        <Button width='fit-content' type='button' onClick={logout}>
          Logout
        </Button>
      </div>
      <Modal isOpen={searcUsers}>
        <SearchUsers closeModal={setSearcUsers} />
      </Modal>
      <Modal isOpen={editProfile}>
        <EditProfile closeModal={setEditProfile} />
      </Modal>
    </div>
  );
};

export default Navbar;
