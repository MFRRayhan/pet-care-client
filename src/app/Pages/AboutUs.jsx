import React, { useState } from "react";
import {
  MoveUpRight,
  Heart,
  Star,
  ShieldCheck,
  MapPin,
  Sparkles,
  Bird,
  Plus,
  Quote,
} from "lucide-react";
import happyfamilyimage from "../../assets/hero-banner.webp";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/SharedComponent/Button";

const AboutUsSection = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { number: "2,500+", label: "Buddies Found", icon: <Bird size={20} /> },
    { number: "1,800+", label: "Happy Families", icon: <Heart size={20} /> },
    { number: "50+", label: "Playground Partners", icon: <MapPin size={20} /> },
    {
      number: "24/7",
      label: "Cuddle Support",
      icon: <ShieldCheck size={20} />,
    },
  ];

  const faqs = [
    {
      q: "What makes our home so happy?",
      a: "It’s all about the love! We focus on cage-free living, healthy snacks, and making sure every tail stays wagging for life.",
    },
    {
      q: "How do we pick our partners?",
      a: "We only team up with people who are as obsessed with pets as we are. If they don't give 5-star belly rubs, they aren't on the list!",
    },
    {
      q: "Can I come say hi to the crew?",
      a: "We mostly hang out online to help more pets, but you can always book a time to meet your future bestie at our cozy centers.",
    },
  ];

  return (
    <section className="pt-48 pb-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- 1. HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                Our Happy Story
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-7xl md:text-9xl font-serif text-foreground leading-[0.8] tracking-tighter"
            >
              Legacy of <br />
              <span className="italic text-primary">Kindness.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="pb-4"
          >
            <p className="text-muted-foreground text-xl lg:text-2xl font-light italic max-w-sm leading-relaxed border-l-2 border-primary/20 pl-8">
              More than a website. A community dedicated to the joy of finding
              your perfect best friend since 2020.
            </p>
          </motion.div>
        </div>

        {/* --- 2. MAIN STORY --- */}
        {/* --- 2. MAIN STORY (Circular Variant) --- */}
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-48">
          <div className="lg:col-span-7 relative flex justify-center lg:justify-start">
            {/* THE CIRCULAR IMAGE MODAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square w-full max-w-[500px] lg:max-w-[550px] rounded-full overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-[12px] border-background z-10"
            >
              <img
                src={happyfamilyimage}
                alt="Happy Besties"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2.5s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60" />

              {/* OVERLAPPING METRIC BADGE - Positioned to break the circle's edge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-10 right-0 md:right-20 bg-background/90 backdrop-blur-2xl p-8 rounded-[3rem] border border-primary/10 shadow-2xl z-20 hidden md:block"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
                  Smiles Created
                </p>
                <p className="text-5xl font-serif text-foreground leading-none">
                  98.4%
                </p>
              </motion.div>
            </motion.div>

            {/* Abstract Background Ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-primary/10 rounded-full -z-10 animate-[spin_20s_linear_infinite]"
              style={{ borderDasharray: "10 20" }}
            />
          </div>

          {/* RIGHT SIDE: Editorial Content (Unchanged but fits the circle better) */}
          <div className="lg:col-span-5 space-y-12 lg:pl-6">
            <div className="space-y-8">
              <Quote className="text-primary opacity-20" size={64} />
              <h3 className="text-4xl lg:text-6xl font-serif italic text-foreground tracking-tight leading-[1.1]">
                "Every pet deserves a{" "}
                <span className="text-primary not-italic">cozy home</span> to
                call their own."
              </h3>
              <p className="text-muted-foreground leading-relaxed text-xl font-light italic border-l-2 border-primary/10 pl-8">
                At{" "}
                <span className="text-foreground font-semibold not-italic">
                  PetCare
                </span>
                , we think every animal is a superstar. We built a space where
                amazing people find their new favorite roommates.
              </p>
            </div>

            <Link to="/pets" className="inline-flex items-center gap-6 group">
              <Button text="Meet the Gang" variant="primary" />
            </Link>
          </div>
        </div>

        {/* --- 3. THE VIBE: How we work --- */}
        <div className="mb-40 bg-surface-alt rounded-[5rem] p-12 lg:p-24 relative overflow-hidden border border-border/40">
          <div className="max-w-4xl relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-primary font-bold text-[10px] uppercase tracking-[0.6em]">
                The Vibe
              </p>
            </div>
            <h3 className="text-6xl md:text-7xl font-serif italic tracking-tighter text-foreground mb-16">
              Our Pawsitive Steps.
            </h3>

            <div className="grid md:grid-cols-1 gap-16">
              {[
                {
                  step: "01",
                  title: "Heartfelt Hello",
                  desc: "We work with the best shelters to find pets who are ready for their close-up and a brand new start.",
                },
                {
                  step: "02",
                  title: "Healthy Glow-up",
                  desc: "Full health checks and specialized care plans to make sure every bestie is feeling 100% and ready to play.",
                },
                {
                  step: "03",
                  title: "Perfect Pairing",
                  desc: "We’re matchmakers! We use our secret sauce to pair a pet's personality with your lifestyle for a lifetime of joy.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col md:flex-row gap-8 md:gap-16 group"
                >
                  <span className="text-5xl md:text-6xl font-serif italic text-primary/20 group-hover:text-primary transition-colors duration-700">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-4 uppercase tracking-tighter">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-xl">
                      {item.desc}
                    </p>
                    <div className="h-px w-0 group-hover:w-full bg-primary/20 transition-all duration-1000 mt-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* --- 4. STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-[4rem] overflow-hidden mb-40 shadow-2xl shadow-primary/5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-background p-16 text-center group hover:bg-surface-alt transition-all duration-700 hover:cursor-pointer"
            >
              <div className="text-primary mb-8 flex justify-center opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {stat.icon}
              </div>
              <p className="text-6xl font-serif text-foreground tracking-tighter mb-3">
                {stat.number}
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* --- 5. THE SQUAD: Leadership --- */}
        <div className="mb-40">
          <div className="max-w-xl mb-20">
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.6em] mb-4">
              The Squad
            </p>
            <h3 className="text-6xl md:text-7xl font-serif italic tracking-tighter text-foreground">
              Dreamers & Doers.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              {
                name: "Dr. Elena Vance",
                role: "Health Hero",
                img: "https://images.pexels.com/photos/3714743/pexels-photo-3714743.jpeg",
              },
              {
                name: "Julian Thorne",
                role: "Director of Fun",
                img: "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg",
              },
              {
                name: "Sarah Al-Fayed",
                role: "Happiness Strategist",
                img: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-[4rem] overflow-hidden mb-8 border border-border transition-all duration-700 group-hover:rounded-[2rem] shadow-xl">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] hover:cursor-pointer"
                  />
                </div>
                <h4 className="text-3xl font-serif italic text-foreground leading-none mb-3">
                  {member.name}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- 6. FAQ --- */}
        <div className="grid lg:grid-cols-12 gap-20 mb-40 items-start ">
          <div className="lg:col-span-5">
            <p className="text-primary font-bold text-[10px] uppercase tracking-[0.6em] mb-6">
              Curious?
            </p>
            <h3 className="text-6xl font-serif italic tracking-tighter text-foreground mb-10">
              Common Questions.
            </h3>
            <p className="text-muted-foreground text-xl font-light leading-relaxed mb-12 border-l-2 border-primary/20 pl-8">
              We love a good chat. If you want to know more about how we care
              for our gang or find our families, we're always here to help.
            </p>
          </div>
          <div className="lg:col-span-7 space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-border/60 pb-6 hover:cursor-pointer"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-6 text-left group hover:cursor-pointer"
                >
                  <span className="text-2xl font-serif italic text-foreground/80 group-hover:text-primary transition-colors">
                    {faq.q}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-500 ${activeFaq === i ? "bg-primary border-primary text-white rotate-45" : "group-hover:border-primary text-primary"}`}
                  >
                    <Plus size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 text-muted-foreground font-light leading-relaxed text-lg italic max-w-2xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* --- 7. CTA --- */}
        <motion.div
          whileHover={{ scale: 0.99 }}
          transition={{ duration: 0.8 }}
          className="relative bg-foreground rounded-[5rem] p-20 lg:p-32 overflow-hidden text-center group shadow-2xl"
        >
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Star className="text-primary mx-auto mb-10" size={56} />
            </motion.div>
            <h3 className="text-6xl lg:text-8xl font-serif text-background italic tracking-tighter mb-10 leading-none">
              Start Your Own <br /> Happy Story.
            </h3>
            <p className="text-background/50 text-xl md:text-2xl font-light max-w-2xl mx-auto mb-16 leading-relaxed">
              Whether you're looking for a bestie or just want to help, you're
              an awesome part of what we do.
            </p>
            <Link to="/pets">
              <button className="bg-primary text-white px-16 py-8 rounded-2xl text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-white hover:text-primary transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 hover:cursor-pointer">
                Meet the Pets
              </button>
            </Link>
          </div>
          <Bird
            size={400}
            className="absolute -bottom-24 -right-24 text-background opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-[2s]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;
