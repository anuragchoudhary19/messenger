import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetUser = (currentUser) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserProfile = (id) => {
      database.users.doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          let userDoc = doc.data();
          setUser({
            id: userDoc.id || '',
            firstname: userDoc.firstname || '',
            lastname: userDoc.lastname || '',
            photo: userDoc.photo || '',
            conversations: userDoc.conversations || [],
          });
        }
      });
    };
    if (currentUser?.id) {
      getUserProfile(currentUser.id);
    }
    return () => {
      setUser(null);
    };
  }, [currentUser]);
  return { user };
};
