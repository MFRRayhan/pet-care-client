import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Modal from "react-modal";
import { AuthContext } from "@/context/AuthContext";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Calendar,
  Tag,
  X,
  Heart,
  ShieldCheck,
  Bird,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

Modal.setAppElement("#root");

const PetDetails = () => {
  const { id } = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosPublic();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { user } = useContext(AuthContext);

  const { data: pet = {}, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/pet/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    const adoptRequestPetData = {
      petId: pet._id,
      petName: pet.name,
      petImage: pet.image,
      requestedUserName: user?.displayName,
      requestedUserPhone: phone,
      requestedUserEmail: user?.email,
      requestedUserAddress: address,
      owner: pet.owner,
      status: "requested",
    };

    try {
      await axiosSecure.post("/adoption-request", adoptRequestPetData);
      toast.success("Yay! Your request was sent to the crew.");
      setIsOpen(false);
      setPhone("");
      setAddress("");
    } catch (err) {
      toast.error("Oops! Something went wrong. Try again?");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-surface-alt">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />

        {/* Floating Category Tag */}
        <div className="absolute top-32 left-8 lg:left-24 flex items-center gap-4">
          <span className="bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
            {pet.category}
          </span>
          {!pet.adopted && (
            <div className="flex items-center gap-2 bg-background/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                Ready for adventures
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background border border-border rounded-[3.5rem] p-8 lg:p-20 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-12 h-[1px] bg-primary" />
                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.6em]">
                      Bestie Profile
                    </span>
                  </div>
                  <h1 className="text-7xl lg:text-9xl font-serif text-foreground leading-[0.8] tracking-tighter">
                    {pet.name}
                    <span className="text-primary italic">.</span>
                  </h1>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                {[
                  {
                    icon: Calendar,
                    label: "Age",
                    value: `${pet.age} Years Old`,
                  },
                  {
                    icon: MapPin,
                    label: "Hangout Spot",
                    value: pet.location,
                  },
                  {
                    icon: Heart,
                    label: "Vibe ID",
                    value: pet._id.slice(-6).toUpperCase(),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group bg-surface-alt p-8 rounded-[2.5rem] border border-border/40 transition-colors hover:bg-background hover:border-primary/30"
                  >
                    <item.icon className="w-5 h-5 text-primary mb-4" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-foreground truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Descriptions */}
              <div className="space-y-12">
                <div className="max-w-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />{" "}
                    Personal Vibe
                  </h3>
                  <p className="text-3xl font-serif italic text-foreground leading-snug">
                    "{pet.shortDescription}"
                  </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-border via-transparent to-transparent" />

                <div className="max-w-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> The
                    Full Story
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xl font-light">
                    {pet.longDescription}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Adoption Card */}
              <div className="bg-foreground text-background rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif mb-6 italic tracking-tight">
                    Start a Friendship.
                  </h3>
                  <p className="text-background/60 text-sm mb-10 leading-relaxed font-light">
                    Think {pet.name} is the one? Send a little note to the team
                    to start your journey together!
                  </p>

                  <button
                    disabled={pet.adopted}
                    onClick={() => setIsOpen(true)}
                    className={`w-full py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-500 shadow-xl flex items-center justify-center gap-3 hover:cursor-pointer
                      ${
                        pet.adopted
                          ? "bg-muted-foreground cursor-not-allowed"
                          : "bg-primary hover:bg-white hover:text-primary"
                      }`}
                  >
                    {pet.adopted ? "Found a Family!" : "Bring Home a Bestie"}
                    <CheckCircle2
                      size={14}
                      className={pet.adopted ? "block" : "hidden"}
                    />
                  </button>
                </div>
                <Sparkles
                  size={200}
                  className="absolute -bottom-16 -right-16 text-background opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000"
                />
              </div>

              {/* Logistics Box */}
              <div className="bg-background border border-border rounded-[3rem] p-8 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Pickup Area
                    </p>
                    <p className="text-sm font-bold tracking-tight">
                      {pet.location}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center text-primary">
                    <Heart size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Friendship Status
                    </p>
                    <p className="text-sm font-bold tracking-tight capitalize">
                      {pet.status === "available"
                        ? "Ready for Love"
                        : pet.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {modalIsOpen && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
            className="bg-background p-12 lg:p-16 rounded-[4rem] max-w-xl w-full mx-4 relative z-50 shadow-2xl border border-border outline-none"
            overlayClassName="fixed inset-0 bg-foreground/80 backdrop-blur-sm flex justify-center items-center z-40 p-4"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-10 h-10" />
            </button>

            <div className="mb-12 text-center">
              <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                Friendship Request
              </div>
              <h2 className="text-5xl font-serif tracking-tighter italic">
                Cuddles for {pet.name}
              </h2>
            </div>

            <form onSubmit={handleAdoptionSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    disabled
                    className="w-full px-8 py-5 rounded-[2rem] bg-surface-alt border border-border text-foreground/40 text-xs font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-4">
                    Email ID
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-8 py-5 rounded-[2rem] bg-surface-alt border border-border text-foreground/40 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-4">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Where can we call you?"
                  className="w-full px-8 py-5 rounded-[2rem] bg-background border border-border focus:border-primary outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-4">
                  Home Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows="3"
                  placeholder="Tell us where the new bestie will live!"
                  className="w-full px-8 py-5 rounded-[2rem] bg-background border border-border focus:border-primary outline-none transition-all text-sm font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-6 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-primary transition-all duration-500 mt-6 shadow-2xl"
              >
                Send My Bestie Note
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetDetails;
