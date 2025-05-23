import { Activity, DoorOpen, LayoutDashboard } from "lucide-react";

export const NAVBAR_LINKS = [
  {
    id: 0,
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard />,
  },
  {
    id: 1,
    title: "Rooms",
    href: "/rooms",
    icon: <DoorOpen />,
  },
  {
    id: 2,
    title: "Activity",
    href: "/activity",
    icon: <Activity />,
  },
];
