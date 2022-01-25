import React from 'react';
import styles from './Button.module.css';
const Button = (props) => {
  const { btnStyle, width, children, loading, type, onClick, disabled } = props;
  const STYLES = [
    'primarySolid',
    'warningSolid',
    'dangerSolid',
    'successSolid',
    'primaryOutline',
    'warningOutline',
    'dangerOutline',
    'successOutline',
  ];
  const checkBtnStyle = STYLES.includes(btnStyle) ? btnStyle : STYLES[0];

  return (
    <button
      className={`${disabled ? styles.disabled : styles[checkBtnStyle]} ${
        loading ? `${styles.loading} ${styles.btn}` : styles.btn
      }`}
      style={{ width: width }}
      disabled={disabled ? disabled : false}
      type={type ? type : 'button'}
      onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
