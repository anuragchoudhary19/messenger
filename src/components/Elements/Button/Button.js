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
    <div
      className={`${styles.btn} ${disabled ? styles.disabled : styles[checkBtnStyle]} 
       `}
      style={{ width: width + '%' }}
      onClick={onClick}>
      <button
        className={`${loading ? styles.loading : styles.active}`}
        disabled={disabled ? disabled : false}
        type={type}>
        {children}
      </button>
    </div>
  );
};

export default Button;
