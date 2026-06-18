import React, { useContext, useState } from "react";
import { Menu, User, PawPrint, X, MoveUpRight } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { Link, NavLink } from "react-router";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State to handle toggle

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pets", label: "Adopt" },
    { to: "/donations", label: "Campaigns" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    { to: "/about-us", label: "About" },
  ];

  // Animation variants for the mobile menu
  const menuVariants = {
    closed: { opacity: 0, y: "-100%" },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[100] w-full bg-background/80 backdrop-blur-md border-b border-border/50 ">
        <div className="max-w-7xl mx-auto  flex items-center justify-between h-24">
          {/* LOGO */}
          <Link
            to="/"
            className="shrink-0 transition-transform duration-500 hover:scale-105"
          >
            <Logo />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-1 bg-surface-alt/50 p-1.5 rounded-[2rem] border border-border/20">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative px-6 py-2.5 group transition-all duration-500"
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-serif relative z-10 text-[15px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 
                      ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                      >
                        <PawPrint
                          className="w-3.5 h-3.5 text-primary"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute inset-0 bg-background rounded-full shadow-sm z-0 border border-border/50"
                      />
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* AUTH & TOGGLE */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {/* auth logic */}
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-10 h-10 block rounded-full overflow-hidden border border-border shadow-sm"
                >
                  <img
                    src={user.photoURL}
                    alt="User Profile Picture"
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="group flex items-center gap-3 bg-surface-dark pl-6 pr-2 py-2 rounded-full hover:bg-primary transition-all duration-500 shadow-lg shadow-black/5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-foreground">
                    Login
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-colors">
                    <User size={16} />
                  </div>
                </Link>
              )}
            </div>

            {/* MOBILE TOGGLE BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-full bg-surface-alt text-foreground border border-border/50 transition-all active:scale-90"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[90] bg-background pt-32 px-8 flex flex-col gap-8 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <p className="text-primary font-bold text-[10px] uppercase tracking-[0.5em] mb-4">
                Navigation
              </p>
              {navLinks.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={item.to}
                >
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center group py-4 border-b border-border/40"
                  >
                    <span className="text-5xl font-serif italic text-foreground tracking-tighter">
                      {item.label}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <MoveUpRight size={16} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Auth Button */}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-auto mb-12 bg-foreground text-background py-6 rounded-2xl flex items-center justify-center gap-4"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
                  Get Started
                </span>
                <User size={16} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
