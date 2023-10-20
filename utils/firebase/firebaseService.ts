import {initializeApp, getApps} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1NtblJ2ZnlgDzJcG5BgkzO0UkZ17zz-Q",
  authDomain: "controle-de-estoque-fire7.firebaseapp.com",
  projectId: "controle-de-estoque-fire7",
  storageBucket: "controle-de-estoque-fire7.appspot.com",
  messagingSenderId: "576082113487",
  appId: "1:576082113487:web:7034e4dbf6a073672898ba"
};
const firebase = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);