import React from 'react';
//
import styles from './Options.module.css';

const Options = ({ children }) => {
  return <div className={styles.modal}>{children}</div>;
};

export default Options;
