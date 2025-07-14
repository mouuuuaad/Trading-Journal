import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDldETQGByoRgmYshMJ84AnfpKXpqAvsEM",
  authDomain: "compass-6b774.firebaseapp.com",
  projectId: "compass-6b774",
  storageBucket: "compass-6b774.appspot.com",
  messagingSenderId: "1029205662249",
  appId: "1:1029205662249:web:336024502c69375042da38"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
