import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuth } from "@/context/auth-context";
import { useRooms } from "@/context/rooms-context";
import { RoomRef } from "@/lib/firebase";
import { addDoc, getDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, BedIcon, HomeIcon, MailIcon, TextCursor, TriangleAlert, User2 } from "lucide-react";
import { useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Loader2 } from "lucide-react";

export const description = "An interactive bar chart";

const chartData = [
  { month: "January", "Check-In": 186, "Check-Out": 80 },
  { month: "February", "Check-In": 305, "Check-Out": 200 },
  { month: "March", "Check-In": 237, "Check-Out": 120 },
  { month: "April", "Check-In": 73, "Check-Out": 190 },
  { month: "May", "Check-In": 209, "Check-Out": 130 },
  { month: "June", "Check-In": 214, "Check-Out": 140 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const Rooms = [];
for (let i = 1; i <= 20; i++) {
  Rooms.push({
    RoomId: `${Math.ceil(Math.random()*10000000)}`,
    RoomNum: `Room ${i}`,
    isAssigned: false,
    isAssignedTo: ""
  });
}

console.log(Rooms)

export default function Dashboard() {
  const { currentUserDetails, fetchUserDetails,loading:isFetching,setLoading:setIsFetching} = useAuth();
  const populateRooms = async () => {
    try {
      const promises = Rooms.map((room) => addDoc(RoomRef, room));
      await Promise.all(promises);
      console.log('Rooms populated successfully.');
    } catch (error) {
      console.error('Error populating rooms:', error);
    }
  }

  useEffect(() => {
  fetchUserDetails(currentUserDetails?.uid)
  }, []);


  console.log(currentUserDetails);

  const stats = [
    {
      id: 1,
      name: "Total Rooms",
      stat: `${currentUserDetails?.hotelCapacity}`,
      icon: User2,
      change: "122",
      changeType: "increase",
    },
    {
      id: 2,
      name: "Vacancies",
      stat: `${currentUserDetails?.hotelCapacity - currentUserDetails?.bookedRooms}`,
      icon: MailIcon,
      change: "5.4%",
      changeType: "increase",
    },
    {
      id: 3,
      name: "Total Present",
      stat: `${currentUserDetails?.bookedRooms}`,
      icon: TextCursor,
      change: "3.2%",
      changeType: "decrease",
    },
  ];

  const { rooms,loading } = useRooms();


  return (
    <div>
      <div className="w-full">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Dashboard
        </h3>
 {
  loading || isFetching ?(<div className=" w-full h-[50vh] flex justify-center items-center">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  </div>):(<>
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map((item) => (
      <div
        key={item.id}
        className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
      >
        <dt>
          <div className="absolute rounded-md bg-primary p-3">
            <item.icon
              className="h-6 w-6 text-white"
              aria-hidden="true"
            />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">
            {item.name}
          </p>
        </dt>
        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
          <p className="text-2xl font-semibold text-gray-900">
            {item.stat}
          </p>
          <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
                <span className="sr-only"> {item.name} stats</span>
              </a>
            </div>
          </div>
        </dd>
      </div>
    ))}
  

  </dl>
  <div className=" mt-10 ">
  <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
Rooms
  </h3>
  <div className="w-full grid grid-cols-3 lg:grid-cols-10 gap-2">

      {rooms?.map((item) => {
        if (item?.isAssigned === false) {
          return (
            <div key={item.RoomId} className="w-24 h-24 rounded-xl border-[1px]  flex flex-col justify-center items-center">
            <BedIcon color="#2563eb"/>
     <p className=" text-primary text-xs">       {item.RoomNum}</p>
            </div>
          );
          
        }
     else {
      return (
        (
          <div key={item.RoomId} className="w-24 h-24 rounded-xl border-[1px]  flex flex-col justify-center items-center">
          <TriangleAlert color="#854d0e"/>
   <p className=" text-yellow-800 font-semibold text-xs">{item.RoomNum}</p>
   <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
  Occupied
</span>
          </div>
        )
      )
     }
      })}
    </div>
    </div>
    </>)
 }
      </div>
    </div>
  );
}


/*       <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 lg:col-span-3">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Recent Activity
            </h3>
            <br />
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="Check-In"
                  fill="var(--color-desktop)"
                  radius={4}
                />
                <Bar
                  dataKey="Check-Out"
                  fill="var(--color-mobile)"
                  radius={2}
                />
              </BarChart>
            </ChartContainer>
          </div>*/