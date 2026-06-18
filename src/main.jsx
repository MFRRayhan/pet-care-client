import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./app/Routes/Routes";
import AuthProvider from "./context/AuthProvider";
import { SmoothScrollProvider } from "./context/SmoothScrollContext";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SmoothScrollProvider>
          <RouterProvider router={router} />
        </SmoothScrollProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
