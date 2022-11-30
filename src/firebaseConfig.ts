import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBgG68y66XewoyH0OxRQrAZNA6UmDqYIAo",
    authDomain: "upodcapstone.firebaseapp.com",
    projectId: "upodcapstone",
    storageBucket: "upodcapstone.appspot.com",
    messagingSenderId: "560653635585",
    appId: "1:560653635585:web:681c5ed2baff7b0e943000",
    measurementId: "",
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
