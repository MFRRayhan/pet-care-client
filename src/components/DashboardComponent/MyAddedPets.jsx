import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiArrowUpRight,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import Loading from "../SharedComponent/Loading";
import { toast } from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const MyAddedPets = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // States
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'adopt' | 'delete', petId: string, name: string }
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const petsPerPage = 6;

  useEffect(() => {
    let mounted = true;
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/pets/${user?.email}`, {
          params: { page, size: petsPerPage },
        });
        if (mounted) {
          setPets(res.data.pets);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        toast.error("Registry connection interrupted.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (user?.email) fetchPets();
    return () => {
      mounted = false;
    };
  }, [user?.email, axiosSecure, page]);

  // Action Handlers
  const handleAdoptAction = async (id) => {
    try {
      await axiosSecure.patch(`/pets/adopt/${id}`);
      setPets((prev) =>
        prev.map((pet) => (pet._id === id ? { ...pet, adopted: true } : pet)),
      );
      toast.success("Companion status updated.");
      setConfirmModal(null);
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleDeleteAction = async (id) => {
    try {
      await axiosSecure.delete(`/pets/${id}`);
      setPets((prev) => prev.filter((pet) => pet._id !== id));
      toast.success("Entry removed from registry.");
      setConfirmModal(null);
    } catch (error) {
      toast.error("Removal failed.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 space-y-20">
      {/* Editorial Header */}
      <header className="border-b border-border pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              Personal Collection
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Your <span className="text-primary italic">Registry.</span>
          </h1>
        </div>
        <Link
          to="/dashboard/add-pet"
          className="group flex items-center gap-6 bg-foreground text-background px-12 py-6 rounded-full hover:bg-primary transition-all duration-700 shadow-xl shadow-foreground/5"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            Add New Resident
          </span>
          <FiPlus className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </header>

      {/* Boutique Grid */}
      {pets.length === 0 ? (
        <div className="py-48 text-center border border-dashed border-border rounded-[4rem] bg-surface-alt/30">
          <p className="text-2xl font-serif italic text-muted-foreground">
            The registry is currently vacant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          <AnimatePresence mode="popLayout">
            {pets.map((pet) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={pet._id}
                className="group flex flex-col space-y-8"
              >
                {/* Visual Frame */}
                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden bg-surface-alt group-hover:shadow-2xl transition-all duration-700">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                  />

                  {/* Glassmorphism Badge */}
                  <div className="absolute top-8 left-8">
                    <span
                      className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/20 shadow-lg ${pet.adopted ? "bg-emerald-500/80 text-white" : "bg-white/90 text-stone-900"}`}
                    >
                      {pet.adopted ? "Rehomed" : "Available"}
                    </span>
                  </div>

                  {/* Edit Overlay */}
                  <Link
                    to={`/dashboard/update-pet/${pet._id}`}
                    className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-foreground shadow-2xl"
                    >
                      <FiArrowUpRight size={28} />
                    </motion.div>
                  </Link>
                </div>

                {/* Content */}
                <div className="space-y-6 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-4xl font-serif italic text-foreground tracking-tighter">
                        {pet.name}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-1">
                        {pet.category}
                      </p>
                    </div>
                    <p className="text-[9px] font-black text-muted-foreground tracking-widest bg-surface-alt px-3 py-1 rounded-full uppercase">
                      ID: {pet._id.slice(-6)}
                    </p>
                  </div>

                  <div className="flex items-center gap-10 border-t border-border pt-6">
                    <Link
                      to={`/dashboard/update-pet/${pet._id}`}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-foreground transition-colors cursor-pointer"
                    >
                      Edit File
                    </Link>

                    {!pet.adopted && (
                      <button
                        onClick={() =>
                          setConfirmModal({
                            type: "adopt",
                            petId: pet._id,
                            name: pet.name,
                          })
                        }
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all cursor-pointer"
                      >
                        Mark Adopted
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setConfirmModal({
                          type: "delete",
                          petId: pet._id,
                          name: pet.name,
                        })
                      }
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors ml-auto cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Custom Boutique Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-background max-w-md w-full rounded-[3.5rem] p-12 text-center shadow-2xl border border-border"
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 ${confirmModal.type === "delete" ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"}`}
              >
                <FiAlertTriangle size={36} />
              </div>

              <h2 className="text-3xl font-serif italic tracking-tighter mb-4 text-foreground">
                {confirmModal.type === "delete"
                  ? "Remove Entry?"
                  : "Confirm Adoption?"}
              </h2>

              <p className="text-muted-foreground text-sm leading-relaxed mb-10">
                Are you sure you want to{" "}
                {confirmModal.type === "delete"
                  ? "permanently delete"
                  : "finalize the adoption for"}{" "}
                <strong>{confirmModal.name}</strong>?
                {confirmModal.type === "delete" &&
                  " This record cannot be recovered."}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    confirmModal.type === "delete"
                      ? handleDeleteAction(confirmModal.petId)
                      : handleAdoptAction(confirmModal.petId)
                  }
                  className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer shadow-lg ${confirmModal.type === "delete" ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" : "bg-foreground text-background hover:bg-primary"}`}
                >
                  Yes, Authorize
                </button>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <footer className="pt-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
            Entry <span className="text-foreground">{page}</span> of{" "}
            {pagination.totalPages}
          </span>
          <div className="flex items-center gap-16">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-20 hover:text-primary transition-all cursor-pointer"
            >
              <FiChevronLeft className="group-hover:-translate-x-2 transition-transform" />{" "}
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={!pagination.hasNextPage}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-20 hover:text-primary transition-all cursor-pointer"
            >
              Next{" "}
              <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MyAddedPets;
