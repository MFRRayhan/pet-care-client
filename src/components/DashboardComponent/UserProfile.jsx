import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  LuFingerprint,
  LuShield,
  LuClock,
  LuArrowUpRight,
} from "react-icons/lu";
import { AuthContext } from "@/context/AuthContext";
import { Link } from "react-router";

const UserProfile = () => {
  const { user } = useContext(AuthContext);

  const userData = {
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName || "Guardian",
    photoURL:
      user?.photoURL ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    createdAt: user?.metadata?.creationTime,
    lastLoginAt: user?.metadata?.lastSignInTime,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-12 px-4"
    >
      {/* 1. MASSIVE TYPOGRAPHY HEADER */}
      <header className="border-b border-border pb-20 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">
                Identity Registry
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
              Guardian <br />
              <span className="text-primary italic">
                {userData.displayName.split(" ")[0]}.
              </span>
            </h1>
          </div>

          <div className="flex gap-16 h-fit py-2">
            <div className="space-y-1">
              <p className="text-4xl font-serif italic leading-none">VIP</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
                Access Level
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-serif italic leading-none">12</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
                Total Saves
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. OPEN-AIR CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* LEFT: Portrait (The only "contained" element) */}
        <div className="lg:col-span-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] grayscale hover:grayscale-0 transition-all duration-1000 shadow-2xl">
            <img
              src={userData.photoURL}
              className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              alt={userData.displayName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="mt-8 px-4 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
              Portrait 01
            </p>
            {/* <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
              Update Image
            </button> */}
          </div>
        </div>

        {/* RIGHT: The Editorial List */}
        <div className="lg:col-span-8 space-y-20">
          {/* Section: Credentials */}
          <div className="space-y-12">
            <div className="flex items-center gap-6">
              <LuFingerprint className="text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">
                Primary Credentials
              </h3>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12">
              <ProfileField label="Full Name" value={userData.displayName} />
              <ProfileField label="Registry Email" value={userData.email} />
              <ProfileField
                label="Guardian Since"
                value={formatDate(userData.createdAt)}
              />
              <ProfileField
                label="Last Check-in"
                value={formatDate(userData.lastLoginAt)}
              />
            </div>
          </div>

          {/* Section: Technical Key */}
          <div className="pt-12 border-t border-border space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 italic">
                System Identity Key
              </h3>
              <LuShield size={16} className="opacity-20" />
            </div>
            <p className="text-xs font-mono opacity-40 break-all tracking-tighter">
              {userData.uid}
            </p>
          </div>

          {/* CTA / Action Row */}
          <div className="flex flex-col md:flex-row gap-8 pt-12">
            <Link
              to="/dashboard/settings"
              className="group flex items-center justify-between p-8 border border-border rounded-3xl hover:border-foreground transition-all flex-1"
            >
              <div>
                <p className="text-xl font-serif italic leading-none">
                  Modify Profile
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 mt-2">
                  Personalize your identity
                </p>
              </div>
              <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>

            <div className="p-8 bg-surface-alt rounded-3xl flex-1 border border-transparent">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">
                Security Note
              </p>
              <p className="text-xs leading-relaxed text-foreground/50 font-medium">
                Your profile is encrypted and synced with the Sanctuary Global
                Ledger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Boutique Field Atom ---
const ProfileField = ({ label, value }) => (
  <div className="space-y-2 group cursor-default">
    <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20 group-hover:text-primary transition-colors">
      {label}
    </p>
    <p className="text-2xl font-serif italic text-foreground tracking-tight">
      {value}
    </p>
  </div>
);

export default UserProfile;
