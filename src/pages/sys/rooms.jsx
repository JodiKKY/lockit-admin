import { AssignRoom } from "@/components/AssignRoom/AssignRoom";
import { EditRoom } from "@/components/AssignRoom/ViewRoomDetails";
import Loader from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRooms } from "@/context/rooms-context";

import { useEffect, useState } from "react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]


function RoomsPage() {
  const { rooms, loading,fetchRooms} = useRooms();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchByOccupant, setSearchByOccupant] = useState(false);

  if (loading) return <Loader variant="secondary" />;

  useEffect(()=>{fetchRooms()},[])
  return (
  <div className=" w-full">
    <div className=" w-full flex justify-between">
    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
      Rooms
        </h3>
  <AssignRoom/>
    </div>
    <Table>
      <TableCaption>List of Rooms.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rooms</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned to</TableHead>
          <TableHead className="text-right">Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((item) => (
          <TableRow key={item.RoomId}>
            <TableCell className="font-medium">{item.RoomNum}</TableCell>
            <TableCell>{item.isAssigned? (        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-yellow-500">
          <circle r={3} cx={3} cy={3} />
        </svg>
    Occupied
      </span>):(   <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
        <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-blue-500">
          <circle r={3} cx={3} cy={3} />
        </svg>
  Available
      </span>)}</TableCell>
            <TableCell>{item?.isAssignedTo ? (<p className=" font-semibold text-base">{item?.isAssignedTo}</p>): <p className=" text-xs">Not Assigned</p>}</TableCell>
            <TableCell className="text-right">{item.isAssigned ? (<EditRoom data={item}/>):"No Action"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
  );
}

export default RoomsPage;


