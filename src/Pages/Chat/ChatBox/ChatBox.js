import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Chatbox.module.css';
import TextArea from '../../../components/Elements/TextArea/TextArea';
import DemoProfileImage from '../../../images/profile.jfif';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { faEllipsisH, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useManageChat } from '../../../customHooks/useManageChat';
import { useGetConversation } from './../../../customHooks/useGetConversation';
import { useGetUser } from '../../../customHooks/useGetUser';
import { useDeleteChat } from '../../../customHooks/useDeleteChat';
import { useSocket } from '../../../SocketProvider';
import { useIsTyping } from '../../../customHooks/useIsTyping';

const ChatBox = ({ userId, currentUser }) => {
  const socket = useSocket();
  const { user } = useGetUser(userId);
  const { chatId, conversation } = useGetConversation(userId);
  const { text, setText, sendMessage } = useManageChat(currentUser.id, userId, chatId);
  const { deleteChat } = useDeleteChat(chatId, userId, text);
  const { isRecieverTyping } = useIsTyping(userId, currentUser.id, text);
  const [dropdown, setDropdown] = useState(false);
  const messagesRef = useRef();
  const submitRef = useRef();
  const menu = useRef();
  const history = useHistory();

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current?.scrollHeight;
  }, [conversation]);
  useEffect(() => {
    const handleSendMessage = (e) => {
      if (e.key === 'Enter') {
        submitRef.current?.click();
      }
    };
    document.addEventListener('keydown', (e) => handleSendMessage(e));
    return () => document.removeEventListener('keydown', (e) => handleSendMessage(e));
  }, []);
  const handleMenuClick = (e) => {
    if (menu.current?.contains(e.target)) {
      return;
    }
    setDropdown(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleMenuClick);
    return () => document.removeEventListener('mousedown', handleMenuClick);
  }, []);

  const displayMessage = (conversation) => {
    let chats = [];
    for (const [date, messages] of Object.entries(conversation)) {
      chats.push(
        <span key={date} className={styles.date}>
          {date}
        </span>
      );
      let allMessages = messages.map((message) => {
        if (message.sender === currentUser.id) {
          return (
            <div
              className={styles.senderMessage}
              key={message.id}
              style={{ marginLeft: 'auto', marginRight: '0.5rem' }}>
              <span>{message.message.text}</span>
              <span>
                {new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        } else {
          return (
            <div
              className={styles.receiverMessage}
              key={message.id}
              style={{ marginLeft: '0.5rem', marginRight: 'auto' }}>
              <span>{message.message.text}</span>
              <span>
                {new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        }
      });
      chats.push(allMessages);
    }
    return chats;
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        {user?.id && (
          <>
            <div className={styles.user}>
              <div className={styles.back} onClick={() => history.push('/home')}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              {<img src={user?.photo || DemoProfileImage} alt='profile-pic' />}
              <div className={styles.name}>
                <h3>{`${user?.firstname} ${user?.lastname}`}</h3>
                <span>{isRecieverTyping ? 'typing...' : ''}</span>
              </div>
            </div>
            <div className={styles.dropdown} ref={menu}>
              <div onClick={() => setDropdown(true)}>
                <FontAwesomeIcon icon={faEllipsisH} />
              </div>
              <Dropdown open={dropdown}>
                <div onClick={deleteChat}>Delete</div>
              </Dropdown>
            </div>
          </>
        )}
      </div>
      <div ref={messagesRef} className={styles.messages}>
        {displayMessage(conversation)}
      </div>
      <div className={styles.textArea}>
        <TextArea
          rows={1}
          value={text}
          type='text'
          placeholder='Write your message here...'
          onChange={(e) => setText(e.target.value)}
        />
        <button ref={submitRef} type='button' onClick={() => sendMessage()}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            style={{
              color: 'white',
              cursor: 'pointer',
              zIndex: '1',
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
