import { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
export const useImageStorage = (file, folder) => {
  const [url, setUrl] = useState('');
  const [progress, setProgess] = useState(0);
  const [error, setError] = useState('');
  useEffect(() => {
    if (file) {
      let storageRef = storage.ref();
      let imageRef = storageRef.child(`${folder}/${uuidv4()}`);
      let uploadTask = imageRef.put(file);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgess(progress);
          switch (snapshot.state) {
            case 'paused': // or
              console.log('Upload is paused');
              break;
            case 'running': // or
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              setError({ ...error, photo: "User doesn't have permission to access the object" });
              break;
            case 'storage/canceled':
              setError({ ...error, photo: 'User canceled the upload' });
              break;
            case 'storage/unknown':
              setError({ ...error, photo: ' Unknown error occurred,' });
              break;
            default:
              break;
          }
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            setUrl(downloadURL);
            setProgess(0);
          });
        }
      );
    }
  }, [file, folder]);
  return { url, progress, error };
};
