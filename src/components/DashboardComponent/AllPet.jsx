import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Loading from "../SharedComponent/Loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const AllPet = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // States
  const [editingPet, setEditingPet] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'delete' | 'adopt', pet: obj }
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;

  // Fetch
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["all-pets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/available-pets");
      return res.data;
    },
  });

  // Pagination
  const totalPages = Math.ceil(pets.length / petsPerPage);
  const currentPets = pets.slice(
    (currentPage - 1) * petsPerPage,
    currentPage * petsPerPage,
  );

  // Mutations
  const deletePetMutation = useMutation({
    mutationFn: async (petId) => axiosSecure.delete(`/pets/${petId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-pets"]);
      toast.success("Resident registry expunged.");
      setConfirmAction(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ petId, status }) =>
      axiosSecure.put(`/pets/${petId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-pets"]);
      toast.success("Status synchronized.");
      setConfirmAction(null);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-12">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
            Management
          </span>
          <h2 className="text-6xl font-serif italic tracking-tighter text-stone-900 mt-2">
            Pet Directory.
          </h2>
        </div>
        <div className="bg-stone-50 px-6 py-3 rounded-full border border-stone-100">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            Total Residents: <span className="text-primary">{pets.length}</span>
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {currentPets.map((pet) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={pet._id}
              className="group bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-6 right-6">
                  <span
                    className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${pet.status === "adopted" ? "bg-emerald-500/90 text-white" : "bg-primary/90 text-white"}`}
                  >
                    {pet.status}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-3xl font-serif italic text-stone-900">
                    {pet.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                    {pet.category}
                  </p>
                </div>

                <div className="flex gap-6 text-stone-400 border-b border-stone-50 pb-6">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                    <FiCalendar className="text-primary" /> {pet.age}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                    <FiMapPin className="text-primary" /> {pet.location}
                  </div>
                </div>

                {/* --- UPDATED ACTION BUTTONS WITH TEXT --- */}
                <div className="grid grid-cols-3 gap-3">
                  <CardAction
                    label="Edit"
                    icon={<FiEdit3 />}
                    onClick={() => {
                      setEditingPet(pet);
                      setShowEditModal(true);
                    }}
                  />
                  <CardAction
                    label={pet.status === "adopted" ? "Cancel" : "Adopt"}
                    icon={<FiCheckCircle />}
                    onClick={() => setConfirmAction({ type: "adopt", pet })}
                    active={pet.status === "adopted"}
                  />
                  <CardAction
                    label="Delete"
                    icon={<FiTrash2 />}
                    isDestructive
                    onClick={() => setConfirmAction({ type: "delete", pet })}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-10 pt-16">
          <NavButton
            direction="left"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300">
            {currentPage} <span className="text-primary mx-2">/</span>{" "}
            {totalPages}
          </span>
          <NavButton
            direction="right"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          />
        </div>
      )}

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* CUSTOM CONFIRMATION MODAL (ADOPT & DELETE) */}
        {confirmAction && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white max-w-md w-full rounded-[3rem] p-12 text-center shadow-2xl"
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 ${confirmAction.type === "delete" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}
              >
                <FiAlertTriangle size={32} />
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4">
                Confirm Action
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed mb-10">
                Are you sure you want to{" "}
                <strong>
                  {confirmAction.type === "delete"
                    ? "permanently delete"
                    : "update status for"}
                </strong>{" "}
                {confirmAction.pet.name}?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    confirmAction.type === "delete"
                      ? deletePetMutation.mutate(confirmAction.pet._id)
                      : updateStatusMutation.mutate({
                          petId: confirmAction.pet._id,
                          status:
                            confirmAction.pet.status === "adopted"
                              ? "available"
                              : "adopted",
                        })
                  }
                  className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer ${confirmAction.type === "delete" ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100" : "bg-stone-900 text-white hover:bg-primary shadow-lg shadow-stone-200"}`}
                >
                  Authorize Request
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="py-4 text-[10px] font-black uppercase tracking-widest text-stone-300 hover:text-stone-900 cursor-pointer transition-colors"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal (Side Drawer Style) */}
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-[150] cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[151] p-16 shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-12 right-12 text-stone-300 hover:text-stone-900"
              >
                <FiX size={24} />
              </button>
              <div className="mb-16">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                  File Update
                </span>
                <h2 className="text-4xl font-serif italic tracking-tighter mt-2">
                  Edit Resident.
                </h2>
              </div>
              <div className="space-y-10">
                <DrawerInput label="Name" defaultValue={editingPet?.name} />
                <DrawerInput label="Age" defaultValue={editingPet?.age} />
                <button className="w-full py-6 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary shadow-xl shadow-stone-200 transition-all">
                  Synchronize Records
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const CardAction = ({ label, icon, onClick, active, isDestructive }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-[1.5rem] transition-all duration-500 cursor-pointer border
      ${
        isDestructive
          ? "bg-red-50/50 border-red-50 text-red-500 hover:bg-red-500 hover:text-white"
          : active
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-stone-50 border-stone-50 text-stone-400 hover:bg-stone-900 hover:text-white hover:border-stone-900"
      }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const NavButton = ({ direction, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-500 
    ${disabled ? "border-stone-50 text-stone-200 cursor-not-allowed" : "bg-primary border-primary text-white hover:bg-transparent hover:text-primary shadow-lg shadow-primary/20 cursor-pointer"}`}
  >
    {direction === "left" ? (
      <FiChevronLeft size={20} />
    ) : (
      <FiChevronRight size={20} />
    )}
  </button>
);

const DrawerInput = ({ label, defaultValue }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-2">
      {label}
    </label>
    <input
      defaultValue={defaultValue}
      className="w-full bg-stone-50 border-none rounded-full px-8 py-5 text-sm outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
);

export default AllPet;
