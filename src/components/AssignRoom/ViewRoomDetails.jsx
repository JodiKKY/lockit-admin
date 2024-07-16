import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRooms } from "@/context/rooms-context";
import { db, RoomRef ,userRef} from "@/lib/firebase";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { doc, getDocs, query, updateDoc,where,increment } from "firebase/firestore";
import { Flag, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export function EditRoom({ data }) {
  const nav= useNavigate()
  const { fetchRooms}= useRooms()
  const [loading,setLoading]= useState(false)
  const usassign = async () => {
    setLoading(true)
    try {
      const q = query(RoomRef, where("RoomId", "==", data.RoomId));
      const SnapShot = await getDocs(q);
      const snapShotID = SnapShot.docs[0].id;
      const docRef = doc(db, "Rooms", snapShotID);

      const UserQuery = query(userRef, where("name", "==", data.isAssignedTo));
      const UserSnapshot = await getDocs(UserQuery);
      const UserDocId = UserSnapshot.docs[0].id;
      const UserDocRef = doc(db, "Users", UserDocId);

      const adminQuery = query(userRef,where("role","==","admin"))
      const AdminSnapshot = await getDocs(adminQuery);
      const adminID = AdminSnapshot.docs[0].id;
      const adminRef=   doc(db, "Users", adminID);

    console.log(adminRef)
   
      await updateDoc(adminRef, {
        bookedRooms: increment(-1)
      });
      await updateDoc(docRef, {
        isAssigned: false,
        isAssignedTo: "",
      });

      await updateDoc(UserDocRef, {
        roomNumber: "",
        roomId: "",
      });
      toast.success("Room has been unassigned")

    } catch (error) {
      console.log(error)
      toast.error("Please try again later");
    }
    finally{
      setLoading(false)
    await  fetchRooms()
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-red-400 hover:bg-red-500 text-white hover:text-white"
        >
          UnAssign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unassign room</DialogTitle>
          <DialogDescription>Unassign room to create vacancy</DialogDescription>
        </DialogHeader>
        <div className=" flex flex-col items-center gap-5">
          <div className=" w-16 h-16 rounded-[50%] bg-red-100 flex justify-center items-center">
            <ExclamationTriangleIcon className=" w-10 h-10 text-red-700" />
          </div>
          <p>Are you sure you want to unassign this room?</p>
        </div>
        <DialogFooter>
          <Button onClick={usassign} type={loading ? "disabled" : "button"} className="bg-red-500 hover:bg-red-500 text-white text-center">
          {loading ? (   <Loader2 className="mr-2 h-4 w-4 animate-spin" />):"Unassign"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
