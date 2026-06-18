import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { MoveRight } from "lucide-react";

const Button = ({
  text,
  subtext,
  size = 80,
  iconSize = 28,
  variant = "default",
  className = "",
}) => {
  const ref = useRef(null);

  // 1. Setup Spring-based animation for smooth "magnetic" feel
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Calculate distance from center (0.35 is the magnetic strength)
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    x.set(middleX * 0.35);
    y.set(middleY * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    default:
      "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground",
    primary:
      "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-[0_20px_50px_rgba(var(--primary),0.3)]",
  };

  const textHoverColor =
    variant === "primary" ? "group-hover:text-primary" : "";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x, y }}
      className={`relative inline-flex items-center gap-8 group cursor-pointer ${className}`}
    >
      {/* Dynamic Circle container */}
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`shrink-0 rounded-full border border-border flex items-center justify-center text-foreground transition-all duration-500 ease-out ${variants[variant]}`}
      >
        <MoveRight
          style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>

      {/* Label Container - Increased sizes */}
      <div className="flex flex-col gap-1">
        <span
          className={`text-[14px] md:text-[15px] font-black uppercase tracking-[0.3em] text-foreground transition-colors duration-300 leading-none ${textHoverColor}`}
        >
          {text}
        </span>
        {subtext && (
          <span className="text-[12px] md:text-[13px] font-serif italic text-muted-foreground leading-tight">
            {subtext}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default Button;
