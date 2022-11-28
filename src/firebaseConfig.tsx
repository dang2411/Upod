import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDcUUVt0AZajKhHXE9R-vB1TInVU37ji3A',
  authDomain: 'upodcapstone.appspot.com',
  databaseURL: 'https://DATABASE_NAME.firebaseio.com',
  projectId: 'upodcapstone',
  storageBucket: 'gs://upodcapstone.appspot.com',
  messagingSenderId: 'SENDER_ID',
  appId: '1:560653635585:web:681c5ed2baff7b0e943000',
  measurementId: 'G-MEASUREMENT_ID',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
