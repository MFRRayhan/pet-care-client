import React, { useEffect, useState, useContext } from "react";
import { FiMenu, FiLogOut, FiX, FiAlertTriangle } from "react-icons/fi";
import { NavLink, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiPlusCircle,
  FiList,
  FiCheckSquare,
  FiHeart,
  FiDollarSign,
  FiShield,
  FiUsers,
  FiGrid,
} from "react-icons/fi";

import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import useRole from "@/hooks/useRole";

const Dashboard = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [role] = useRole();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoutAction = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/logout`,
        {},
        { withCredentials: true },
      );
      signOutUser();
    } catch (err) {
      signOutUser();
    } finally {
      setShowLogoutModal(false);
    }
  };

  const menuGroups = [
    {
      title: "Navigation",
      links: [
        { to: "/", icon: <FiHome />, label: "Sanctuary Home" },
        { to: "/dashboard", icon: <FiGrid />, label: "Insights" },
        { to: "profile", icon: <FiUser />, label: "Guardian Identity" },
      ],
    },
    {
      title: "Pet Registry",
      links: [
        { to: "add-pet", icon: <FiPlusCircle />, label: "Add Resident" },
        { to: "my-added-pets", icon: <FiList />, label: "The Collection" },
        {
          to: "adoption-requests",
          icon: <FiCheckSquare />,
          label: "New Custodians",
        },
      ],
    },
    {
      title: "Financials",
      links: [
        {
          to: "create-donation-campaign",
          icon: <FiDollarSign />,
          label: "Start Funding",
        },
        {
          to: "my-donation-campaigns",
          icon: <FiHeart />,
          label: "My Portfolios",
        },
        {
          to: "my-donations",
          icon: <FiCheckSquare />,
          label: "Philanthropy Log",
        },
      ],
    },
    ...(role === "admin"
      ? [
          {
            title: "Super Admin",
            links: [
              {
                to: "admin-dashboard",
                icon: <FiShield />,
                label: "Global Metrics",
              },
              {
                to: "admin/allusers",
                icon: <FiUsers />,
                label: "Human Registry",
              },
              {
                to: "admin/allpets",
                icon: <FiList />,
                label: "Pet Masterlist",
              },
              {
                to: "admin/alldonation",
                icon: <FiDollarSign />,
                label: "Global Giving",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* 1. SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-80" : "w-0 lg:w-28"
        } relative h-full bg-surface-alt border-r border-border transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col z-50`}
      >
        {/* Branding */}
        <div className="h-28 flex items-center px-8 border-b border-border/50">
          <div className="flex flex-col">
            {sidebarOpen ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                  The Sanctuary
                </span>
                <h2 className="text-2xl font-serif italic tracking-tighter text-foreground">
                  Paws <span className="text-primary">&</span> Play.
                </h2>
              </motion.div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Navigation Content - ADDED: data-lenis-prevent */}
        <nav
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar"
        >
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              {sidebarOpen && (
                <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                  {group.title}
                </p>
              )}
              <div className="space-y-2">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end
                    className={({ isActive }) =>
                      `group flex items-center gap-5 px-5 py-4 rounded-[2rem] transition-all duration-500 ${
                        isActive
                          ? "bg-foreground text-background shadow-2xl shadow-foreground/10"
                          : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }`
                    }
                  >
                    <span className="text-xl shrink-0 transition-transform group-hover:scale-110 group-active:scale-95">
                      {link.icon}
                    </span>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-[11px] font-black uppercase tracking-widest font-sans"
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-border/50 bg-background/30 backdrop-blur-sm">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-5 px-5 py-4 text-muted-foreground hover:text-red-500 hover:bg-red-50/50 rounded-[2rem] transition-all cursor-pointer group"
          >
            <FiLogOut
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            {sidebarOpen && (
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Exit System
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-background relative">
        <header className="h-28 flex items-center justify-between px-10 md:px-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-14 h-14 flex items-center justify-center bg-surface-alt text-foreground rounded-full hover:bg-primary hover:text-white transition-all duration-500 cursor-pointer shadow-sm border border-border"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <div className="hidden md:flex flex-col">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground leading-none mb-2">
                Oversight Panel
              </p>
              <h1 className="text-3xl font-serif italic tracking-tighter text-foreground capitalize leading-none">
                {location.pathname.split("/").pop()?.replace("-", " ") ||
                  "Summary"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col text-right">
              <p className="text-[11px] font-black text-foreground uppercase tracking-widest leading-none">
                {user?.displayName?.split(" ")[0]}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mt-2">
                {role === "admin" ? "Master Architect" : "Sanctuary Member"}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border border-border p-1.5 hover:border-primary transition-colors duration-500 group cursor-pointer">
              <img
                src={user?.photoURL}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </header>

        {/* MAIN: ADDED: data-lenis-prevent */}
        <main
          data-lenis-prevent
          className="flex-1 overflow-y-auto bg-background boutique-scroll"
        >
          <div className="max-w-7xl mx-auto p-8 md:p-16 lg:p-20">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>

      {/* BOUTIQUE LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-background max-w-sm w-full rounded-[3.5rem] p-12 text-center shadow-2xl border border-border"
            >
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 bg-surface-alt text-primary">
                <FiAlertTriangle size={36} />
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4 text-foreground">
                Taking a nap?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-10 italic">
                Your session is about to end. We look forward to your return to
                the sanctuary.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogoutAction}
                  className="w-full py-5 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 transition-all cursor-pointer shadow-xl shadow-foreground/5"
                >
                  Terminate Session
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Stay in Sanctuary
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
