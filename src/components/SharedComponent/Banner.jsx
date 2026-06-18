import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Heart } from "lucide-react";
import Button from "./Button";

const Banner = () => {

  return (
    <div className="relative w-full bg-background pb-20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto  relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                The Furry Friends Crew • Est. 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[7.5rem] font-serif text-foreground leading-[0.8] tracking-tighter mb-12"
            >
              Unconditional <br />
              <span className="text-primary italic font-normal relative ">
                love
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 opacity-40"
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
              <br /> has a face.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-xl md:text-2xl font-light leading-relaxed mb-14 max-w-lg mx-auto lg:mx-0"
            >
              A super chill spot where happy vibes meet wagging tails. We’re all
              about making sure your future best friend is pampered, loved, and
              ready for snuggles.
            </motion.p>

            {/* MAGNETIC CTA */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/pets" className="relative group">
                <Button text="Adopt a soul" variant="primary" />
              </Link>
            </div>
          </div>

          {/* RIGHT VISUALS */}
          <div className="lg:col-span-5 relative h-[600px] md:h-[800px] flex items-center justify-center">
            {/* Main Image Blob */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] z-20"
            >
              <div className="w-full h-full bg-background rounded-[30%_70%_70%_30%/30%_30%_70%_70%] overflow-hidden border-[16px] border-background shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000"
                  alt="Sanctuary Dog"
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -30, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 -right-4 md:right-[-5%] w-48 h-48 md:w-72 md:h-72 z-30 border-[12px] border-background rounded-[60%_40%_30%_70%/60%_40%_70%_30%] overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1000"
                alt="Sanctuary Cat"
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            {/* Decorative Label */}
            <div className="absolute bottom-10 -left-10 z-40 bg-background px-8 py-5 rounded-[2rem] shadow-2xl border border-border hidden xl:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-alt rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Care Standard
                  </span>
                  <span className="text-sm font-serif text-foreground">
                    Premium Comfort
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
