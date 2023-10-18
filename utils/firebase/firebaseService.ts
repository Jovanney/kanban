import {initializeApp, getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDyoIp_n8N4RYOsh9OhGLYqQEJVJ9zJvI",
    authDomain: "kanban-4c732.firebaseapp.com",
    projectId: "kanban-4c732",
    storageBucket: "kanban-4c732.appspot.com",
    messagingSenderId: "204460859673",
    appId: "1:204460859673:web:ea956ce68e6145e2c52588",
    measurementId: "G-F3KJBE0NF6"
  };
const firebase = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);