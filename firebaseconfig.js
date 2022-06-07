// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDWEJUmyAwBZsoakZ6ZUhmdd9wSsB14YTw",
  authDomain: "designer-search-app.firebaseapp.com",
  projectId: "designer-search-app",
  storageBucket: "designer-search-app.appspot.com",
  messagingSenderId: "806423661656",
  appId: "1:806423661656:web:f360efdd96d2a6b8678e2d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();


export {auth}