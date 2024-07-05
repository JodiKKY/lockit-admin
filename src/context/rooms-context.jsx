import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const RoomsContext = createContext();

export const useRooms = () => useContext(RoomsContext);

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollectionRef = collection(db, "rooms");
        const roomsQuery = query(
          roomsCollectionRef,
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
          const roomsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRooms(roomsData);
          setLoading(false);
        });

        // Clean up listener on unmount or if component re-renders
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []); // Empty dependency array to ensure it fetches once

  const value = { rooms, loading };

  return (
    <RoomsContext.Provider value={value}>
      {!loading && children}
    </RoomsContext.Provider>
  );
};
