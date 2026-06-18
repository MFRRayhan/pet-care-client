import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Home, Stethoscope, Check } from "lucide-react";

const FeatureBlock = ({ service, index }) => {
  const isEven = index % 2 === 0;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 md:gap-24 relative`}
    >
      {/* Background Numeral */}
      <span className="absolute -top-16 left-0 text-[14rem] md:text-[22rem] font-serif italic text-stone-100/50 select-none -z-10 leading-none">
        0{index + 1}
      </span>

      {/* Image Box */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[55%] relative"
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-[3rem] border-[12px] md:border-[16px] border-white shadow-2xl bg-white">
          <motion.img
            style={{ y: imgY }}
            src={service.img}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover scale-110 grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:cursor-pointer"
          />
        </div>

        {/* Floating Tag */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className={`absolute -bottom-8 ${isEven ? "-right-8" : "-left-8"} z-20 bg-white p-6 rounded-[2rem] shadow-xl hidden lg:block border border-stone-100`}
        >
          <div
            className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}
          >
            {React.cloneElement(service.icon, { className: "w-6 h-6" })}
          </div>
          <p className="text-[9px] font-black tracking-[0.3em] text-primary uppercase">
            Vibe {index + 1}
          </p>
        </motion.div>
      </motion.div>

      {/* Text Column */}
      <div className="w-full md:w-[45%] z-10">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-5xl md:text-7xl font-serif text-stone-900 leading-[0.9] mb-8">
            {service.title.split(" ").slice(0, -1).join(" ")} <br />
            <span className="italic text-primary font-normal relative inline-block">
              {service.title.split(" ").pop()}
            </span>
          </h3>

          <p className="text-stone-500 text-lg md:text-xl font-light leading-relaxed mb-10 pl-8 border-l-2 border-primary/20 italic">
            {service.desc}
          </p>

          {/* Specification Block */}
          <div className="flex flex-wrap gap-8 pt-6 border-t border-stone-100">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 mb-2">
                The Cool Part
              </p>
              <div className="flex items-center gap-2 text-stone-900">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {service.spec}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-300 mb-2">
                Our Promise
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-900">
                {service.metric}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const WeProvideFeatures = () => {
  const services = [
    {
      title: "Cozy Nap",
      desc: "Every cutie needs a soft place to land. We offer around-the-clock snuggles and a super chill space for pets to find their groove.",
      spec: "Infinite Belly Rubs",
      metric: "Luxury Snooze Spots",
      icon: <Heart />,
      color: "bg-primary/10 text-primary",
      img: "https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=1200",
    },
    {
      title: "Bestie Matching",
      desc: "Our matchmakers are pros at finding your soulmate. We pair cool humans with even cooler pets for a total friendship glow-up.",
      spec: "Pawsitive Connections",
      metric: "100% Tail Wags",
      icon: <Home />,
      color: "bg-stone-100 text-stone-900",
      img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1200",
    },
    {
      title: "Health & Glow",
      desc: "From wet noses to wagging tails, we keep our residents feeling 10/10. Full checkups and treats included to keep them shining.",
      spec: "Sparkle & Vitality",
      metric: "Healthy Happy Hearts",
      icon: <Stethoscope />,
      color: "bg-emerald-50 text-emerald-600",
      img: "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=1200",
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-[#fffcf9] py-32">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        <div className="mb-40 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-stone-100 pb-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-10 h-[1px] bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                The Happy Pet Way
              </span>
            </motion.div>
            <h2 className="text-7xl md:text-[8rem] font-serif text-stone-900 leading-[0.8] tracking-tighter">
              Spreading <br />
              <span className="text-primary italic font-normal">
                Good Vibes.
              </span>
            </h2>
          </div>
          <p className="text-stone-400 text-xl max-w-[320px] font-light leading-relaxed italic pr-6 text-right hidden md:block">
            Designing a world where every furry friend is treated like the
            absolute legend they are.
          </p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-48 md:space-y-80">
          {services.map((service, idx) => (
            <FeatureBlock key={idx} service={service} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeProvideFeatures;
