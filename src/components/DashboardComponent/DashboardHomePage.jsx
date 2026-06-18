import React, { useContext } from "react";
import {
  FiPlus,
  FiArrowRight,
  FiHeart,
  FiActivity,
  FiArrowUpRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "@/context/AuthContext";

const DashboardHomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-24">
      {/* 1. MINIMALIST OVERVIEW */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">
              Status: Active Guardian
            </span>
          </div>
          <h1 className="text-7xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Sanctuary <br />
            <span className="text-primary">
              {user?.displayName?.split(" ")[0] || "Entry"}.
            </span>
          </h1>
        </div>

        <div className="flex gap-16 border-l border-border pl-12 h-fit py-2">
          <StatBlock label="Active Adoptions" value="08" />
          <StatBlock label="Monthly Impact" value="14k" />
        </div>
      </header>

      {/* 2. THE PRIMARY NAVIGATION (VERTICAL FLOW) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left: The Big Action */}
        <div className="lg:col-span-7">
          <Link
            to="/dashboard/add-pet"
            className="group block relative border-b-2 border-foreground pb-12 overflow-hidden"
          >
            <div className="flex justify-between items-end">
              <div className="space-y-6">
                <h2 className="text-5xl font-serif italic tracking-tight">
                  Introduce a new life.
                </h2>
                <p className="max-w-md text-sm text-foreground/50 leading-relaxed">
                  Begin the registry process for a new companion. Every entry is
                  a step toward a forever home.
                </p>
              </div>
              <div className="w-20 h-20 bg-foreground text-background rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <FiPlus size={32} />
              </div>
            </div>
            {/* Hover underline effect */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700"></div>
          </Link>

          <div className="mt-12 flex gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Priority Task
            </span>
            <div className="h-[1px] flex-1 bg-border self-center"></div>
          </div>
        </div>

        {/* Right: The Grid Menu */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-1">
          <MenuRow
            to="/dashboard/my-added-pets"
            label="Management"
            sub="The Registry"
          />
          <MenuRow
            to="/dashboard/my-donations"
            label="Patronage"
            sub="Donation Ledger"
          />
          <MenuRow
            to="/dashboard/adoption-requests"
            label="Inquiries"
            sub="Review Requests"
          />
          <MenuRow
            to="/dashboard/profile"
            label="Security"
            sub="Profile & Identity"
          />
        </div>
      </section>

      {/* 3. RECENT ACTIVITY PREVIEW */}
      <section className="space-y-12">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">
            System Insights
          </h3>
          <div className="h-[1px] flex-1 mx-12 bg-border"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <ActivityItem
            icon={<FiHeart className="text-rose-500" />}
            title="Last Donation"
            desc="BDT 5,000 to Cat Shelter"
            time="2 days ago"
          />
          <ActivityItem
            icon={<FiActivity className="text-blue-500" />}
            title="Listing Update"
            desc="Milo the Golden Retriever"
            time="4 hours ago"
          />
          <ActivityItem
            icon={<FiArrowUpRight className="text-amber-500" />}
            title="Account Security"
            desc="Logged in from Chrome"
            time="Just now"
          />
        </div>
      </section>
    </div>
  );
};

// --- MINIMALIST ATOMS ---

const StatBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-4xl font-serif italic leading-none">{value}</p>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
      {label}
    </p>
  </div>
);

const MenuRow = ({ to, label, sub }) => (
  <Link
    to={to}
    className="group flex items-center justify-between py-6 border-b border-border hover:px-4 transition-all duration-500"
  >
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-primary/60 mb-1">
        {label}
      </p>
      <h4 className="text-2xl font-serif italic text-foreground group-hover:text-primary transition-colors">
        {sub}
      </h4>
    </div>
    <FiArrowRight
      size={20}
      className="text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-2"
    />
  </Link>
);

const ActivityItem = ({ icon, title, desc, time }) => (
  <div className="space-y-4">
    <div className="w-10 h-10 bg-surface-alt rounded-xl flex items-center justify-center text-lg">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-bold text-foreground">{title}</h5>
      <p className="text-xs text-foreground/50 mt-1">{desc}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-3">
        {time}
      </p>
    </div>
  </div>
);

export default DashboardHomePage;
