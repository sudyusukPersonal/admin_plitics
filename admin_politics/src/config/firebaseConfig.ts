// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6XXyfJ0oY11JLBioRoO4jniGBXnxEBWU",
  authDomain: "politics-77a64.firebaseapp.com",
  projectId: "politics-77a64",
  storageBucket: "politics-77a64.firebasestorage.app",
  messagingSenderId: "129911974973",
  appId: "1:129911974973:web:b58f16279e561afbcf8e54",
  measurementId: "G-PLBM7TFLQW",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
