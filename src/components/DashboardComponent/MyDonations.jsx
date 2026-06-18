import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import Loading from "../SharedComponent/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const MyDonations = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [refundingId, setRefundingId] = useState(null);

  const { data: transactionDetails = [], isLoading } = useQuery({
    queryKey: ["transaction-details", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-transations-details/${user.email}`,
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleRefund = async (transaction) => {
    const result = await Swal.fire({
      title: "Request Return?",
      text: "This contribution will be removed from the companion's fund.",
      confirmButtonText: "Confirm Refund",
      confirmButtonColor: "#ef4444",
      showCancelButton: true,
      customClass: { popup: "rounded-[3rem] font-serif" },
    });

    if (result.isConfirmed) {
      setRefundingId(transaction._id);
      try {
        await axiosSecure.delete(`/delete-my-donation/${transaction._id}`);
        await axiosSecure.put("/update-campaign-amount", {
          transactionId: transaction.campaignId,
          transectionAmount: transaction.amount || transaction.donatedAmount,
        });
        queryClient.invalidateQueries(["transaction-details", user?.email]);
        toast.success("Contribution returned.");
      } catch (err) {
        toast.error("Refund failed.");
      } finally {
        setRefundingId(null);
      }
    }
  };

  const totalImpact = transactionDetails.reduce(
    (sum, t) => sum + (t.donatedAmount || t.amount || 0),
    0,
  );

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-20">
      {/* 1. EDITORIAL HEADER & IMPACT */}
      <header className="border-b-4 border-foreground pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-4 max-w-2xl">
          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">
            Guardian Ledger
          </span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            My <span className="text-primary italic">Donations.</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 leading-relaxed">
            A verified history of your patronage and contributions toward
            companion sanctuary.
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">
            Lifetime Impact
          </span>
          <div className="text-5xl md:text-7xl font-serif italic text-foreground tracking-tighter">
            BDT {totalImpact.toLocaleString()}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-2">
            Across {transactionDetails.length} Initiatives
          </span>
        </div>
      </header>

      {/* 2. CONTRIBUTION GRID */}
      {transactionDetails.length === 0 ? (
        <div className="py-40 text-center border-2 border-dashed border-stone-200 rounded-[4rem]">
          <p className="text-3xl font-serif italic text-stone-300">
            No records found in the ledger.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
          <AnimatePresence mode="popLayout">
            {transactionDetails.map((transaction) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={transaction._id}
                className="group flex flex-col space-y-6"
              >
                {/* Visual Identity Frame */}
                <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-stone-100">
                  <img
                    src={transaction.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    alt=""
                  />

                  {/* Amount Overlay */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl">
                      <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest">
                        Donated
                      </p>
                      <p className="text-xl font-serif italic text-black">
                        BDT{" "}
                        {(
                          transaction.donatedAmount || transaction.amount
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-3xl font-serif italic text-foreground tracking-tight leading-none">
                      {transaction.petName}
                    </h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-stone-300">
                      {new Date(
                        transaction.donationDate || transaction.donatedAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Sanctuary Beneficiary
                  </p>
                </div>

                {/* Action - Text Based */}
                <div className="pt-4 px-2">
                  <button
                    disabled={refundingId === transaction._id}
                    onClick={() => handleRefund(transaction)}
                    className="group flex items-center justify-between w-full border-b-2 border-stone-100 pb-4 hover:border-red-500 transition-all cursor-pointer disabled:opacity-20"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest text-stone-400 group-hover:text-red-500 transition-colors">
                      {refundingId === transaction._id
                        ? "Processing..."
                        : "Request Refund"}
                    </span>
                    <FiX className="text-stone-300 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 3. VERIFIED FOOTER */}
      <footer className="pt-20 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
          Boutique Ledger System
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 underline underline-offset-8 decoration-primary">
          End of Records
        </span>
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default MyDonations;
