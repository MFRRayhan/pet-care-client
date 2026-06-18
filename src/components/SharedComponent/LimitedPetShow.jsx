import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import PetCard from "./PetCard"; 
import Button from "./Button";

const LimitedPetShow = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // Magnetic Button Logic for the "Explore" footer
  const footerBtnRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMagnetic = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      footerBtnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setBtnPos({ x, y });
  };

  useEffect(() => {
    axiosPublic
      .get("/limitedPets")
      .then((res) => {
        setPets(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [axiosPublic]);

  if (loading) return null;

  return (
    <section className="w-full overflow-hidden bg-white py-32">
      <div className="max-w-7xl mx-auto ">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 border-b border-stone-100 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em]">
                {/* CUTE SWAP: "Sanctuary Residents" removed */}
                Cool Paws & Happy Hearts
              </span>
            </motion.div>
            <h2 className="text-7xl md:text-[8rem] font-serif text-stone-900 leading-[0.8] tracking-tighter">
              Ready to <br />
              <span className="text-primary italic font-normal">go home.</span>
            </h2>
          </div>
          <p className="text-stone-400 text-xl max-w-[280px] font-serif italic text-right hidden md:block leading-relaxed">
            {/* CUTE SWAP: Friendly and warm message */}
            Find your new partner in crime and fill your life with wagging tails
            and loud purrs.
          </p>
        </div>

        {/* MAPPING THE PET CARD COMPONENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-16">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>

        {/* MAGNETIC VIEW ALL BUTTON */}
        <div className="mt-40 flex justify-center">
          <Link to="/pets" className="relative group">
            <Button
              text="See all the cuties"
              subtext="Pick your favorite bestie" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LimitedPetShow;
