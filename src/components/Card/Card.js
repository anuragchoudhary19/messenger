import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../firebase';
//
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileImage from '../../images/profile.jfif';
//
import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';
import Options from '../Options/Options';

//
import date from 'date-and-time';
import styles from './Card.module.css';

const Card = (props) => {
  const { chat } = props;
  const { id, firstname, lastname, photo, conversationId } = chat;
  const [latestMessage, setLatestmessage] = useState('');
  const [latestMessageTime, setLatestmessageTime] = useState('');
  const [screen, setScreen] = useState(window.screen.width);
  const [openDropdown, setOpenDropdown] = useState('');
  const dropdown = useRef();
  const card = useRef();
  const popupNode = useRef();
  useEffect(() => {
    database.chats.doc(conversationId).onSnapshot((doc) => {
      let data = doc.data();
      let len = data.messages.length;
      if (len > 0) {
        setLatestmessage(data.messages[len - 1].message.text);
        setLatestmessageTime(data.messages[len - 1].createdAt.seconds);
      }
    });
    return () => {
      setLatestmessage('');
      setLatestmessageTime('');
    };
  }, [conversationId]);
  useEffect(() => {
    window.addEventListener('resize', () => setScreen(window.screen.width));
    return () => window.removeEventListener('resize', () => setScreen());
  }, []);

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

  const deleteHandle = (id) => {
    //  import('../../functions/tweet').then(({ removeTweet }) => {
    //    removeTweet(id, user.token)
    //      .then(() => {
    //        //
    //      })
    //      .catch((err) => {
    //        console.log(err);
    //      });
    //  });
  };

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
    <div className={styles.card} ref={card}>
      <Link className={styles.link} to={`/${id}`}>
        <div className={styles.avatar}>
          <img src={photo || ProfileImage} alt='profile' />
        </div>
        <div className={styles.header}>
          <span className={styles.name}>{firstname + ' ' + lastname}</span>
          {latestMessage && <div className={styles.message}>{latestMessage}</div>}
          {latestMessageTime && <span className={styles.date}>{checkTime(latestMessageTime * 1000)}</span>}
        </div>
      </Link>
      <div className={styles.dropdown} ref={dropdown} onClick={() => setOpenDropdown(true)}>
        <div>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
        {screen > 768 ? (
          <Dropdown open={openDropdown}>
            <div onClick={() => deleteHandle(id)}>Delete</div>
          </Dropdown>
        ) : (
          <Modal isOpen={openDropdown === id}>
            <Options>
              <div onClick={() => deleteHandle(id)} ref={popupNode}>
                Delete
              </div>
            </Options>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Card;
