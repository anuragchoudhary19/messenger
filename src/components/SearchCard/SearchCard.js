import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
//

// import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// //
// import Dropdown from '../Dropdown/Dropdown';
// import Modal from '../Modal/Modal';
// import Options from '../Options/Options';
import ProfileImage from '../../images/profile.jfif';

import styles from './SearchCard.module.css';

const Card = (props) => {
  const { user, close } = props;
  // const [open, setOpen] = useState();
  const card = useRef();
  // const dropdown = useRef();
  // const dropdownIcon = useRef();
  // const popupNode = useRef();
  const history = useHistory();

  // const handleClick = useCallback(
  //   (e) => {
  //     if (dropdownIcon.current.contains(e.target)) {
  //       setOpen(!open);
  //       return;
  //     } else if (dropdown.current?.contains(e.target)) {
  //       return;
  //     } else if (popupNode.current?.contains(e.target)) {
  //       return;
  //     } else if (card.current?.contains(e.target)) {
  //       setOpen(false);
  //       return;
  //     }
  //     setOpen(false);
  //   },
  //   [open]
  // );
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClick);
  //   return () => document.removeEventListener('mousedown', handleClick);
  // }, [handleClick]);

  const handleRedirect = (id) => {
    history.push(`/${id}`);
    close();
  };
  // const blockHandle = () => {
  //   //
  // };

  return (
    <div className={styles.card} ref={card}>
      <div className={styles.user} onClick={() => handleRedirect(user.id)}>
        <div className={styles.avatar}>
          <img src={user?.photo || ProfileImage} alt='profile' />
        </div>
        <div className={styles.header}>
          <span className={styles.name}>{`${user.firstname} ${user.lastname}`}</span>
        </div>
      </div>
      {/* <div className={styles.dropdown} ref={dropdown}>
        <div ref={dropdownIcon}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </div>
        {screen > 768 ? (
          <Dropdown open={open}>
            <div onClick={() => blockHandle(user?.id)}>Delete</div>
          </Dropdown>
        ) : (
          <Modal isOpen={open}>
            <Options>
              <div onClick={() => blockHandle(user?.id)} ref={popupNode}>
                Delete
              </div>
            </Options>
          </Modal>
        )}
      </div> */}
    </div>
  );
};

export default Card;
