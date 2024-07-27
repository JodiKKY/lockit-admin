import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Import the getDatabase function

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqBN0AQTD_gt6-kyDaaNeir9oywEcUrYk",
  authDomain: "lockit-3b679.firebaseapp.com",
  projectId: "lockit-3b679",
  storageBucket: "lockit-3b679.appspot.com",
  messagingSenderId: "1002466022801",
  appId: "1:1002466022801:web:dee8670ee076a2e8dbb630",
  measurementId: "G-GPJGX4ENHG",
  databaseURL: "https://lockit-3b679-default-rtdb.europe-west1.firebasedatabase.app/" // Add the database URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // Initialize the Realtime Database
const userRef = collection(db, "Users");
const RoomRef = collection(db, "Rooms");

export { auth, db, rtdb, userRef, RoomRef }; // Export the rtdb instance
export default app;
