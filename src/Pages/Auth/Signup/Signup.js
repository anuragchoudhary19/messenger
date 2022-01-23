import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../../../firebase';
import { useAuth } from '../../../AuthProvider';
//
import Input from '../../../components/Elements/Input/Input';
import Button from '../../../components/Elements/Button/Button';
//
import styles from './Signup.module.css';

const Signup = () => {
  const initialState = { firstname: '', lastname: '', email: '', password: '', confirmPassword: '' };
  const [form, setForm] = useState(initialState);
  const { firstname, lastname, email, password, confirmPassword } = form;
  const [formErrors, setFormErrors] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;
    if (isMounted && currentUser) {
      history.push('/dashboard');
    }
    return () => {
      isMounted = false;
    };
  }, [history, currentUser]);

  const checkForm = () => {
    if (firstname.trim() === '') {
      setFormErrors((prev) => ({ ...prev, firstname: 'First name is required' }));
      return true;
    }
    if (email.trim() === '') {
      setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return true;
    }
    if (password.trim() === '') {
      setFormErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return true;
    }
    if (password !== confirmPassword) {
      setFormErrors((prev) => ({ ...prev, password: 'Password does not match' }));
      return true;
    }
    return false;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    let formHasError = checkForm();
    if (formHasError) {
      return;
    }
    setError('');
    setLoading(true);
    signup(email, password)
      .then(async (res) => {
        if (res) {
          await database.users.doc(res.user.uid).set({
            id: res.user.uid,
            email: res.user.email,
            firstname: firstname.trim(),
            lastname: lastname.trim(),
          });
        }
      })
      .catch((e) => {
        if (e.code === 'auth/email-already-in-use') {
          setError('The email is already registered.');
        } else {
          setError('Failed to create an account');
        }
      });
    setLoading(false);
  };
  const handleInput = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.signup}>
      <div className={styles.logo}>
        <h1>Messenger</h1>
      </div>
      <div className={styles.form}>
        <form onSubmit={handleSignup}>
          <h1>Sign Up</h1>
          {error && <span className={styles.error}>{error}</span>}
          <Input
            label='First Name'
            name='firstname'
            type='text'
            value={firstname}
            error={formErrors.firstname}
            onChange={handleInput}
          />
          <Input
            label='Last Name'
            name='lastname'
            type='text'
            value={lastname}
            error={formErrors.lastname}
            onChange={handleInput}
          />
          <Input
            label='Email'
            name='email'
            type='email'
            value={email}
            error={formErrors.email}
            onChange={handleInput}
          />
          <Input
            label='Password'
            name='password'
            type='password'
            value={password}
            error={formErrors.password}
            onChange={handleInput}
          />
          <Input
            label='Confirm Password'
            name='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={handleInput}
          />
          <Button width='100' btnStyle='primarySolid' btnSize='md' loading={loading} disabled={loading} type='submit'>
            Sign Up
          </Button>
          <span className={styles.login}>
            <Link to={'/login'}>Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
