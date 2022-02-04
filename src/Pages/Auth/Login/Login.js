import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../AuthProvider';
//
import Button from '../../../components/Elements/Button/Button';
import Input from '../../../components/Elements/Input/Input';
//
import styles from './Login.module.css';

const initialState = { email: '', password: '' };
const Login = () => {
  const demoEmail = 'anuragdemoemail@gmail.com';
  const demoPassword = 'password123';
  const [form, setForm] = useState(initialState);
  const { email, password } = form;

  const [formErrors, setFormErrors] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const history = useHistory();
  const { login, currentUser } = useAuth();
  useEffect(() => {
    let isMounted = true;
    if (isMounted && currentUser) {
      history.push('/home');
    }
    return () => {
      isMounted = false;
    };
  }, [history, currentUser]);

  const checkForm = () => {
    if (email.trim() === '') {
      setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return true;
    }
    if (password.trim() === '') {
      setFormErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return true;
    }
    return false;
  };

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true);
      await login(demoEmail, demoPassword);
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        setError('User not found');
      }
      if (e.code === 'auth/wrong-password') {
        setError('Wrong Password');
      }
    }
    setDemoLoading(false);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    let formHasError = checkForm();
    if (formHasError) {
      return;
    }
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (e) {
      console.log(e);
      if (e.code === 'auth/user-not-found') {
        setError('User not found');
      }
      if (e.code === 'auth/wrong-password') {
        setError('Wrong Password');
      }
    }
    setLoading(false);
  };
  const handleInput = (e) => {
    setError('');
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.login}>
      <div className={styles.logo}>
        <h1>Messenger</h1>
      </div>
      <div className={styles.form}>
        <form onSubmit={handleLogin}>
          <h1>Log In</h1>
          {error && <span className={styles.error}>{error}</span>}
          <Input
            label='Email'
            name='email'
            type='text'
            value={email}
            error={formErrors.email}
            onChange={handleInput}
            placeholder='Email'
            autofocus={true}
          />
          <Input
            label='Password'
            name='password'
            type='password'
            value={password}
            error={formErrors.password}
            onChange={handleInput}
            placeholder='Password'
          />
          <Button width='100%' btnStyle='primarySolid' btnSize='md' loading={loading} disabled={loading} type='submit'>
            Log In
          </Button>
          <br />
          <Button
            width='100%'
            btnStyle='primarySolid'
            btnSize='md'
            loading={demoLoading}
            disabled={demoLoading}
            type='button'
            onClick={handleDemoLogin}>
            Demo Log In
          </Button>
          <span className={styles.signup}>
            <Link to={'/signup'}>Sign Up</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
