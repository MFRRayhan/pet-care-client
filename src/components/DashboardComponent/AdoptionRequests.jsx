import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiArrowUpRight,
} from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";
import Loading from "../SharedComponent/Loading";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const AdoptionRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["adoption-requests", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/adoption-requests/${user.email}`,
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }) => {
      await axiosSecure.put(`/adoption-requests/${requestId}/${status}`, {
        status,
      });
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries(["adoption-requests", user?.email]);
      status === "accept"
        ? toast.success("Request Accepted")
        : toast.error("Request Declined");
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* 1. EDITORIAL HEADER */}
      <header className="border-b-4 border-foreground pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-2">
          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">
            Inquiry Review
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Adoption <span className="text-primary italic">Requests.</span>
          </h1>
        </div>
        <div className="text-[11px] font-black uppercase tracking-widest text-foreground/40 border border-stone-200 px-6 py-3 rounded-full">
          Total Queue: {requests.length}
        </div>
      </header>

      {/* 2. THE ADOPTION GRID */}
      {requests.length === 0 ? (
        <div className="py-40 text-center border-2 border-dashed border-stone-200 rounded-[4rem]">
          <p className="text-3xl font-serif italic text-stone-300">
            No active applications found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
          <AnimatePresence mode="popLayout">
            {requests.map((request) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                key={request._id}
                className="group flex flex-col space-y-6"
              >
                {/* Visual Identity Frame */}
                <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-stone-100 group">
                  <img
                    src={request.petImage}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt={request.petName}
                  />

                  {/* Status Overlay */}
                  <div className="absolute top-6 left-6">
                    <span
                      className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${
                        request.status === "accepted"
                          ? "bg-green-500 text-white"
                          : request.status === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-black"
                      }`}
                    >
                      {request.status || "requested"}
                    </span>
                  </div>

                  {/* Deep Review Interaction */}
                  <div
                    onClick={() => setSelectedRequest(request)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-4">
                      <FiArrowUpRight size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      View Full Dossier
                    </span>
                  </div>
                </div>

                {/* Requester & Pet Data */}
                <div className="space-y-4 px-2">
                  <div>
                    <h4 className="text-3xl font-serif italic text-foreground tracking-tight leading-none">
                      {request.petName}
                    </h4>
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-primary mt-2">
                      Applied by: {request.requestedUserName}
                    </p>
                  </div>

                  <div className="space-y-1 py-4 border-y border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 truncate flex items-center gap-2">
                      <FiMail className="text-primary" />{" "}
                      {request.requestedUserEmail}
                    </p>
                    <p className="text-[10px] font-bold text-stone-400 flex items-center gap-2">
                      <FiPhone className="text-primary" />{" "}
                      {request.requestedUserPhone}
                    </p>
                  </div>
                </div>

                {/* Text-Based Commands */}
                <div className="flex items-center gap-8 px-2">
                  {request.status === "requested" || !request.status ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            requestId: request._id,
                            status: "accept",
                          })
                        }
                        className="text-[11px] font-black uppercase tracking-widest text-green-600 border-b-2 border-stone-100 hover:border-green-600 transition-all cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            requestId: request._id,
                            status: "reject",
                          })
                        }
                        className="text-[11px] font-black uppercase tracking-widest text-red-500 border-b-2 border-stone-100 hover:border-red-500 transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-300">
                      Decision Finalized
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="text-[11px] font-black uppercase tracking-widest text-foreground border-b-2 border-stone-100 hover:border-foreground transition-all ml-auto cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 3. DOSSIER MODAL */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <div className="p-12 space-y-10">
                <header className="flex justify-between items-start border-b border-stone-100 pb-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                      Full Dossier
                    </span>
                    <h3 className="text-4xl font-serif italic text-foreground tracking-tighter mt-2">
                      Application.
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-4 hover:bg-stone-50 rounded-full transition-colors cursor-pointer"
                  >
                    <FiX size={28} />
                  </button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                  <div className="flex items-center gap-6 p-6 bg-stone-50 rounded-[2.5rem]">
                    <img
                      src={selectedRequest.petImage}
                      className="w-24 h-24 rounded-3xl object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                        Regarding
                      </p>
                      <h4 className="text-2xl font-serif italic">
                        {selectedRequest.petName}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ModalRow
                      icon={<FiMail />}
                      label="Email Address"
                      value={selectedRequest.requestedUserEmail}
                    />
                    <ModalRow
                      icon={<FiPhone />}
                      label="Phone Number"
                      value={selectedRequest.requestedUserPhone}
                    />
                    <ModalRow
                      icon={<FiMapPin />}
                      label="Target Location"
                      value={selectedRequest.requestedUserAddress}
                    />
                    <ModalRow
                      icon={<FiCalendar />}
                      label="Submission Date"
                      value={new Date(
                        selectedRequest.createdAt,
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-center" />
    </div>
  );
};

const ModalRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 p-6 border border-stone-100 rounded-3xl">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-300">
        {label}
      </p>
      <p className="text-lg font-serif italic text-foreground">
        {value || "Confidential"}
      </p>
    </div>
  </div>
);

export default AdoptionRequests;
