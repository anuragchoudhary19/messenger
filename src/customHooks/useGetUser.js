import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetUser = (id) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getProfile = () => {
      database.users.doc(id).onSnapshot((doc) => {
        if (doc.data()) {
          let userDoc = doc.data();
          setUser({
            id: userDoc.id,
            firstname: userDoc.firstname,
            lastname: userDoc.lastname,
            photo: userDoc.photo,
          });
        }
      });
    };
    getProfile();
    return () => {
      setUser({});
    };
  }, [id]);
  return { user };
};
