import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FiArrowLeft, FiImage, FiArrowRight } from "react-icons/fi";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "../SharedComponent/Loading";

const EditMyDonation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    petName: "",
    maxDonation: "",
    lastDate: "",
    shortDescription: "",
    longDescription: "",
    image: "",
  });

  const imgbbAPI = import.meta.env.VITE_imgbb_api_key;

  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosSecure.get(`/editdonation-campaign/${id}`);
        const campaign = res.data;
        setFormData({
          petName: campaign.petName || "",
          maxDonation: campaign.maxDonation || "",
          lastDate: campaign.lastDate ? campaign.lastDate.split("T")[0] : "",
          shortDescription: campaign.shortDescription || "",
          longDescription: campaign.longDescription || "",
          image: campaign.image || "",
        });
      } catch (error) {
        toast.error("Records inaccessible.");
        navigate("/dashboard/my-donation-campaigns");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadCampaignData();
  }, [id, axiosSecure, navigate]);

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
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.petName) newErrors.petName = "Name required";
    if (!formData.maxDonation) newErrors.maxDonation = "Goal required";
    if (!formData.lastDate) newErrors.lastDate = "Date required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const data = new FormData();
        data.append("image", imageFile);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
          data,
        );
        imageUrl = res.data.data.url;
      }

      const campaignData = {
        ...formData,
        image: imageUrl,
        maxDonation: parseFloat(formData.maxDonation),
        updatedAt: new Date().toISOString(),
      };

      await axiosSecure.put(`/donation-campaigns/${id}`, campaignData);
      toast.success("Campaign Refined.");
      navigate("/dashboard/my-donation-campaigns");
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* 1. EDITORIAL HEADER */}
      <header className="border-b-2 border-foreground pb-16 mb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:-translate-x-2 transition-transform cursor-pointer"
        >
          <FiArrowLeft /> Return to Portfolio
        </button>
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400">
            Funding Modification
          </span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Refine <br /> <span className="text-primary italic">Campaign.</span>
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-24"
      >
        {/* LEFT: VISUAL IDENTITY */}
        <div className="lg:col-span-4 space-y-8">
          <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
            Visual Identity
          </p>
          <div
            onClick={() => fileInputRef.current.click()}
            className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-stone-100 border-2 border-stone-800 group transition-all cursor-pointer"
          >
            <img
              src={imagePreview || formData.image}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Pet"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <FiImage size={40} className="mb-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Update Portrait
              </span>
            </div>
            {imagePreview && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full whitespace-nowrap shadow-xl">
                New Selection Staged
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* RIGHT: DATA FIELDS */}
        <div className="lg:col-span-8 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            <BoutiqueField
              label="Pet Name"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              error={errors.petName}
            />
            <BoutiqueField
              label="Target Goal (BDT)"
              name="maxDonation"
              type="number"
              value={formData.maxDonation}
              onChange={handleChange}
              error={errors.maxDonation}
            />
            <BoutiqueField
              label="Campaign Deadline"
              name="lastDate"
              type="date"
              value={formData.lastDate}
              onChange={handleChange}
              error={errors.lastDate}
            />
          </div>

          <BoutiqueField
            label="Short Narrative"
            name="shortDescription"
            placeholder="A compelling headline for the cause..."
            value={formData.shortDescription}
            onChange={handleChange}
            fullWidth
          />

          <div className="space-y-6">
            <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
              Detailed Case Story
            </p>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              rows={8}
              className="w-full bg-transparent border-b-2 border-stone-800 py-4 text-2xl font-serif italic text-black outline-none focus:border-primary transition placeholder:text-stone-200 resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-12 flex flex-col gap-12 pb-20">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center justify-between w-full border-b-4 border-foreground pb-6 hover:border-primary transition-all disabled:opacity-20 cursor-pointer"
            >
              <span className="text-5xl md:text-7xl font-serif italic tracking-tighter text-foreground">
                {isSubmitting ? "Syncing..." : "Save Modifications."}
              </span>
              <FiArrowRight
                className="text-primary group-hover:translate-x-6 transition-transform"
                size={60}
              />
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-300 hover:text-red-500 transition-colors cursor-pointer self-start"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

const BoutiqueField = ({ label, name, error, fullWidth = false, ...props }) => (
  <div className={`space-y-4 group ${fullWidth ? "md:col-span-2" : ""}`}>
    <p className="text-[12px] font-black uppercase tracking-widest text-foreground group-focus-within:text-primary transition-colors">
      {label}
    </p>
    <input
      {...props}
      name={name}
      className={`w-full bg-transparent border-b-2 py-4 text-2xl font-serif italic text-black outline-none transition placeholder:text-stone-200 ${error ? "border-red-500" : "border-stone-800 focus:border-primary"}`}
    />
  </div>
);

export default EditMyDonation;
