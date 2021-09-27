import React from 'react';
import styles from './Input.module.css';

const Input = (props) => {
  let { error, label, name, type, value, onChange, placeholder, autoFocus } = props;
  return (
    <div className={styles.input}>
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name || ''}
        value={value || ''}
        onChange={onChange}
        autoComplete='true'
        placeholder={placeholder}
        autoFocus={autoFocus || false}
      />
      {error && <span className={styles.error}>{`*${error}`}</span>}
    </div>
  );
};

export default Input;
