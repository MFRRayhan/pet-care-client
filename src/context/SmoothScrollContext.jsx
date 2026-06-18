import React, { createContext, useEffect, useRef } from "react";
import Lenis from "lenis";

export const LenisContext = createContext();

export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis with Boutique Settings
    const lenis = new Lenis({
      duration: 1.5, // Slightly slower for luxury feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Usually better to keep native touch on mobile
      infinite: false,
    });

    lenisRef.current = lenis;

    // 2. Animation Loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};
