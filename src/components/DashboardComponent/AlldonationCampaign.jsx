import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit3,
  FiTrash2,
  FiPauseCircle,
  FiPlayCircle,
  FiX,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import Loading from "../SharedComponent/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const AlldonationCampaign = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 5; // Reduced for better visual pacing

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["donation-campaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-campaigns");
      return res.data.campaigns;
    },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.delete(`/delete-donation-campaign/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["donation-campaigns"]);
      toast.success("Entry expunged.");
      setConfirmAction(null);
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: async (id) =>
      await axiosSecure.patch(`/donation-campaigns/${id}/toggle-pause`),
    onSuccess: () => {
      queryClient.invalidateQueries(["donation-campaigns"]);
      toast.success("Status synced.");
      setConfirmAction(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) =>
      await axiosSecure.put(`/donation-campaigns/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["donation-campaigns"]);
      setEditingCampaign(null);
      toast.success("Parameters updated.");
    },
  });

  if (isLoading) return <Loading />;

  // Pagination Logic
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const currentCampaigns = campaigns.slice(
    (currentPage - 1) * campaignsPerPage,
    currentPage * campaignsPerPage,
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-stone-900 pb-20 px-6 lg:px-20">
      <header className="pt-20 pb-16 border-b border-stone-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4">
            Governance
          </p>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            All <span className="text-primary italic"> Campaign.</span>
          </h1>
        </div>
      </header>

      <main className="mt-12 min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {currentCampaigns.map((campaign, idx) => (
              <div
                key={campaign._id}
                className="group grid grid-cols-1 lg:grid-cols-12 py-10 items-center border-b border-stone-100 hover:cursor-pointer"
              >
                {/* Column 1: Info */}
                <div className="col-span-5 flex items-center gap-8">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-stone-100 cursor-pointer">
                    <img
                      src={campaign.image}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt=""
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic">
                      {campaign.petName || campaign.name}
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                      {campaign.owner}
                    </p>
                  </div>
                </div>

                {/* Column 2: Financials */}
                <div className="col-span-4 pr-16">
                  <div className="h-[1px] w-full bg-stone-100 relative">
                    <div className="absolute top-[-15px] left-0 text-[10px] font-serif italic text-stone-400">
                      ${campaign.donatedAmount} / ${campaign.maxDonation}
                    </div>
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{
                        width: `${Math.min((campaign.donatedAmount / campaign.maxDonation) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Column 3: Controls */}
                <div className="col-span-3 flex justify-end gap-4">
                  <ActionButton
                    label="Edit"
                    icon={<FiEdit3 />}
                    onClick={() => setEditingCampaign(campaign)}
                  />
                  <ActionButton
                    label={campaign.isPaused ? "Play" : "Pause"}
                    icon={
                      campaign.isPaused ? <FiPlayCircle /> : <FiPauseCircle />
                    }
                    onClick={() =>
                      setConfirmAction({ type: "pause", campaign })
                    }
                    active={campaign.isPaused}
                  />
                  <ActionButton
                    label="Delete"
                    icon={<FiTrash2 />}
                    onClick={() =>
                      setConfirmAction({ type: "delete", campaign })
                    }
                    isDestructive
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- PAGINATION CONTROLS --- */}
      {/* --- PREMIUM PAGINATION FOOTER --- */}
      {totalPages > 1 && (
        <footer className="mt-20 flex justify-center items-center gap-10 border-t border-stone-100 pt-16 mb-10">
          {/* Previous Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 cursor-pointer border-2
              ${
                currentPage === 1
                  ? "bg-stone-50 border-stone-50 text-stone-200 cursor-not-allowed"
                  : "bg-primary border-primary text-white hover:bg-transparent hover:text-primary shadow-lg shadow-primary/20"
              }`}
          >
            <FiChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-8 items-center">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className="relative group cursor-pointer flex flex-col items-center"
                >
                  <span
                    className={`text-[11px] font-black tracking-[0.4em] transition-all duration-500 
                    ${isActive ? "text-primary translate-y-[-2px]" : "text-stone-300 hover:text-stone-600"}`}
                  >
                    {String(pageNum).padStart(2, "0")}
                  </span>

                  {/* Elegant Dot Indicator */}
                  <div
                    className={`h-1 rounded-full transition-all duration-500 mt-1
                    ${isActive ? "w-4 bg-primary" : "w-0 bg-stone-200 group-hover:w-2"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 cursor-pointer border-2
              ${
                currentPage === totalPages
                  ? "bg-stone-50 border-stone-50 text-stone-200 cursor-not-allowed"
                  : "bg-primary border-primary text-white hover:bg-transparent hover:text-primary shadow-lg shadow-primary/20"
              }`}
          >
            <FiChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </footer>
      )}

      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 ">
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
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 ${confirmAction.type === "delete" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"}`}
              >
                <FiAlertTriangle size={32} />
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4">
                Confirm Action
              </h2>
              <p className="text-stone-500 text-sm mb-10 leading-relaxed italic">
                Proceed with the {confirmAction.type} request?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    confirmAction.type === "delete"
                      ? deleteMutation.mutate(confirmAction.campaign._id)
                      : togglePauseMutation.mutate(confirmAction.campaign._id)
                  }
                  className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all ${confirmAction.type === "delete" ? "bg-red-500 text-white hover:bg-red-600" : "bg-stone-900 text-white hover:bg-primary"}`}
                >
                  Authorize
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

        {editingCampaign && (
          <EditDrawer
            campaign={editingCampaign}
            onClose={() => setEditingCampaign(null)}
            onSubmit={(data) =>
              updateMutation.mutate({ id: editingCampaign._id, data })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ActionButton & EditDrawer components remain as per previous message...
const ActionButton = ({ icon, label, onClick, active, isDestructive }) => (
  <button
    onClick={onClick}
    className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 cursor-pointer 
        ${
          isDestructive
            ? "border-red-50 text-red-400 hover:bg-red-500 hover:text-white"
            : active
              ? "bg-amber-500 text-white border-amber-500"
              : "border-stone-100 text-stone-400 hover:border-stone-900 hover:text-stone-900"
        }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest max-w-0 overflow-hidden group-hover/btn:max-w-[100px] transition-all duration-500 whitespace-nowrap">
      {label}
    </span>
  </button>
);

const EditDrawer = ({ campaign, onClose, onSubmit }) => (
  <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-[150] cursor-pointer"
    />
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30 }}
      className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-[151] p-16 shadow-2xl overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-serif italic tracking-tighter">
          Edit Protocol.
        </h2>
        <button
          onClick={onClose}
          className="text-stone-300 hover:text-stone-900 cursor-pointer"
        >
          <FiX size={24} />
        </button>
      </div>
      <Formik
        initialValues={{
          name: campaign.petName || campaign.name,
          maxDonation: campaign.maxDonation,
          lastDate: campaign.lastDate?.split("T")[0],
          image: campaign.image,
        }}
        onSubmit={onSubmit}
      >
        <Form className="space-y-10">
          <DrawerField label="Title" name="name" />
          <DrawerField label="Capital Goal" name="maxDonation" type="number" />
          <DrawerField label="Expiry" name="lastDate" type="date" />
          <button
            type="submit"
            className="w-full py-6 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all cursor-pointer"
          >
            Synchronize
          </button>
        </Form>
      </Formik>
    </motion.div>
  </>
);

const DrawerField = ({ label, name, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
      {label}
    </label>
    <Field
      name={name}
      type={type}
      className="w-full bg-stone-50 border-none rounded-full px-8 py-4 text-sm outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
);

export default AlldonationCampaign;
