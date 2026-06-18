import React from "react";
import { Outlet } from "react-router";
import Navbar from "@/components/SharedComponent/Nabbar";
import Footer from "@/components/SharedComponent/Footer";

// Import your Lenis components
import { SmoothScrollProvider } from "@/context/SmoothScrollContext";
import ScrollReset from "@/components/SharedComponent/ScrollReset";
const RootLayout = () => {
  return (
    <SmoothScrollProvider>
      <ScrollReset />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default RootLayout;
