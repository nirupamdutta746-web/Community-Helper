import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7jaOzlsNuqySCmQOaaqebBab4kZdoGR8",
  authDomain: "community-helper-f3348.firebaseapp.com",
  projectId: "community-helper-f3348",
  storageBucket: "community-helper-f3348.firebasestorage.app",
  messagingSenderId: "854784315367",
  appId: "1:854784315367:web:72c0cc51178787f8a53742",
  measurementId: "G-CWT2YH8V7V"
};
const app = initializeApp(firebaseConfig);  
export const auth = getAuth(app);
export const db = getFirestore(app);