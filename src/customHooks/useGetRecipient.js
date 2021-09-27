import { useState, useEffect } from 'react';
import { database } from '../firebase';

export const useGetRecipient = (recipient) => {
  const [recipientProfile, setRecipientProfile] = useState(null);
  useEffect(() => {
    const getRecipientProfile = () => {
      database.users
        .doc(recipient)
        .get()
        .then((doc) => {
          if (doc.data()) {
            let recipientDoc = doc.data();
            setRecipientProfile({
              firstname: recipientDoc.firstname,
              lastname: recipientDoc.lastname,
              photo: recipientDoc.photo,
            });
          }
        });
    };
    getRecipientProfile();
    return () => getRecipientProfile;
  }, [recipient]);
  return { recipientProfile };
};
