import React from 'react';
import styles from './TextArea.module.css';

const TextArea = (props) => {
  return (
    <div className={styles.textarea}>
      <textarea
        rows={props.rows}
        value={props.value}
        placeholder={props.placeholder}
        autoFocus={true}
        onChange={props.onChange}
      />
    </div>
  );
};

export default TextArea;
