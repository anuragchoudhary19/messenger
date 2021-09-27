import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../AuthProvider';
//
import EditProfile from '../EditProfile/EditProfile';
import Modal from '../Modal/Modal';
import Button from '../Elements/Button/Button';
import SearchUsers from '../SearchUsers/SearchUsers';
import Dropdown from '../Dropdown/Dropdown';
//
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { logout, user } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [searcUsers, setSearcUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef();
  const dropdownIcon = useRef();

  const handleNavbarMenuClick = useCallback(
    (e) => {
      if (dropdownIcon.current.contains(e.target)) {
        setOpen(!open);
        return;
      } else if (menu.current.contains(e.target)) {
        return;
      } else {
        setOpen(false);
      }
    },
    [open]
  );
  useEffect(() => {
    document.addEventListener('mousedown', handleNavbarMenuClick);
    return () => document.removeEventListener('mousedown', handleNavbarMenuClick);
  }, [handleNavbarMenuClick]);

  const handleEditProfileModal = () => {
    setEditProfile(true);
  };
  const handleSearchUsersModal = () => {
    setSearcUsers(true);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.photo} onClick={() => handleEditProfileModal()}>
        {user && user?.photo ? (
          <img src={user.photo} alt='profile-pic' width='50' height='50' />
        ) : user?.firstname ? (
          <div>{user.firstname.substring(0, 1)}</div>
        ) : (
          <div>{user?.email.substring(0, 1)}</div>
        )}
      </div>
      <div className={styles.connect}>
        <Button width='50' btnStyle='primaryOutline' type='button' onClick={handleSearchUsersModal}>
          Connect
        </Button>
      </div>
      <div className={styles.dropdown} ref={menu}>
        <div ref={dropdownIcon}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
        <Dropdown open={open}>
          <div onClick={logout}>Logout</div>
        </Dropdown>
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
