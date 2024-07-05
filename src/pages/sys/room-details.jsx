import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/context/rooms-context";
import Loader from "@/components/ui/loader";

function RoomDetailsPage() {
  const { id } = useParams();
  const { rooms, loading } = useRooms();
  const room = rooms.find((room) => room.id === id);

  if (loading) return <Loader variant="secondary" />;
  if (!room) return <p>Room not found</p>;

  return (
    <div>
      <h2>{room.name}</h2>
      <p>Status: {room.status === "empty" ? "Empty" : "Occupied"}</p>
      {room.status === "occupied" && (
        <p>Occupant Name: {room.occupant_name || "None"}</p>
      )}
      <Link to={`/rooms/${id}/edit`}>
        <Button>Edit Room</Button>
      </Link>
    </div>
  );
}

export default RoomDetailsPage;
