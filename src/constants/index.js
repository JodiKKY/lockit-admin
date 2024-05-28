import { DoorOpen, LayoutDashboard } from "lucide-react";


// The Navbar links showing on the sidebar
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
  ];