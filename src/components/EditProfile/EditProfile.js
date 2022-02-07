import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthProvider';
import { useImageStorage } from '../../customHooks/useImageStorage';
import { database } from '../../firebase';

import Input from '../Elements/Input/Input';
import Button from '../Elements/Button/Button';
//
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './EditProfile.module.css';

const EditProfile = ({ closeModal }) => {
  const { user } = useAuth();
  const initialState = {
    firstname: '',
    lastname: '',
    email: '',
    photo: '',
  };
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState({ preview: '', raw: '' });
  const [errors, setErrors] = useState(initialState);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updating, setUpdating] = useState(false);
  const { url, progress, error } = useImageStorage(image.raw, 'profile');

  useEffect(() => {
    setForm((prevState) => ({ ...prevState, ...user }));
  }, [user]);
  const close = () => {
    closeModal();
  };

  const inputChangeHandle = (label) => (e) => {
    setErrors({ ...errors, [label]: '' });
    setForm({ ...form, [label]: e.target.value });
  };
  const imageUploadHandle = (e) => {
    setErrors({ ...errors, photo: '' });
    if (e.target.files[0].size > 2097152) {
      setErrors({ ...errors, photo: 'Image must be less than 2MB' });
      return;
    }
    setImage({ preview: URL.createObjectURL(e.target.files[0]), raw: e.target.files[0] });
  };
  const updateProfileHandle = async (e) => {
    e.preventDefault();
    if (form.firstname === '') {
      setErrors({ ...errors, firstname: 'Firstname is required' });
      return;
    }
    if (form.email === '') {
      setErrors({ ...errors, email: 'Email is required' });
      return;
    }
    setUpdating(true);
    await database.users.doc(user.id).update({
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      photo: url ? url : form.photo,
    });
    setUpdating(false);
    setUpdateSuccess('Updated Successfully');
  };
  return (
    <form className={styles.modal}>
      <header>
        <h2>Edit Profile</h2>
        <FontAwesomeIcon
          icon={faTimes}
          style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={close}
        />
      </header>
      <div>
        {updateSuccess && <div>{updateSuccess}</div>}
        <div className={styles.images}>
          <div className={styles.photo}>
            <label>
              <input type='file' hidden accept='image/*' onChange={(e) => imageUploadHandle(e)} />
            </label>
            <div>
              {(form?.photo || image?.preview) && <img src={image?.preview || form?.photo} alt='profile' />}
              <FontAwesomeIcon
                icon={faCamera}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  zIndex: '1',
                }}
              />
            </div>
          </div>
          {progress > 0 && <div>{progress}%</div>}
          {error && <span className={styles.error}>{error}</span>}
        </div>
        <div className={styles.form}>
          <div>
            <Input
              label='First Name'
              type='text'
              value={form?.firstname}
              error={errors?.firstname}
              onChange={inputChangeHandle('firstname')}
            />
            <Input
              label='Last Name'
              type='text'
              value={form?.lastname}
              error={errors?.lastname}
              onChange={inputChangeHandle('lastname')}
            />
          </div>
          <Input
            label='Email'
            type='email'
            value={form?.email}
            error={errors?.email}
            onChange={inputChangeHandle('email')}
          />
          <div style={{ marginLeft: 'auto', marginRight: '0.5rem', width: '40%' }}>
            <Button width='100%' btnStyle='primarySolid' btnSize='md' loading={updating} onClick={updateProfileHandle}>
              Update
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
