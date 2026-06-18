import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router";
import { AuthContext } from "@/context/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState({ users: 0, pets: 0, campaigns: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [u, p, c] = await Promise.all([
          axiosSecure.get("/users"),
          axiosSecure.get("/available-pets"),
          axiosSecure.get("/donation-campaigns"),
        ]);
        setData({
          users: u.data.length,
          pets: p.data.length,
          campaigns: c.data.campaigns.length,
        });
      } catch (e) {
        // console.error(e);
      }
    };
    fetchData();
  }, [axiosSecure]);

  return (
    <div className="min-h-screen  text-stone-900 selection:bg-stone-900 selection:text-white overflow-hidden">
      {/* 1. THE VERTICAL BRAND AXIS */}
      <div className="fixed left-12 top-0 bottom-0 w-px bg-stone-200/60 hidden lg:block" />
      <div className="fixed left-6 top-1/2 -rotate-90 origin-left hidden lg:block">
        <span className="text-[9px] font-black uppercase tracking-[0.8em] text-stone-300">
          Sanctuary.Intelligence.Systems
        </span>
      </div>

      <main className="max-w-7xl mx-auto px-10 lg:px-24 pt-20 pb-40">
        {/* 2. THE EDITORIAL HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-32">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
              Master Access
            </p>
            <h1 className="text-[12vw] md:text-[9rem] font-serif italic leading-[0.7] tracking-tighter">
              The <br />{" "}
              <span className="text-stone-900 font-normal">Console.</span>
            </h1>
          </div>
          <div className=" border border-stone-100 p-8 rounded-[2rem] shadow-2xl shadow-stone-200/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-300 mb-2">
              Authenticated Operator
            </p>
            <p className="text-2xl font-serif italic text-stone-900">
              {user?.displayName}
            </p>
          </div>
        </header>

        {/* 3. THE INTERACTIVE LOG: LARGE & MONOCHROME */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 border-t border-stone-200 pt-20">
          {/* Left: Global Stats List */}
          <div className="lg:col-span-7 space-y-24">
            <BigStatRow
              label="Guardian Network"
              count={data.users}
              to="/dashboard/admin/allusers"
            />
            <BigStatRow
              label="Animal Registry"
              count={data.pets}
              to="/dashboard/admin/allpets"
            />
            <BigStatRow
              label="Financial Capital"
              count={data.campaigns}
              to="/dashboard/admin/alldonation"
            />
          </div>

          {/* Right: The Feature Action */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">
              <Link
                to="/dashboard/create-donation-campaign"
                className="group block aspect-[3/4] bg-stone-900 rounded-[4rem] overflow-hidden relative"
              >
                <div className="absolute inset-0 p-12 flex flex-col justify-between text-[#fff4ea]">
                  <div className="flex justify-between items-start">
                    <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                      <FiMoreHorizontal />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      Action_01
                    </span>
                  </div>
                  <div>
                    <h2 className="text-6xl font-serif italic leading-none mb-8 group-hover:text-primary transition-colors">
                      Launch <br /> Campaign.
                    </h2>
                    <div className="w-20 h-20 rounded-full bg-white hover:bg-primary text-stone-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <FiArrowUpRight size={32} />
                    </div>
                  </div>
                </div>
                {/* Decorative Texture */}
                <div className="absolute -bottom-20 -right-20 text-[20rem] font-serif italic text-white/[0.03] pointer-events-none">
                  S
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// --- SUB-COMPONENT ---

const BigStatRow = ({ label, count, to }) => (
  <Link to={to} className="group flex flex-col gap-6">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">
          Registry Entry
        </span>
        <h3 className="text-5xl md:text-7xl font-serif italic text-stone-900 tracking-tighter group-hover:text-primary transition-all duration-500">
          {label}
        </h3>
      </div>
      <div className="text-right">
        <p className="text-8xl md:text-9xl font-serif leading-none text-stone-100 group-hover:text-stone-200 transition-colors">
          {count.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
    <div className="w-full h-px  group-hover:bg-primary transition-all duration-1000" />
  </Link>
);

export default AdminDashboard;
