import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import storage from 'src/firebaseConfig';

const uploadToFirebase = (file: any, userid: string) => {
  if (!file) {
    alert('Please upload an image first!');
  }

  const storageRef = ref(storage, `/${userid}/${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log(percent);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log(url);
      });
    }
  );
};

export { uploadToFirebase };
