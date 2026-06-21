import React, { useContext, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MoveUpRight, ShieldCheck, Fingerprint, Bird } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

const Login = () => {
  const { signInUser, logInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  // UI States
  const [errorModal, setErrorModal] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const userEmail = e.target.email.value.trim();
    const userPassword = e.target.password.value.trim();
    let valid = true;

    if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
      setEmailError("A valid email is required to identify your account.");
      valid = false;
    }
    if (!userPassword) {
      setPasswordError("Please enter your security credentials.");
      valid = false;
    }

    if (!valid) return;

    try {
      await signInUser(userEmail, userPassword);
      toast.success("Welcome back to the Sanctuary.");
      navigate("/");
    } catch {
      setErrorModal({
        title: "Access Denied",
        message:
          "The credentials provided do not match our records. Please verify your details and try again.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await logInWithGoogle();
      toast.success("Identity verified via Google.");
      navigate("/");
    } catch {
      setErrorModal({
        title: "Authentication Failed",
        message:
          "We couldn't establish a connection with Google. Please try again or use your email credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden mt-24">
      {/* LEFT: Editorial Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hidden lg:flex lg:w-1/2 relative bg-surface-dark items-center justify-center p-20 overflow-hidden"
      >
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
          alt="Boutique Visual"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

        <div className="relative z-10 w-full">
          <div className="flex items-center gap-4 mb-12">
            <span className="w-12 h-[1px] bg-primary" />
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.6em]">
              Secure Gateway
            </span>
          </div>

          <h2 className="text-8xl font-serif text-white italic tracking-tighter leading-[0.8] mb-12">
            Identity <br />
            <span className="text-primary not-italic">Verification.</span>
          </h2>

          <p className="text-stone-400 text-xl font-light leading-relaxed max-w-sm italic">
            Returning to the sanctuary? Please verify your credentials to manage
            your residents and contributions.
          </p>
        </div>

        {/* Dynamic Status Bar */}
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center border-t border-white/5 pt-12">
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
              System Integrity
            </p>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Encrypted Session Active
              </p>
            </div>
          </div>
          <Bird className="text-primary/10 -rotate-12" size={120} />
        </div>
      </motion.div>

      {/* RIGHT: Sophisticated Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-24 bg-background relative mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-16"
        >
          {/* Navigation Tabs */}
          <div className="flex items-center gap-12 border-b border-border">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-[10px] font-black uppercase tracking-[0.4em] pb-6 transition-all relative ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Login
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
              />
            </NavLink>
            <NavLink
              to="/register"
              className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 text-muted-foreground hover:text-foreground transition-all"
            >
              Register
            </NavLink>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-serif italic text-foreground tracking-tighter">
              Welcome Back.
            </h1>
            <p className="text-muted-foreground text-sm font-light leading-relaxed italic">
              Log in to your dashboard to resume oversight.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10" noValidate>
            <div className="space-y-8">
              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground transition-colors group-focus-within:text-primary">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@sanctuary.com"
                  className="w-full bg-transparent border-b border-border py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-stone-200"
                />
                {emailError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight mt-2">
                    {emailError}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground transition-colors group-focus-within:text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-border py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-stone-200"
                />
                {passwordError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-tight mt-2">
                    {passwordError}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-foreground text-background py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all duration-700 flex items-center justify-center gap-4 cursor-pointer shadow-xl shadow-foreground/5"
            >
              Login <MoveUpRight size={14} />
            </button>
          </form>

          {/* Social Divider */}
          <div className="space-y-8">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Other login options
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-5 rounded-full border border-border flex items-center justify-center gap-4 hover:bg-surface-alt transition-all group cursor-pointer"
            >
              <Fingerprint
                className="text-primary group-hover:scale-110 transition-transform"
                size={18}
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Login with Google
              </span>
            </button>
          </div>

          <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            New to the Sanctuary?{" "}
            <Link
              to="/register"
              className="text-primary hover:tracking-[0.3em] transition-all ml-2 underline underline-offset-8 decoration-primary/20"
            >
              Create Portfolio
            </Link>
          </p>
        </motion.div>
      </div>

      {/* BOUTIQUE ERROR MODAL */}
      <AnimatePresence>
        {errorModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorModal(null)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-background max-w-sm w-full rounded-[3rem] p-12 text-center shadow-2xl border border-border"
            >
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 bg-red-50 text-red-500">
                <FiAlertTriangle size={36} />
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4 text-foreground">
                {errorModal.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-10 italic">
                {errorModal.message}
              </p>
              <button
                onClick={() => setErrorModal(null)}
                className="w-full py-5 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all cursor-pointer"
              >
                Return to Login
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Login;
