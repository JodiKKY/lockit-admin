import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, RoomRef } from "@/lib/firebase";

const RoomsContext = createContext();

export const useRooms = () => useContext(RoomsContext);

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRooms = async () => {
    try {

 
const response = await getDocs(RoomRef)
        const roomsData = response.docs.map((doc) => ({
     
          ...doc.data(),
        }));
        setRooms(roomsData);
        setLoading(false);
 

      // Clean up listener on unmount or if component re-renders
 
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {

    fetchRooms();
  }, []); // Empty dependency array to ensure it fetches once

  const value = { rooms, loading,fetchRooms,setLoading };

  return (
    <RoomsContext.Provider value={value}>
      { children}
    </RoomsContext.Provider>
  );
};

