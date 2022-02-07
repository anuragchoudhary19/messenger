import { useState, useEffect } from 'react';
import { database } from '../firebase';
export const useGetMyProfile = (id) => {
  const [user, setUser] = useState({
    id: '',
    firstname: '',
    lastname: '',
    photo: '',
    chats: [],
  });
  useEffect(() => {
    const getMyProfile = (id) => {
      database.users.doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          let profile = doc.data();
          setUser({
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
      setUser({
        id: '',
        firstname: '',
        lastname: '',
        photo: '',
        chats: [],
      });
    };
  }, [id]);
  return { user };
};
