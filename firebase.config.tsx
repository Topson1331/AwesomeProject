// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhGy1o7P5FjxGrRlA_kzpB2N-DOBHlmDY",
  authDomain: "moonlit-shadow-287706.firebaseapp.com",
  projectId: "moonlit-shadow-287706",
  storageBucket: "moonlit-shadow-287706.appspot.com",
  messagingSenderId: "1001179819295",
  appId: "1:1001179819295:web:7751e72de770938e55d42a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
