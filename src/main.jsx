import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/auth-context.jsx";
import "./index.css";
import router from "./router/router.jsx";
import { RoomsProvider } from "./context/rooms-context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RoomsProvider>
        <RouterProvider router={router} />
        <Toaster />
      </RoomsProvider>
    </AuthProvider>
  </React.StrictMode>
);
