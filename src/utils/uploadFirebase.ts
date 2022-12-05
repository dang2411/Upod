import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import storage from '../firebaseConfig.js';
import uuidv4 from './uuidv4.js';

/**
 *
 * @param file File to upload
 * @param userId folder in firebase
 */
function uploadFirebase(file, userId): Promise<string> {
  if (!file) {
    alert('Please choose a file first!');
  }

  const storageRef = ref(storage, `/${userId}/${uuidv4() + file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  const upload = new Promise<String>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        // update progress
        console.log(percent);
      },
      (err) => {
        reject(err.message);
      },
      async () => {
        // download url
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
  return upload;
}
export default uploadFirebase;
