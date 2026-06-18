import React, { useContext, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiX, FiAlertTriangle } from "react-icons/fi";
import { AuthContext } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import {
  Camera,
  Fingerprint,
  HeartHandshake,
  Loader2,
  UserPlus,
} from "lucide-react";

const Register = () => {
  const { createUser, updataUserProfile, logInWithGoogle } =
    useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // UI States
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // New States for Preview and Instant Errors
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  const imgbbAPI = import.meta.env.VITE_IMGBB_API_KEY;

  // Handle Image Change for Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const imageFile = e.target.image.files[0];

    // Field-by-field Validation
    const newErrors = {};
    if (!name) newErrors.name = "Your name is required.";
    if (!email) newErrors.email = "Your email is required.";
    if (!passwordRegex.test(password)) {
      newErrors.password = "Must be 6+ characters with numbers and mixed case.";
    }
    if (!imageFile) newErrors.image = "A profile portrait is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      const imageUrl = data.data.url;

      await createUser(email, password);
      await updataUserProfile({ displayName: name, photoURL: imageUrl });

      const userInfo = { name, email, image: imageUrl, role: "user" };
      await axiosPublic.post("/register", userInfo);

      setSuccessModal(true);
    } catch (err) {
      toast.error("Registration interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    logInWithGoogle()
      .then(async (res) => {
        const userInfo = {
          name: res?.user?.displayName,
          email: res?.user?.email,
          image: res?.user?.photoURL,
          role: "user",
        };
        await axiosPublic.post("/register", userInfo);
        toast.success("Welcome to the Sanctuary.");
        navigate("/");
      })
      .catch(() => toast.error("Google authentication failed."));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row-reverse overflow-x-hidden mt-24">
      {/* RIGHT: Brand Visual */}
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
          src="https://images.unsplash.com/photo-1551730459-92db2a308d6a?q=80&w=1887&auto=format&fit=crop"
          alt="Register Visual"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent opacity-90" />

        <div className="relative z-10 w-full text-right">
          <div className="flex items-center justify-end gap-4 mb-12">
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.6em]">
              Establish Membership
            </span>
            <div className="w-10 h-[1px] bg-primary" />
          </div>
          <h2 className="text-7xl xl:text-8xl font-serif text-white italic tracking-tighter leading-[0.8] mb-12">
            Start Your <br />{" "}
            <span className="text-primary not-italic">Legacy.</span>
          </h2>
          <p className="text-stone-400 text-xl font-light leading-relaxed max-w-sm ml-auto italic">
            Join a community dedicated to the architecture of animal welfare and
            compassionate care.
          </p>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center border-t border-white/5 pt-12">
          <div className="space-y-2">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
              Registration Status
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Accepting New Residents
            </p>
          </div>
          <HeartHandshake className="text-primary/10" size={100} />
        </div>
      </motion.div>

      {/* LEFT: Registration Form */}
      <div className="flex-1 flex flex-col items-center px-8 lg:px-24 bg-background relative min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md flex flex-col justify-center min-h-screen py-16 relative z-10"
        >
          {/* Tabs */}
          <div className="flex items-center gap-12 border-b border-border mb-16">
            <NavLink
              to="/login"
              className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 text-muted-foreground hover:text-foreground transition-all"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="text-[10px] font-black uppercase tracking-[0.4em] pb-6 relative text-primary"
            >
              Register
              <motion.div
                layoutId="tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
              />
            </NavLink>
          </div>

          <div className="space-y-4 mb-16">
            <h1 className="text-5xl font-serif italic text-foreground tracking-tighter">
              Create Profile.
            </h1>
            <p className="text-muted-foreground text-sm font-light leading-relaxed italic">
              Enter your details to initialize your portfolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10" noValidate>
            {/* Custom Image Upload with LIVE PREVIEW */}
            <div className="space-y-4 group">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary">
                Upload Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`w-full px-8 py-6 rounded-full bg-surface-alt border border-dashed transition-all flex items-center justify-between ${errors.image ? "border-red-400" : "border-border group-hover:border-primary"}`}
                >
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-8 h-8 rounded-full object-cover border border-primary/50"
                      />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {imagePreview ? "Portrait Selected" : "Choose Image File"}
                    </span>
                  </div>
                  <Camera size={18} className="text-muted-foreground" />
                </div>
              </div>
              {errors.image && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-tighter ml-4">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="space-y-8">
              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Johnathan Doe"
                  className="w-full bg-transparent border-b border-border py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-stone-200"
                />
                {errors.name && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-tighter">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@sanctuary.com"
                  className="w-full bg-transparent border-b border-border py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-stone-200"
                />
                {errors.email && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-tighter">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground group-focus-within:text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-border py-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-stone-200"
                />
                {errors.password && (
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-tighter">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-foreground text-background py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all duration-700 flex items-center justify-center gap-4 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Fingerprint size={16} />
              )}
              {loading ? "Initializing..." : "Sign Up"}
            </button>
          </form>

          {/* Alternative Auth */}
          <div className="mt-16 space-y-8">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                Other sign up options
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
                Sign Up with Google
              </span>
            </button>
          </div>

          <p className="mt-12 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Existing Member?{" "}
            <Link
              to="/login"
              className="text-primary hover:tracking-[0.3em] transition-all ml-2 underline underline-offset-8 decoration-primary/20"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative bg-background max-w-sm w-full rounded-[3.5rem] p-12 text-center shadow-2xl border border-border"
            >
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-8 bg-emerald-50 text-emerald-500">
                <FiCheckCircle size={36} />
              </div>
              <h2 className="text-3xl font-serif italic tracking-tighter mb-4 text-foreground">
                Success.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-10 italic">
                Your membership has been established. Welcome to the collection.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-5 rounded-full bg-foreground text-background text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all cursor-pointer"
              >
                Enter Sanctuary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Register;
