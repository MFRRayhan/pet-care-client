import React from "react";
import { Link } from "react-router";
import { MoveUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const PetCard = ({ pet }) => {
  const { _id, name, age, image, location, category } = pet;

  // Animation variants for the container
  const containerVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom luxury ease
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }} // Gentle lift on hover
      className="relative"
    >
      <Link to={`/pets/${_id}`} className="group block w-full">
        <div className="relative w-full h-[520px] overflow-hidden rounded-[3rem] bg-surface-alt shadow-sm transition-shadow duration-700 group-hover:shadow-2xl group-hover:shadow-primary/10">
          {/* 1. THE IMAGE (Animated Zoom & Slight Tilt) */}
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-110 group-hover:rotate-2"
          />

          {/* 2. TOP CAPTION (Staggered Reveal) */}
          <div className="absolute top-8 inset-x-8 flex justify-between items-start pointer-events-none z-20">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-background/90 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                {category}
              </span>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-primary px-5 py-2 rounded-full shadow-xl"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                {age} Yrs Old
              </span>
            </motion.div>
          </div>

          {/* 3. THE INFO PANEL (Floating Slide-up) */}
          <div className="absolute inset-x-6 bottom-6 z-20">
            <motion.div
              className="bg-background p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-border/50"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              // This makes the panel "float" even more when the whole card is hovered
              animate={{ y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div>
                <h2 className="text-4xl font-serif text-foreground leading-none tracking-tighter mb-2">
                  {name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={12} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {location}
                  </span>
                </div>
              </div>

              {/* Signature Button (Icon Animation) */}
              <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden">
                <motion.div
                  whileHover={{ x: 5, y: -5 }} // Subtle diagonal "pop"
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MoveUpRight size={20} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 4. HOVER OVERLAY (Subtle Depth) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Subtle Glimmer Effect on Hover */}
          <motion.div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

export default PetCard;
