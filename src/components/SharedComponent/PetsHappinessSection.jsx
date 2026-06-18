import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Star, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";

const PetsHappinessSection = () => {
  const buttonRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMagnetic = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    setBtnPos({ x, y });
  };

  const features = [
    {
      title: "Snuggle Squad",
      desc: "Our team is obsessed with pets! We provide 24/7 belly rubs and personalized love for every furry friend.",
      icon: <UserCheck />,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Safe & Sound",
      desc: "A super chill, peaceful space where your pets can play and snooze without a single worry in the world.",
      icon: <ShieldCheck />,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Total Love",
      desc: "We treat every resident like a member of our own family. It's all about kindness and happy vibes here.",
      icon: <Heart />,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Top-Tier Treats",
      desc: "Healthy, yummy meals and regular wellness checks to keep those tails wagging and spirits high.",
      icon: <Star />,
      color: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-surface-alt py-32 lg:py-48">
      <div className="max-w-7xl mx-auto ">
        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-end pb-16 border-b border-border mb-24 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                The Pawsitive Promise
              </span>
            </motion.div>
            <h2 className="text-7xl md:text-[8rem] font-serif text-foreground leading-[0.8] tracking-tighter">
              Happiness is our <br />
              <span className="text-primary italic font-normal">
                favorite thing.
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground text-xl font-light max-w-sm lg:ml-auto leading-relaxed italic border-r-2 border-primary/20 pr-8 text-right hidden lg:block">
            We’ve built a cozy home where every tiny detail is designed for the
            pure joy and comfort of our residents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          {/* FEATURES */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-[1.25rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}
                >
                  {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                </div>
                <h3 className="text-3xl font-serif text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg font-light leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* IMAGE BLOCK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-[16px] border-background bg-background">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200"
                alt="Happy besties"
                className="w-full h-full object-cover transition-transform duration-1000 grayscale-[10%] hover:grayscale-0 hover:scale-105"
              />
            </div>

            {/* COOL BADGE */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -right-4 lg:-right-10 bg-surface-dark text-white p-10 rounded-[3rem] shadow-2xl max-w-[280px]"
            >
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-4">
                Our Vibe
              </p>
              <p className="text-xl font-serif italic leading-snug">
                "Where tails find their wag and every pet finds their person."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* MAGNETIC CTA */}
        <div className="mt-40 flex justify-center">
          <Link to="/about-us" className="relative group">
            <Button text="See the magic" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PetsHappinessSection;
