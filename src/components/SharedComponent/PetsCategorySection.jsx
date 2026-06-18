import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";

const PetsCategorySection = () => {
  const buttonRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMagnetic = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } =
      buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setBtnPos({ x, y });
  };

  const resetMagnetic = () => setBtnPos({ x: 0, y: 0 });

  const categories = [
    {
      name: "Dogs",
      img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800",
      mask: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
      pos: "lg:top-0 lg:left-0", // Top Left
      size: "w-full lg:w-[280px] h-[380px]",
      rotate: -4,
    },
    {
      name: "Cats",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
      mask: "rounded-[60%_40%_30%_70%/60%_40%_70%_30%]",
      pos: "lg:top-40 lg:left-[32%]", // Shifted Right and Down to clear Dogs
      size: "w-full lg:w-[260px] h-[400px]",
      rotate: 2,
    },
    {
      name: "Rabbits",
      img: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800",
      mask: "rounded-[40%_60%_60%_40%/60%_30%_70%_40%]",
      pos: "lg:top-0 lg:right-0", // Moved to far right to clear center
      size: "w-full lg:w-[280px] h-[380px]",
      rotate: 5,
    },
    {
      name: "Birds",
      img: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1000",
      mask: "rounded-[50%_50%_20%_80%/50%_20%_80%_50%]",
      pos: "lg:bottom-0 lg:left-[5%]", // Bottom Left
      size: "w-full lg:w-[240px] h-[300px]",
      rotate: -6,
    },
  ];

  return (
    <section className="relative w-full py-24 lg:py-32 bg-surface-alt overflow-hidden">
      <div className="max-w-7xl mx-auto  relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          {/* LEFT: Collage */}
          <div className="lg:col-span-8 relative h-auto lg:h-[850px] grid grid-cols-1 md:grid-cols-2 lg:block gap-12">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className={`lg:absolute ${cat.pos} ${cat.size} group cursor-pointer`}
                style={{ zIndex: 10 + i }}
              >
                {/* THE ROTATED WRAPPER */}
                <div
                  className="w-full h-full transition-all duration-700 ease-out"
                  style={{ transform: `rotate(${cat.rotate}deg)` }}
                >
                  <div
                    className={`relative w-full h-full ${cat.mask} bg-background shadow-xl border-[10px] border-background overflow-hidden`}
                    style={{
                      isolation: "isolate",
                      WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                      clipPath: "content-box",
                    }}
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-white text-3xl font-serif italic">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT: Text & Action */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-8"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                Choose your companion
              </span>
            </motion.div>

            <h2 className="text-6xl md:text-8xl font-serif text-foreground leading-[0.8] tracking-tighter mb-10">
              Meet your new
              <br />
              <span className="italic text-primary font-normal relative inline-block">
                best friend.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2 opacity-30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q50,10 100,5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed mb-12 max-w-xs mx-auto lg:mx-0">
              Explore our residents by category and find the perfect match for
              your lifestyle and home.
            </p>

            {/* MAGNETIC BUTTON */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/pets" className="relative group">
                <motion.div
                  ref={buttonRef}
                  onMouseMove={handleMagnetic}
                  onMouseLeave={resetMagnetic}
                  animate={{ x: btnPos.x, y: btnPos.y }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    mass: 0.1,
                  }}
                  className="flex items-center gap-6"
                >
                  <Button text="Explore all pets" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetsCategorySection;
