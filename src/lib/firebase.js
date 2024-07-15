import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqBN0AQTD_gt6-kyDaaNeir9oywEcUrYk",
  authDomain: "lockit-3b679.firebaseapp.com",
  projectId: "lockit-3b679",
  storageBucket: "lockit-3b679.appspot.com",
  messagingSenderId: "1002466022801",
  appId: "1:1002466022801:web:dee8670ee076a2e8dbb630",
  measurementId: "G-GPJGX4ENHG"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const userRef = collection(db,"Users")
const RoomRef = collection(db,"Rooms")



export { auth, db ,userRef,RoomRef};
export default app;

