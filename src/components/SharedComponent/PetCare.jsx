import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight,
  Activity,
  Plus,
} from "lucide-react";

// --- REFINED COUNTER ---
const Counter = ({ value, suffix }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(v) {
          nodeRef.current.textContent = Math.round(v).toLocaleString() + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, suffix]);

  return <span ref={nodeRef}>0{suffix}</span>;
};

const PetCare = () => {
  const buttonRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMagnetic = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setBtnPos({ x, y });
  };

  const careSteps = [
    {
      title: "Health",
      desc: "Daily checkups for happy tails.",
      icon: <Activity />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Snacks",
      desc: "Yummy, healthy natural treats.",
      icon: <Zap />,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Fun",
      desc: "Playtime and favorite toys.",
      icon: <Heart />,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Safe",
      desc: "Cozy naps in a clean home.",
      icon: <ShieldCheck />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-background py-24">
      <div className="max-w-7xl mx-auto ">
        {/* --- HEADER BLOCK --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-24 pb-16 border-b border-border">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                How we love them
              </span>
            </motion.div>
            <h2 className="text-7xl md:text-[8rem] font-serif text-foreground leading-[0.8] tracking-tighter">
              Made with <br />
              <span className="text-primary italic font-normal">
                pure love.
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-xl font-light leading-relaxed max-w-md lg:ml-auto italic text-right hidden lg:block pr-8 border-r-2 border-primary/20">
            Our friendly approach ensures every furry friend feels happy,
            relaxed, and totally at home.
          </p>
        </div>

        {/* --- MAIN FEATURE GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {careSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-background p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-2xl transition-all duration-500 group hover:cursor-pointer"
            >
              <div
                className={`w-16 h-16 ${step.color} rounded-[1.25rem] flex items-center justify-center mb-10 transition-transform group-hover:scale-110`}
              >
                {React.cloneElement(step.icon, { className: "w-7 h-7" })}
              </div>
              <h3 className="text-3xl font-serif text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-8">
                {step.desc}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
                <Plus className="w-3 h-3" /> More Joy
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- STATS SECTION --- */}
        <div className="relative overflow-hidden bg-surface-dark rounded-[4rem] p-16 md:p-24 text-white mb-32">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_40%)]" />

          <div className="relative z-10 flex flex-wrap justify-between gap-16">
            {[
              { n: 2500, l: "Buddies Found Homes", s: "+" },
              { n: 1800, l: "Families United", s: "+" },
              { n: 50, l: "Happy Places", s: "" },
              { n: 24, l: "Cuddle Support", s: "/7" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-6xl md:text-8xl font-serif tracking-tighter mb-4">
                  <Counter value={stat.n} suffix={stat.s} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">
                  {stat.l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- BOTTOM CONTENT --- */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          {/* Inventory */}
          <div className="bg-surface-alt rounded-[3.5rem] p-12 border border-border/50">
            <h3 className="text-4xl font-serif text-foreground mb-12">
              Bestie Essentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Yummy Meals",
                "Comfy Beds",
                "Fun Playtime",
                "Sparkly Clean",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-background px-8 py-5 rounded-2xl border border-border text-[11px] font-bold text-foreground uppercase tracking-widest shadow-sm flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency / Care */}
          <div className="bg-background rounded-[3.5rem] p-12 border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
              <ShieldCheck className="w-64 h-64 text-foreground" />
            </div>
            <h3 className="text-4xl font-serif text-foreground mb-8">
              Always Here
            </h3>
            <p className="text-muted-foreground text-xl font-light leading-relaxed mb-12 max-w-md">
              We’re always ready for snuggles or help, keeping our friends safe
              and happy around the clock.
            </p>

            <motion.button
              ref={buttonRef}
              onMouseMove={handleMagnetic}
              onMouseLeave={() => setBtnPos({ x: 0, y: 0 })}
              animate={{ x: btnPos.x, y: btnPos.y }}
              className="flex items-center gap-6 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-foreground">
                Our Promises
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCare;
