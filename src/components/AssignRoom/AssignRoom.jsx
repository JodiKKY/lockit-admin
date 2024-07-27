import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRooms } from "@/context/rooms-context";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import RTDB functions
import { userRef, RoomRef, db, rtdb } from "@/lib/firebase"; // Import RTDB instance

import toast from "react-hot-toast";

export function AssignRoom() {
  const { rooms, fetchRooms } = useRooms();
  console.log("here", rooms);

  const { register, handleSubmit, setValue } = useForm();
  const [selectedRoom, setSelectedRoom] = useState({ RoomId: "", RoomNum: "" });
  const [selectedGuest, setSelectedGuest] = useState({ userId: "", name: "" });
  const [guests, setGuests] = useState([]);

  const onSubmit = async (data) => {
    try {
      const RoomQuery = query(RoomRef, where("RoomId", "==", data.room.RoomId));
      const RoomSnapShot = await getDocs(RoomQuery);
      const roomDocId = RoomSnapShot.docs[0].id;
      const docRef = doc(db, "Rooms", roomDocId);

      const UserQuery = query(
        userRef,
        where("userId", "==", data.guest.userId)
      );
      const UserSnapshot = await getDocs(UserQuery);
      const UserDocId = UserSnapshot.docs[0].id;
      const UserDocRef = doc(db, "Users", UserDocId);

      const adminQuery = query(userRef, where("role", "==", "admin"));
      const AdminSnapshot = await getDocs(adminQuery);
      const adminID = AdminSnapshot.docs[0].id;
      const adminRef = doc(db, "Users", adminID);

      await updateDoc(adminRef, {
        bookedRooms: increment(1),
      });

      await updateDoc(docRef, {
        isAssigned: true,
        isAssignedTo: data.guest.name,
      });

      await updateDoc(UserDocRef, {
        roomNumber: data.room.RoomNum,
        roomId: data.room.RoomId,
      });

      // Update RTDB with the assigned room details
      const roomAssignmentRef = ref(rtdb, `roomAssignments/${data.room.RoomId}`);
      await set(roomAssignmentRef, {
        roomNumber: data.room.RoomNum,
        roomId: data.room.RoomId,
        assignedTo: data.guest.name,
        guestId: data.guest.userId,
      });

      toast.success("Room and User updated successfully");
    } catch (error) {
      console.log("Error updating room:", error);
      toast.error("Failed to assign room");
    } finally {
      fetchRooms();
    }
  };

  const handleRoomSelect = (value) => {
    const room = rooms.find((room) => room.RoomId === value);
    setSelectedRoom({ RoomId: room.RoomId, RoomNum: room.RoomNum });
    setValue("room", { RoomId: room.RoomId, RoomNum: room.RoomNum }); // Register the selected value with react-hook-form
  };
  console.log(selectedRoom);

  const handleGuestSelect = (value) => {
    const guest = guests.find((guest) => guest.userId === value);
    setSelectedGuest({ userId: guest.userId, name: guest.name });
    setValue("guest", { userId: guest.userId, name: guest.name }); // Register the selected value with react-hook-form
  };

  const getGuests = async () => {
    try {
      //use roomId === ""
      const q = query(userRef, where("isIn", "==", false));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGuests(users);
    } catch (error) {
      console.log("Error fetching guests", error);
    }
  };

  useEffect(() => {
    getGuests();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-3 bg-primary w-max rounded-xl text-white">
          Assign Room
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign a room</DialogTitle>
          <DialogDescription>Assign rooms here</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="room" className="text-left">
                Room:
              </Label>
              <Select onValueChange={handleRoomSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rooms</SelectLabel>
                    {rooms
                      ?.filter((item) => item.isAssigned === false)
                      .map((item, index) => (
                        <SelectItem key={index} value={item.RoomId}>
                          {item?.RoomNum}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("room", { required: true })}
                value={JSON.stringify(selectedRoom)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="guest" className="text-left">
                Guest:
              </Label>
              <Select onValueChange={handleGuestSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a guest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Guests</SelectLabel>
                    {guests.map((guest) => (
                      <SelectItem key={guest.id} value={guest.userId}>
                        {guest.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("guest", { required: true })}
                value={JSON.stringify(selectedGuest)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Assign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
