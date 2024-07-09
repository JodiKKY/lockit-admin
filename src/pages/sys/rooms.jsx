import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/context/rooms-context";
import Loader from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, TrashIcon } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function RoomsPage() {
  const { rooms, loading } = useRooms();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchByOccupant, setSearchByOccupant] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const roomNameMatch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const occupantNameMatch = room.occupant_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return (
      (searchByOccupant && room.status === "occupied" && occupantNameMatch) ||
      (!searchByOccupant && roomNameMatch)
    );
  });

  const handleDeleteRoom = async (roomId) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await deleteDoc(roomRef);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  if (loading) return <Loader variant="secondary" />;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Rooms
        </h3>
        <Link to={`/rooms/new`}>
          <Button>Add Room</Button>
        </Link>
      </div>
      <div className="my-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search for a room or occupant"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2 w-3/4"
        />
        <label className="flex items-center gap-2 w-1/4">
          <Checkbox
            type="checkbox"
            checked={searchByOccupant}
            onCheckedChange={() => setSearchByOccupant(!searchByOccupant)}
          />
          <p>Search by Occupant</p>
        </label>
      </div>
      <div>
        {filteredRooms.length === 0 ? (
          <p className="text-center text-gray-500">Room not found</p>
        ) : (
          <Table>
            <TableCaption>A list of your rooms.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="table-cell">ID</TableHead>
                <TableHead className="table-cell">Name</TableHead>
                <TableHead className="table-cell">Status</TableHead>
                <TableHead className="table-cell">Occupant Name</TableHead>
                <TableHead className="table-cell">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="table-cell">{room.id}</TableCell>
                  <TableCell className="table-cell">{room.name}</TableCell>
                  <TableCell className="table-cell">
                    {room.status === "empty" ? "Empty" : "Occupied"}
                  </TableCell>
                  <TableCell className="table-cell">
                    {room.occupant_name === "" ? "None" : room.occupant_name}
                  </TableCell>
                  <TableCell className="table-cell">
                    <div className="flex items-center gap-2">
                      <Link to={`/rooms/${room.id}`}>
                        <EyeIcon />
                      </Link>
                      <Button
                        onClick={() => handleDeleteRoom(room.id)}
                        variant="danger"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default RoomsPage;
