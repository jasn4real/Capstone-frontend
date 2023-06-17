// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWWnJxzLQPMxNenBzGluMM7OsR_7r5A_g",
  authDomain: "binary-mind.firebaseapp.com",
  projectId: "binary-mind",
  storageBucket: "binary-mind.appspot.com",
  messagingSenderId: "288583021962",
  appId: "1:288583021962:web:5072555f29c189b365c473",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);