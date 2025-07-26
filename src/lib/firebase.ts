
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDldETQGByoRgmYshMJ84AnfpKXpqAvsEM",
  authDomain: "compass-6b774.firebaseapp.com",
  projectId: "compass-6b774",
  storageBucket: "compass-6b774.appspot.com",
  messagingSenderId: "1029205662249",
  appId: "1:1029205662249:web:336024502c69375042da38"
};

// This robust singleton pattern prevents re-initialization and is Next.js friendly
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
