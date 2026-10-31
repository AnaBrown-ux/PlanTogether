import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAeTQMUVklVnYk5wJKirZ75dQIePjI5m44",
  authDomain: "plantogether-1ccf5.firebaseapp.com",
  databaseURL: "https://plantogether-1ccf5-default-rtdb.firebaseio.com",
  projectId: "plantogether-1ccf5",
  storageBucket: "plantogether-1ccf5.firebasestorage.app",
  messagingSenderId: "989708728120",
  appId: "1:989708728120:web:907523c7078a45ccb033cd"
};

initializeApp(firebaseConfig);

export const db = getDatabase();
