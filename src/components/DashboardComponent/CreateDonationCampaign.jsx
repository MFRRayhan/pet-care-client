import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FiPlus, FiArrowRight, FiImage } from "react-icons/fi";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const CreateDonationCampaign = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    petName: "",
    maxDonation: "",
    lastDate: "",
    shortDescription: "",
    longDescription: "",
  });

  const imgbbAPI = import.meta.env.VITE_imgbb_api_key;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!imageFile) newErrors.image = "Portrait is required";
    if (!formData.petName) newErrors.petName = "Name is required";
    if (!formData.maxDonation) newErrors.maxDonation = "Goal is required";
    if (!formData.lastDate) newErrors.lastDate = "Date is required";
    if (!formData.shortDescription)
      newErrors.shortDescription = "Intro required";
    if (formData.longDescription.length < 20)
      newErrors.longDescription = "More details needed";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("image", imageFile);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
        data,
      );

      const campaignData = {
        ...formData,
        maxDonation: parseFloat(formData.maxDonation),
        image: res.data.data.url,
        owner: user.email,
        ownerName: user.displayName,
        donatedAmount: 0,
        isPaused: false,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/donation-campaigns", campaignData);
      toast.success("Campaign Registered.");
      setFormData({
        petName: "",
        maxDonation: "",
        lastDate: "",
        shortDescription: "",
        longDescription: "",
      });
      setImagePreview(null);
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* 1. EDITORIAL HEADER */}
      <header className="border-b-2 border-foreground pb-16 mb-20">
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
            Funding Initiative
          </span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            New <br /> <span className="text-primary italic">Campaign.</span>
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-24"
      >
        {/* LEFT: PORTRAIT UPLOAD */}
        <div className="lg:col-span-4 space-y-8">
          <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
            Campaign Portrait
          </p>
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 group hover:border-primary transition-all cursor-pointer"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <FiImage className="text-stone-300 mb-4" size={48} />
                <p className="text-lg font-serif italic text-stone-400">
                  Select Portrait
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          {errors.image && (
            <p className="text-primary text-[10px] font-bold uppercase">
              {errors.image}
            </p>
          )}
        </div>

        {/* RIGHT: DATA FIELDS */}
        <div className="lg:col-span-8 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            <BoutiqueField
              label="Pet's Name"
              name="petName"
              placeholder="Who needs help?"
              value={formData.petName}
              onChange={handleChange}
              error={errors.petName}
            />
            <BoutiqueField
              label="Donation Goal (BDT)"
              name="maxDonation"
              type="number"
              placeholder="e.g. 10000"
              value={formData.maxDonation}
              onChange={handleChange}
              error={errors.maxDonation}
            />
            <BoutiqueField
              label="Last Date to Donate"
              name="lastDate"
              type="date"
              value={formData.lastDate}
              onChange={handleChange}
              error={errors.lastDate}
            />
          </div>

          <BoutiqueField
            label="Catchy Intro"
            name="shortDescription"
            placeholder="Sum up the urgency in one sentence..."
            value={formData.shortDescription}
            onChange={handleChange}
            error={errors.shortDescription}
            fullWidth
          />

          <div className="space-y-6">
            <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
              Full Story & Financial Need
            </p>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={6}
              className="w-full bg-transparent border-b-2 border-stone-800 py-4 text-2xl font-serif italic text-black outline-none focus:border-primary transition placeholder:text-stone-200 resize-none"
              placeholder="Explain why this companion needs support..."
            />
            {errors.longDescription && (
              <p className="text-primary text-[10px] font-bold uppercase">
                {errors.longDescription}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <div className="pt-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-between w-full border-b-4 border-foreground pb-6 hover:border-primary transition-all disabled:opacity-20 cursor-pointer"
            >
              <span className="text-5xl md:text-7xl font-serif italic tracking-tighter text-foreground">
                {isSubmitting ? "Initiating..." : "Launch Campaign."}
              </span>
              <FiArrowRight
                className="text-primary group-hover:translate-x-6 transition-transform"
                size={60}
              />
            </button>
          </div>
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

// Reusable Boutique Field
const BoutiqueField = ({ label, name, error, fullWidth = false, ...props }) => (
  <div className={`space-y-4 group ${fullWidth ? "md:col-span-2" : ""}`}>
    <p className="text-[12px] font-black uppercase tracking-widest text-foreground group-focus-within:text-primary transition-colors">
      {label}
    </p>
    <input
      {...props}
      name={name}
      className="w-full bg-transparent border-b-2 border-stone-800 py-4 text-2xl font-serif italic text-black outline-none focus:border-primary transition placeholder:text-stone-200"
    />
    {error && (
      <p className="text-primary text-[10px] font-bold uppercase mt-2">
        {error}
      </p>
    )}
  </div>
);

export default CreateDonationCampaign;
