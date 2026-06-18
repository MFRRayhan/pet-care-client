import React, { useContext, useState } from "react";
import {
  MoveUpRight,
  Heart,
  Calendar,
  ShieldCheck,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import toast, { Toaster } from "react-hot-toast";

import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import CheckoutForm from "@/components/SharedComponent/CheckoutForm";
import Loading from "@/components/SharedComponent/Loading";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PetDonationDetailsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // 1. MAIN CAMPAIGN QUERY
  const {
    data: campaign = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["donation-campaign", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaign-details/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // 2. RECOMMENDED CAMPAIGNS QUERY
  const { data: recommended = [] } = useQuery({
    queryKey: ["recommended-campaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-campaigns");
      return res.data.campaigns;
    },
  });

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomCampaigns =
    recommended.length > 0
      ? getRandomItems(
          recommended.filter((c) => c._id !== id),
          3,
        )
      : [];

  // 3. LOGIC HELPERS
  const progressPercentage = campaign.maxDonation
    ? (campaign.donatedAmount / campaign.maxDonation) * 100
    : 0;

  const daysLeft = campaign.lastDate
    ? Math.ceil(
        (new Date(campaign.lastDate) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  const handleDonateClick = () => {
    if (!user) return navigate("/login");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDonationAmount("");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  if (error || !campaign._id)
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center font-serif italic text-2xl">
        Oops! We couldn't find this buddy's page.
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* --- HERO HEADER --- */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-surface-alt">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={campaign.image}
          alt={campaign.petName}
          className="w-full h-full object-cover grayscale-[15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

        <div className="absolute top-32 left-8 lg:left-24 flex flex-col gap-4">
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl self-start"
          >
            A Helping Hand
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white text-5xl lg:text-8xl font-serif italic tracking-tighter leading-none"
          >
            For {campaign.petName}
            <span className="text-primary not-italic">.</span>
          </motion.h1>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT: The Narrative */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border border-border rounded-[3.5rem] p-8 lg:p-20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-10">
                <span className="w-12 h-px bg-primary" />
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.6em]">
                  Friendship ID #{campaign._id?.slice(-6).toUpperCase()}
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-serif text-foreground leading-[1.1] mb-10 tracking-tighter italic">
                "{campaign.shortDescription}"
              </h2>

              <div className="prose prose-stone max-w-none mb-16">
                <p className="text-muted-foreground leading-relaxed text-xl font-light">
                  {campaign.longDescription}
                </p>
              </div>

              <div className="inline-flex items-center gap-5 bg-surface-alt p-5 pr-10 rounded-[2rem] border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    Cared for by the crew
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {campaign.owner}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Financial Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="bg-foreground text-background rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-background/50">
                        Love Raised
                      </p>
                      <h3 className="text-5xl font-serif text-primary tracking-tighter">
                        ${campaign.donatedAmount?.toLocaleString() || "0"}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-background/30">
                        Goal
                      </p>
                      <p className="text-xl font-serif opacity-70">
                        ${campaign.maxDonation?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Boutique Progress Bar */}
                  <div className="w-full h-[4px] bg-background/10 rounded-full mb-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                      }}
                      transition={{ duration: 2, ease: "circOut" }}
                      className="h-full bg-primary"
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-12 opacity-50">
                    <span>{Math.round(progressPercentage)}% Helped</span>
                    <span>
                      {daysLeft > 0
                        ? `${daysLeft} Days to help`
                        : "Goal Reached!"}
                    </span>
                  </div>

                  <button
                    onClick={handleDonateClick}
                    disabled={campaign.isPaused || daysLeft <= 0}
                    className="w-full bg-primary hover:bg-white hover:text-primary py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-500 shadow-xl disabled:bg-muted-foreground hover:cursor-pointer disabled:cursor-not-allowed"
                  >
                    {campaign.isPaused
                      ? "On Hold"
                      : daysLeft <= 0
                        ? "Day Not Left"
                        : "Send Some Love"}
                  </button>
                </div>
                <Heart
                  size={200}
                  className="absolute -bottom-16 -right-16 text-background opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000"
                />
              </div>

              {/* Stripe Verification Box */}
              <div className="bg-background border border-border rounded-[2.5rem] p-8 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-muted-foreground">
                  Super Safe & Secure <br /> via Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RECOMMENDED SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif italic tracking-tight">
            More Besties who need love
          </h2>
          <div className="flex-1 h-px bg-border/60" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {randomCampaigns.map((item) => (
            <Link
              key={item._id}
              to={`/donations-details/${item._id}`}
              className="group block"
            >
              <div className="relative h-[450px] w-full overflow-hidden rounded-[3rem] bg-surface-alt border border-border/50 transition-all duration-700 hover:shadow-2xl">
                <img
                  src={item.image}
                  alt={item.petName}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-primary text-[9px] font-black uppercase tracking-widest mb-2">
                    Ongoing Love
                  </p>
                  <h3 className="text-3xl font-serif text-white mb-4 italic leading-none">
                    {item.petName}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      ${item.maxDonation.toLocaleString()} Goal
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-primary transition-colors">
                      <MoveUpRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- DONATION MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-foreground/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background p-12 lg:p-16 rounded-[4rem] max-w-lg w-full relative shadow-2xl border border-border"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-10 right-10 text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={32} />
              </button>

              <div className="text-center mb-12">
                <div className="inline-block bg-primary/10 text-primary px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6">
                  Spreading Kindness
                </div>
                <h3 className="text-5xl font-serif italic tracking-tighter leading-none">
                  Love for {campaign.petName}
                </h3>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-6">
                    How much love to send? (USD)
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="E.g. 50"
                    className="w-full px-10 py-6 rounded-[2.5rem] bg-surface-alt border border-border focus:border-primary outline-none transition-all text-lg font-serif"
                  />
                </div>

                {donationAmount && parseFloat(donationAmount) > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm
                        amount={parseFloat(donationAmount)}
                        campaignId={campaign._id}
                        petName={campaign.petName}
                        ownerEmail={campaign.owner}
                        image={campaign.image}
                        onSuccess={() => {
                          handleCloseModal();
                          refetch();
                          toast.success(
                            `Yay! Your gift of $${donationAmount} was sent!`,
                          );
                          setDonationAmount("");
                        }}
                      />
                    </Elements>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
};

export default PetDonationDetailsPage;
