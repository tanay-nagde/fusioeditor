// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB28b_R9ZtVEjfVocPdoPnUq3ZdYeBk7YM",
  authDomain: "fusio-realtimecanvas.firebaseapp.com",
  databaseURL: "https://fusio-realtimecanvas-default-rtdb.firebaseio.com",
  projectId: "fusio-realtimecanvas",
  storageBucket: "fusio-realtimecanvas.firebasestorage.app",
  messagingSenderId: "210348306091",
  appId: "1:210348306091:web:a85a2bf2f82e0c1ea891ee",
  measurementId: "G-6FLNZ6HEQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db =  getDatabase(app);

const analytics = getAnalytics(app);
export { db };