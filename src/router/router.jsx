import AppLayout from "@/pages/app-layout";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import SignInPage from "@/pages/auth/sign-in";
import SignUpPage from "@/pages/auth/sign-up";
import VerifyCodePage from "@/pages/auth/verify-code";
import NotFound from "@/pages/not-found";
import AddNewRoom from "@/pages/sys/add-room";
import Dashboard from "@/pages/sys/dashboard";
import EditRoomPage from "@/pages/sys/edit-room";
import RoomDetailsPage from "@/pages/sys/room-details";
import RoomsPage from "@/pages/sys/rooms";
import { createBrowserRouter } from "react-router-dom";

//  This file is where you create all the routes to your project
const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/verify-code",
    element: <VerifyCodePage />,
    errorElement: <NotFound />,
  },
  {
    element: <AppLayout />,
    path: "/",
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Dashboard />,
        errorElement: <NotFound />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
        errorElement: <NotFound />,
      },
      {
        path: "rooms/:id",
        element: <RoomDetailsPage />,
        errorElement: <NotFound />,
      },
      {
        path: "rooms/:id/edit",
        element: <EditRoomPage />,
        errorElement: <NotFound />,
      },
      {
        path: "rooms/new",
        element: <AddNewRoom />,
        errorElement: <NotFound />,
      },
    ],
  },
]);

export default router;
