// import { useState, useEffect } from 'react';
// import { database } from '../firebase';

// export const useUpdateUser = (user) => {
//   const [submit, setSubmit] = useState(false);
//   const [updated, setUpdated] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   useEffect(() => {
//     if (user && submit) {
//       setUpdating(true);
//       database.users
//         .where('id', '==', user.id)
//         .limit(1)
//         .get()
//         .then((query) => {
//           let userDoc = query.docs[0];
//           userDoc.ref.update({
//             firstname: user.firstname,
//             lastname: user.lastname,
//             email: user.email,
//             photo: user.photo,
//           });
//         })
//         .then(() => {
//           setUpdated(true);
//           setUpdating(false);
//         })
//         .catch(() => {
//           setUpdated(false);
//           setUpdating(false);
//         });
//     }
//   }, [submit, user]);

//   return { updated, updating, setSubmit };
// };
