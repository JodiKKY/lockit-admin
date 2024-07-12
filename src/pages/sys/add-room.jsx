import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z
  .object({
    roomName: z.string().min(1, {
      message: "Room name is required.",
    }),
    isOccupied: z.boolean().optional(),
    occupantName: z.string().optional(),
    occupantEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine((data) => !data.isOccupied || data.occupantName, {
    message: "Occupant name is required if the room is occupied.",
    path: ["occupantName"],
  })
  .refine((data) => !data.isOccupied || data.occupantEmail, {
    message: "Occupant email is required if the room is occupied.",
    path: ["occupantEmail"],
  })
  .refine((data) => !data.isOccupied || data.startDate, {
    message: "Start date is required if the room is occupied.",
    path: ["startDate"],
  })
  .refine((data) => !data.isOccupied || data.endDate, {
    message: "End date is required if the room is occupied.",
    path: ["endDate"],
  });

function AddNewRoom() {
  const { currentUser, currentUserDetails, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });


  const onSubmit = async (data) => {
    setIsSubmittingForm(true);
    setError("");
    try {
      const roomData = {
        name: data.roomName,
        status: data.isOccupied ? "occupied" : "empty",
        occupant_name: data.isOccupied ? data.occupantName : "",
        start_date: data.startDate || null,
        end_date: data.endDate || null,
        createdAt: serverTimestamp(),
        createdBy: {
          name: currentUserDetails.name,
          email: currentUserDetails.email,
          uid: currentUserDetails.uid,
        },
      };
      const roomRef = collection(db, "rooms");
      await addDoc(roomRef, roomData);
      reset("");
      navigate("/rooms");
    } catch (error) {
      console.log(error);
      setError("Failed to create the room. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader variant="secondary" />
      ) : (
        <div>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="my-5">
                <h5 className="text-primary">Create Room</h5>
                <p className="text-neutral-500">
                  Enter room details to create a new room
                </p>
              </div>
              {error && (
                <div className="mb-4 text-sm bg-red-200 px-4 py-2 rounded-md">
                  <p className="text-center">{error}</p>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <Input type="text" {...register("roomName")} />
                {errors.roomName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.roomName.message}
                  </p>
                )}
              </div>
              <div className="mb-4 flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Is Occupied?
                </label>
                <Controller
                  name="isOccupied"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  )}
                />
              </div>
              {watch("isOccupied") && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Occupant Name
                    </label>
                    <Input type="text" {...register("occupantName")} />
                    {errors.occupantName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.occupantName.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Occupant Email
                    </label>
                    <Input type="email" {...register("occupantEmail")} />
                    {errors.occupantEmail && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.occupantEmail.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <p>This room will be occupied from:</p>
                    <hr className="mb-3" />
                    <div className="mb-4">
                      <div className="w-full mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Controller
                          name="startDate"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          )}
                        />
                        {errors.startDate && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.startDate.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          )}
                        />
                        {errors.endDate && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.endDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Button
                type="submit"
                className="w-full"
                size={"sm"}
                disabled={isSubmittingForm}
              >
                {isSubmittingForm ? <Loader /> : <div>Create Room</div>}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddNewRoom;
