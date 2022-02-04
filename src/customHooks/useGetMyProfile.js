import { useState, useEffect } from 'react';
import { database } from '../firebase';
const initialState = {
  id: '',
  firstname: '',
  lastname: '',
  photo: '',
  chats: [],
};
export const useGetMyProfile = (id) => {
  const [user, setUser] = useState(initialState);
  useEffect(() => {
    const getMyProfile = (id) => {
      database.users.doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          let profile = doc.data();
          setUser({
            ...user,
            id: profile.id,
            firstname: profile.firstname,
            lastname: profile.lastname,
            photo: profile.photo,
            chats: profile.chats,
          });
        }
      });
    };
    if (id) {
      getMyProfile(id);
    }
    return () => {
      setUser(initialState);
    };
  }, [id]);
  return { user };
};
