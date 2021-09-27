import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../../../firebase';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Chatbox.module.css';
import TextArea from '../../../components/Elements/TextArea/TextArea';
import profile from '../../../images/profile.jfif';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { useGetRecipient } from '../../../customHooks/useGetRecipient';
import { useManageChat } from '../../../customHooks/useManageChat';

const ChatBox = ({ recipient, user, conversationId }) => {
  const { recipientProfile } = useGetRecipient(recipient);
  const { text, setText, sendMessage, chat } = useManageChat(user.id, recipient, conversationId);
  const [dropdown, setDropdown] = useState(false);
  const messagesRef = useRef();
  const submitRef = useRef();
  const menu = useRef();
  const history = useHistory();

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat]);
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
    if (menu.current.contains(e.target)) {
      return;
    }
    setDropdown(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleMenuClick);
    return () => document.removeEventListener('mousedown', handleMenuClick);
  }, []);

  const handleDeleteChat = async () => {
    await database.users
      .where('id', '==', user.id)
      .get()
      .then((snapshot) => {
        if (snapshot.docs[0]) {
          let user = snapshot.docs[0];
          let updatedChats = user.data().chats.filter((chat) => chat.id !== recipient);
          user.ref.update({
            chats: updatedChats,
          });
        }
      })
      .then(() => {
        history.push('/home');
      });
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.header}>
        {recipientProfile && (
          <>
            <div>
              {<img src={recipientProfile?.photo || profile} alt='profile-pic' />}
              <h3>{`${recipientProfile?.firstname} ${recipientProfile?.lastname}`}</h3>
            </div>
            <div className={styles.dropdown} ref={menu}>
              <div onClick={() => setDropdown(true)}>
                <FontAwesomeIcon icon={faEllipsisH} />
              </div>
              <Dropdown open={dropdown}>
                <div onClick={handleDeleteChat}>Delete</div>
              </Dropdown>
            </div>
          </>
        )}
      </div>
      <div ref={messagesRef} className={styles.messages}>
        {chat.length > 0 &&
          chat.map((message) => {
            if (message.sender === user.id) {
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
          })}
      </div>
      <div className={styles.message}>
        <TextArea
          value={text}
          type='text'
          placeholder='Write your message here'
          onChange={(e) => setText(e.target.value)}
        />
        <button ref={submitRef} type='button' onClick={sendMessage}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            style={{
              width: '50%',
              height: '50%',
              fontSize: '1.5rem',
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
