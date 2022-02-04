import { useState, useEffect } from 'react';
import { database } from '../firebase';
const initialState = {
  id: '',
  firstname: '',
  lastname: '',
  photo: '',
};
export const useGetUser = (id) => {
  const [user, setUser] = useState(initialState);
  useEffect(() => {
    const getProfile = () => {
      database.users
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.data()) {
            let userDoc = doc.data();
            setUser({
              ...user,
              id: userDoc.id,
              firstname: userDoc.firstname,
              lastname: userDoc.lastname,
              photo: userDoc.photo,
            });
          }
        });
    };
    getProfile();
    return () => getProfile;
  }, [id, user]);
  return { user };
};
