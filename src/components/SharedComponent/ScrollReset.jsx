import { useEffect, useContext } from "react";
import { useLocation } from "react-router";
import { LenisContext } from "@/context/SmoothScrollContext";

const ScrollReset = () => {
  const { pathname } = useLocation();
  const lenis = useContext(LenisContext);

  useEffect(() => {
    // 1. Reset Global Scroll (Landing Page, Login, etc.)
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // 2. Reset Dashboard Internal Scroll
    // We target the main tag you added data-lenis-prevent to earlier
    const dashboardMain = document.querySelector("main[data-lenis-prevent]");
    if (dashboardMain) {
      dashboardMain.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollReset;
