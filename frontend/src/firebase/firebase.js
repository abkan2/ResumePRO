// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjZONCGmuv7q7ioOovfBjEjI87pQBDsKw",
  authDomain: "resumepro-c6390.firebaseapp.com",
  projectId: "resumepro-c6390",
  storageBucket: "resumepro-c6390.appspot.com",
  messagingSenderId: "577374991194",
  appId: "1:577374991194:web:a57a39b0a40ad03db97963"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

