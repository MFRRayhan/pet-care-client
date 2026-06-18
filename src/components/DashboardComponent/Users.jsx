import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FiShield,
  FiUserX,
  FiUserCheck,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../SharedComponent/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const UsersComponent = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosSecure.patch(`/users/make-admin/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User is now an Administrator.");
      setConfirmAction(null);
    },
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, action }) => {
      const res = await axiosSecure.patch(`/users/${userId}/${action}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["users"]);
      toast.success(
        variables.action === "ban"
          ? "User access has been restricted."
          : "User access has been restored.",
      );
      setConfirmAction(null);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-stone-100 pb-12">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Admin Control Panel
          </span>
          <h1 className="text-5xl md:text-6xl font-serif italic tracking-tighter text-stone-900">
            Community <span className="text-primary">Members.</span>
          </h1>
        </div>
        <div className="bg-stone-50 px-6 py-3 rounded-full border border-stone-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Currently Managing:{" "}
            <span className="text-primary">{users.length} Users</span>
          </p>
        </div>
      </header>

      {/* User List */}
      <div className="space-y-0">
        <div className="hidden md:grid grid-cols-12 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 border-b border-stone-50">
          <div className="col-span-5">Member Details</div>
          <div className="col-span-2 text-center">Account Type</div>
          <div className="col-span-2 text-center">Current Status</div>
          <div className="col-span-3 text-right">Quick Actions</div>
        </div>

        <AnimatePresence mode="popLayout">
          {users.map((user) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-12 items-center px-8 py-10 border-b border-stone-100 group hover:bg-stone-50/30 transition-all duration-500"
            >
              {/* Identity */}
              <div className="col-span-5 flex items-center gap-6">
                <div className="h-14 w-14 rounded-full overflow-hidden border border-stone-100 relative shadow-sm">
                  <img
                    src={
                      user.image ||
                      "https://ui-avatars.com/api/?name=" + user.name
                    }
                    className={`h-full w-full object-cover ${user.status === "banned" ? "grayscale opacity-40" : ""}`}
                    alt=""
                  />
                </div>
                <div>
                  <h4 className="text-lg font-serif italic text-stone-900">
                    {user.name}
                  </h4>
                  <p className="text-xs text-stone-400 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Privilege */}
              <div className="col-span-2 text-center">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${user.role === "admin" ? "bg-primary/5 border-primary/20 text-primary" : "bg-stone-50 border-stone-100 text-stone-400"}`}
                >
                  {user.role === "admin" ? "Administrator" : "General User"}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 text-center">
                <div
                  className={`text-[10px] font-bold flex items-center justify-center gap-2 ${user.status === "banned" ? "text-red-500" : "text-emerald-600"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${user.status === "banned" ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
                  />
                  {user.status === "banned" ? "Restricted" : "Active"}
                </div>
              </div>

              {/* --- ACTION BUTTONS WITH TEXT LABELS --- */}
              <div className="col-span-3 flex justify-end gap-3">
                {user.role !== "admin" && (
                  <ActionButton
                    icon={<FiShield />}
                    label="Make Admin"
                    onClick={() => setConfirmAction({ type: "admin", user })}
                  />
                )}
                <ActionButton
                  icon={
                    user.status === "banned" ? <FiUserCheck /> : <FiUserX />
                  }
                  label={user.status === "banned" ? "Restore" : "Restrict"}
                  onClick={() =>
                    setConfirmAction({
                      type: user.status === "banned" ? "unban" : "ban",
                      user,
                    })
                  }
                  isDestructive={user.status !== "banned"}
                  isSuccess={user.status === "banned"}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- USER FRIENDLY MODAL --- */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white max-w-sm w-full rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 
                ${confirmAction.type === "ban" ? "bg-red-50 text-red-500" : "bg-stone-50 text-primary"}`}
              >
                <FiAlertTriangle size={28} />
              </div>

              <h2 className="text-2xl font-serif italic mb-3">
                {confirmAction.type === "admin"
                  ? "Promote Member?"
                  : confirmAction.type === "ban"
                    ? "Restrict Member?"
                    : "Restore Member?"}
              </h2>

              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                {confirmAction.type === "admin"
                  ? `Are you sure you want to give ${confirmAction.user.name} full admin access?`
                  : `Are you sure you want to ${confirmAction.type} ${confirmAction.user.name}? They will ${confirmAction.type === "ban" ? "lose" : "regain"} access to their account.`}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (confirmAction.type === "admin")
                      makeAdminMutation.mutate(confirmAction.user._id);
                    else
                      banUserMutation.mutate({
                        userId: confirmAction.user._id,
                        action: confirmAction.type,
                      });
                  }}
                  disabled={
                    banUserMutation.isPending || makeAdminMutation.isPending
                  }
                  className={`w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg
                    ${confirmAction.type === "ban" ? "bg-red-500 text-white shadow-red-100" : "bg-stone-900 text-white hover:bg-primary shadow-stone-200"}`}
                >
                  {banUserMutation.isPending || makeAdminMutation.isPending
                    ? "Updating..."
                    : "Yes, Proceed"}
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-stone-600 transition-colors"
                >
                  Nevermind, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SMALL REUSABLE ACTION BUTTON ---
const ActionButton = ({ icon, label, onClick, isDestructive, isSuccess }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-tighter transition-all cursor-pointer
      ${
        isDestructive
          ? "border-red-50 text-red-400 hover:bg-red-500 hover:text-white"
          : isSuccess
            ? "border-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
            : "border-stone-100 text-stone-400 hover:border-stone-900 hover:text-stone-900"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default UsersComponent;
