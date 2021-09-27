import React from 'react';
import ReactDom from 'react-dom';

const Modal = ({ isOpen, children }) => {
  const style = {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000070',
    zIndex: 1000,
  };
  if (!isOpen) return null;
  return ReactDom.createPortal(<div style={style}>{children}</div>, document.getElementById('modal'));
};

export default Modal;
