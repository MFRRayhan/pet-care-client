import React from "react";
import {
  Github,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  PawPrint,
  ArrowRight,
  ArrowUp,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Adopt a Pet", href: "/pets" },
    { name: "Donation Us", href: "/donations" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/MFRRayhan",
      icon: <Github size={18} />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/mfr-rayhan",
      icon: <Linkedin size={18} />,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/MFR.Rayhan",
      icon: <Facebook size={18} />,
    },
  ];

  return (
    <footer className="relative bg-surface-dark text-white overflow-hidden border-t border-white/5">
      {/* Editorial Decorative Layer */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <PawPrint className="absolute top-20 left-10 w-96 h-96 -rotate-12" />
        <PawPrint className="absolute -bottom-20 -right-20 w-80 h-80 rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 py-24 border-b border-white/5">
          {/* 1. Brand Identity & Statement */}
          <div className="lg:col-span-6 space-y-12">
            <div className="flex flex-col gap-8">
              <div className="brightness-0 invert opacity-80 w-fit">
                <Logo />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif italic text-stone-200 leading-[1.1] tracking-tighter max-w-lg">
                Where every heartbeat finds its{" "}
                <span className="text-primary">forever.</span> We care for those
                who <span className="text-primary">love unconditionally.</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-10 pt-4">
              <div className="space-y-3">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                  Direct Inquiry
                </p>
                <a
                  href="mailto:md.fazlerabbirayhan786@gmail.com"
                  className="text-sm font-serif italic text-stone-300 hover:text-white transition-colors border-b border-white/10 pb-1"
                >
                  md.fazlerabbirayhan786@gmail.com
                </a>
              </div>
              <div className="space-y-3">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                  Our Home Base
                </p>
                <p className="text-sm font-serif italic text-stone-300">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* 2. Structured Navigation */}
          <div className="lg:col-span-3 lg:border-l lg:border-white/5 lg:pl-16">
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-primary mb-12">
              Explore
            </h3>
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-4 text-stone-400 hover:text-white transition-all"
                  >
                    <span className="text-lg font-serif italic tracking-tight">
                      {link.name}
                    </span>
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Social Integration & Security */}
          <div className="lg:col-span-3 lg:border-l lg:border-white/5 lg:pl-16 flex flex-col justify-between">
            <div className="space-y-10">
              <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-primary">
                Follow the Journey
              </h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-stone-500 hover:bg-white hover:text-surface-dark hover:border-white transition-all duration-700 shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-stone-500 mt-12 bg-white/5 p-4 rounded-2xl border border-white/5">
              <ShieldCheck size={20} className="text-primary" />
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                Safe & Secure <br /> Adoption Protocol
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Back to Top */}
        <div className="py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-stone-500">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Paws & Play Sanctuary
            </p>
          </div>

          {/* Boutique Back to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-primary">
              Return to Top
            </span>
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary transition-all shadow-xl bg-white/5">
              <ArrowUp
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
