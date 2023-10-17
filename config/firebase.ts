// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get } from "http";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDyoIp_n8N4RYOsh9OhGLYqQEJVJ9zJvI",
  authDomain: "kanban-4c732.firebaseapp.com",
  projectId: "kanban-4c732",
  storageBucket: "kanban-4c732.appspot.com",
  messagingSenderId: "204460859673",
  appId: "1:204460859673:web:ea956ce68e6145e2c52588",
  measurementId: "G-F3KJBE0NF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth}