import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
//
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileImage from '../../images/profile.jfif';
//
import Dropdown from '../Dropdown/Dropdown';
import DropdownModal from '../DropdownModal/DropdownModal';
import Options from '../Options/Options';
//
import date from 'date-and-time';
import styles from './Card.module.css';
import { useGetUser } from '../../customHooks/useGetUser';
import { useGetOnlineStatus } from '../../customHooks/useGetOnlineStatus';
import { useGetLastMessage } from '../../customHooks/useGetLastMessage';
import { useDeleteChat } from '../../customHooks/useDeleteChat';

const Card = (props) => {
  const { query, chat } = props;
  const [[recipientId, chatId]] = Object.entries(chat);
  const { user } = useGetUser(recipientId);
  const { id, firstname, lastname, photo } = user;
  const isOnline = useGetOnlineStatus(id);
  const { lastMessage } = useGetLastMessage(chatId);
  const [matchesQuery, setMatchesQuery] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');
  const { deleteChat } = useDeleteChat(chatId, id);
  const dropdown = useRef();
  const card = useRef();
  const popupNode = useRef();
  useEffect(() => {
    let regex = new RegExp('^' + query, 'g', 'i');
    if (regex.test(firstname) || regex.test(lastname)) {
      setMatchesQuery(true);
    }
  }, [firstname, lastname, query]);

  const handleClick = useCallback((e) => {
    if (dropdown.current?.contains(e.target)) {
      return;
    } else if (popupNode.current?.contains(e.target)) {
      return;
    }
    setOpenDropdown('');
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handleClick]);

  const checkTime = (time) => {
    const currentDate = new Date();
    const messageDate = new Date(time);
    if (date.subtract(currentDate, messageDate).toHours() <= 23) {
      return new Date(time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (date.subtract(currentDate, messageDate).toDays() <= 7) {
      return Math.floor(date.subtract(currentDate, messageDate).toDays()) + 'd';
    } else if (date.subtract(currentDate, messageDate).toDays() <= 365) {
      return date.format(new Date(time), 'DD MMM');
    } else {
      return date.format(new Date(time), 'DD MMM YYYY');
    }
  };
  return (
    (query === '' || matchesQuery) && (
      <div className={styles.card} ref={card} id={chatId}>
        <Link className={styles.link} to={`/${id}`}>
          <div className={styles.avatar}>
            <img src={photo || ProfileImage} alt='profile' />
          </div>
          <div className={styles.header}>
            <div className={styles.name}>
              {firstname && <span>{firstname}</span>}
              {lastname && <span>{lastname}</span>}
              {isOnline && <span className={styles.online}></span>}
            </div>
            <div className={styles.lastMessage}>
              {lastMessage.message && <span className={styles.message}>{lastMessage.message.text}</span>}
              {lastMessage.createdAt && (
                <span className={styles.date}>{checkTime(lastMessage.createdAt.seconds * 1000)}</span>
              )}
            </div>
          </div>
        </Link>
        <div className={styles.dropdown} ref={dropdown} onClick={() => setOpenDropdown(true)}>
          <div>
            <FontAwesomeIcon icon={faEllipsisH} />
          </div>
          <Dropdown open={openDropdown}>
            <div onClick={deleteChat}>Delete</div>
          </Dropdown>
          <DropdownModal isOpen={openDropdown}>
            <Options>
              <div onClick={deleteChat} ref={popupNode}>
                Delete
              </div>
            </Options>
          </DropdownModal>
        </div>
      </div>
    )
  );
};

export default Card;
