import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWaelF-FXrvXTem4qZab6446ljjp_M5zM",
  authDomain: "next-base-9326b.firebaseapp.com",
  projectId: "next-base-9326b",
  storageBucket: "next-base-9326b.appspot.com",
  messagingSenderId: "242700469728",
  appId: "1:242700469728:web:58e204744fa1488fc0d785",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
