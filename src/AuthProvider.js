import React, { useContext, useState, useEffect } from 'react';
import { useGetMyProfile } from './customHooks/useGetMyProfile';
import { auth } from './firebase';

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useGetMyProfile(currentUser?.id);
  const signup = async (email, password) => {
    return await auth.createUserWithEmailAndPassword(email, password);
  };
  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };
  const logout = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = () =>
      auth.onAuthStateChanged((user) => {
        setLoading(true);
        if (user) {
          setCurrentUser({ id: user.uid, email: user.email });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
    unsubscribe();
    return () => {
      unsubscribe();
      setCurrentUser(null);
    };
  }, []);

  const value = { currentUser, user, signup, login, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;
