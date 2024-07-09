import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { useRooms } from "@/context/rooms-context";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    roomName: z.string().min(1, {
      message: "Room name is required.",
    }),
    isOccupied: z.boolean(),
    occupantName: z.string().optional(),
  })
  .refine((data) => !data.isOccupied || data.occupantName, {
    message: "Occupant name is required if the room is occupied.",
    path: ["occupantName"],
  });

function EditRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading } = useRooms();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomDocRef = doc(db, "rooms", id);
        const roomDocSnap = await getDoc(roomDocRef);
        if (roomDocSnap.exists()) {
          const roomData = roomDocSnap.data();
          setRoom(roomData);
          setValue("roomName", roomData.name);
          setValue("isOccupied", roomData.status === "occupied");
          setValue("occupantName", roomData.occupant_name || "");
        } else {
          setError("Room not found");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        setError("Failed to fetch room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const roomRef = doc(db, "rooms", id);
      const updatedRoomData = {
        name: data.roomName,
        status: data.isOccupied ? "occupied" : "empty",
        occupant_name: data.isOccupied ? data.occupantName : "",
        updatedAt: serverTimestamp(),
      };
      await updateDoc(roomRef, updatedRoomData);
      navigate(`/rooms/${id}`);
    } catch (error) {
      console.error("Error updating room:", error);
      setError("Failed to update room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (roomsLoading || loading) return <Loader variant="secondary" />;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Edit Room Details
      </h3>
      <p className="text-neutral-500">Edit room details</p>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label>Room Name</label>
          <Input type="text" {...register("roomName")} />
          {errors.roomName && <p>{errors.roomName.message}</p>}
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label>Occupied?</label>
          <Controller
            name="isOccupied"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
            )}
          />
        </div>
        {watch("isOccupied") && (
          <div className="mb-4">
            <label>Occupant Name</label>
            <Input type="text" {...register("occupantName")} />
            {errors.occupantName && <p>{errors.occupantName.message}</p>}
          </div>
        )}
        <Button
          type="submit"
          className="w-full mb-4"
          size={"sm"}
          disabled={isSubmittingForm}
        >
          {isSubmittingForm ? <Loader /> : <div>Edit Room</div>}
        </Button>
        <Link to={`/rooms/${id}`}>
          <Button
            type="button"
            className="w-full border"
            size={"sm"}
            variant="secondary"
          >
            Cancel
          </Button>
        </Link>
      </form>
    </div>
  );
}

export default EditRoomPage;
