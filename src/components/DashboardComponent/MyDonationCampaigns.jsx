import React, { useState, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiPlus,
  FiArrowUpRight,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import Loading from "../SharedComponent/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const MyDonationCampaigns = () => {
  const [showDonatorsModal, setShowDonatorsModal] = useState(false);
  const [confirmToggleModal, setConfirmToggleModal] = useState(null); // { campaign: obj, action: string }
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const {
    data: campaigns = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["donation-campaigns", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaigns/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handlePauseToggle = async (campaign) => {
    try {
      await axiosSecure.patch(
        `/donation-campaigns/${campaign._id}/toggle-pause`,
      );
      refetch();
      toast.success(`Protocol ${campaign.isPaused ? "Resumed" : "Suspended"}`);
      setConfirmToggleModal(null);
    } catch (error) {
      toast.error(`Operation failed`);
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
              Financial Oversight
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Funding <span className="text-primary italic">Portfolios.</span>
          </h1>
        </div>
        <Link
          to="/dashboard/create-donation-campaign"
          className="group flex items-center gap-6 bg-foreground text-background px-12 py-6 rounded-full hover:bg-primary transition-all duration-700 shadow-xl shadow-foreground/5"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            Start New Fund
          </span>
          <FiPlus className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </header>

      {/* Campaign Grid */}
      {campaigns.length === 0 ? (
        <div className="py-48 text-center border border-dashed border-border rounded-[4rem] bg-surface-alt/30">
          <p className="text-2xl font-serif italic text-muted-foreground">
            No active funds found in the registry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-24">
          <AnimatePresence mode="popLayout">
            {campaigns.map((campaign) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={campaign._id}
                className="group flex flex-col space-y-8"
              >
                {/* Visual Identity Frame */}
                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden bg-surface-alt group-hover:shadow-2xl transition-all duration-1000">
                  <img
                    src={campaign.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s]"
                    alt=""
                  />

                  <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                    <span
                      className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/20 shadow-lg ${campaign.isPaused ? "bg-red-500/80 text-white" : "bg-white/90 text-stone-900"}`}
                    >
                      {campaign.isPaused ? "Paused" : "Active Flow"}
                    </span>
                    <div className="bg-black/70 backdrop-blur-md px-5 py-3 rounded-[1.5rem] text-right border border-white/10">
                      <p className="text-[7px] font-black uppercase text-stone-400 tracking-tighter">
                        Progress
                      </p>
                      <p className="text-white text-sm font-serif italic">
                        {Math.round(
                          (campaign.donatedAmount / campaign.maxDonation) * 100,
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowDonatorsModal(true);
                    }}
                    className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-sm cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-foreground mb-4 shadow-2xl">
                      <FiArrowUpRight size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                      Review Philanthropy
                    </span>
                  </div>
                </div>

                {/* Content & Metrics */}
                <div className="space-y-6 px-4">
                  <div>
                    <h4 className="text-4xl font-serif italic text-foreground tracking-tighter">
                      {campaign.petName}
                    </h4>
                    <div className="flex justify-between items-end mt-6 border-b border-border pb-6">
                      <div>
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                          Target Goal
                        </p>
                        <p className="text-lg font-serif italic text-foreground">
                          BDT {campaign.maxDonation.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-1">
                          Funds Raised
                        </p>
                        <p className="text-lg font-serif italic text-primary">
                          {campaign.donatedAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boutique Actions */}
                  <div className="flex items-center gap-10">
                    <button
                      onClick={() =>
                        setConfirmToggleModal({
                          campaign,
                          action: campaign.isPaused ? "resume" : "pause",
                        })
                      }
                      className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer border-b border-transparent ${campaign.isPaused ? "text-emerald-500 hover:border-emerald-500" : "text-amber-500 hover:border-amber-500"}`}
                    >
                      {campaign.isPaused ? "Resume Fund" : "Pause Flow"}
                    </button>
                    <Link
                      to={`/dashboard/edit-donation/${campaign._id}`}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Modify
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowDonatorsModal(true);
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:tracking-[0.3em] transition-all ml-auto cursor-pointer"
                    >
                      Benefactors
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal 1: PAUSE/RESUME CONFIRMATION (Boutique Style) */}
      <AnimatePresence>
        {confirmToggleModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmToggleModal(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-background max-w-md w-full rounded-[3.5rem] p-12 text-center shadow-2xl border border-border"
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 ${confirmToggleModal.action === "pause" ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"}`}
              >
                {confirmToggleModal.action === "pause" ? (
                  <FiAlertTriangle size={36} />
                ) : (
                  <FiCheckCircle size={36} />
                )}
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4 text-foreground capitalize">
                {confirmToggleModal.action} Fund Flow?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-10 italic">
                You are about to {confirmToggleModal.action} the donation
                campaign for{" "}
                <strong>{confirmToggleModal.campaign.petName}</strong>.
                {confirmToggleModal.action === "pause"
                  ? " This will temporarily suspend incoming contributions."
                  : " This will allow contributors to send funds again."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handlePauseToggle(confirmToggleModal.campaign)}
                  className={`w-full py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer shadow-lg ${confirmToggleModal.action === "pause" ? "bg-amber-500 text-white shadow-amber-500/20" : "bg-emerald-600 text-white shadow-emerald-600/20"}`}
                >
                  Yes, Authorize
                </button>
                <button
                  onClick={() => setConfirmToggleModal(null)}
                  className="py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: BENEFACTOR LOG (Editorial Style) */}
      <AnimatePresence>
        {showDonatorsModal && selectedCampaign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonatorsModal(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-background rounded-[4rem] overflow-hidden shadow-2xl border border-border"
            >
              <div className="p-12 space-y-12">
                <header className="flex justify-between items-start border-b border-border pb-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                      Philanthropy Log
                    </span>
                    <h3 className="text-4xl font-serif italic text-foreground tracking-tighter mt-4">
                      Benefactors.
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDonatorsModal(false)}
                    className="p-4 hover:bg-surface-alt rounded-full transition-colors cursor-pointer text-muted-foreground"
                  >
                    <FiX size={28} />
                  </button>
                </header>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 boutique-scroll">
                  {!selectedCampaign.donators ||
                  selectedCampaign.donators.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-serif italic text-muted-foreground text-xl leading-relaxed">
                        The contribution ledger is <br /> currently blank.
                      </p>
                    </div>
                  ) : (
                    selectedCampaign.donators.map((donator, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-8 bg-surface-alt/50 rounded-[2.5rem] border border-border/50"
                      >
                        <div>
                          <p className="text-[8px] font-black uppercase text-stone-400 tracking-[0.2em] mb-1">
                            Contributor
                          </p>
                          <p className="text-xl font-serif italic text-foreground">
                            {donator.name}
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-1 font-mono">
                            {new Date(donator.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-1">
                            Gift Amount
                          </p>
                          <p className="text-2xl font-serif italic text-primary">
                            BDT {donator.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <footer className="pt-10 border-t border-border flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Cumulative Funding
                  </p>
                  <p className="text-5xl font-serif italic text-primary tracking-tighter">
                    BDT {selectedCampaign.donatedAmount.toLocaleString()}
                  </p>
                </footer>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default MyDonationCampaigns;
