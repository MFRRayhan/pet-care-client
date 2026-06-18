import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast, { Toaster } from "react-hot-toast";
import { FiArrowLeft, FiImage, FiArrowRight } from "react-icons/fi";

import { AuthContext } from "@/context/AuthContext";
import Loading from "../SharedComponent/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const imgbbAPI = import.meta.env.VITE_imgbb_api_key;

const categoryOptions = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Bird", label: "Bird" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Other", label: "Other" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Pet name is required"),
  age: Yup.string().required("Pet age is required"),
  category: Yup.object().required("Pet category is required"),
  location: Yup.string().required("Location is required"),
  shortDescription: Yup.string().required("Short description is required"),
});

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);

  const [initialValues, setInitialValues] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[300px] font-serif italic text-foreground leading-relaxed",
      },
    },
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axiosSecure.get(`/pet/${id}`);
        const pet = res.data;
        setCurrentImage(pet.image);
        setInitialValues({
          name: pet.name,
          age: pet.age,
          category: categoryOptions.find((opt) => opt.value === pet.category),
          location: pet.location,
          shortDescription: pet.shortDescription,
          image: null,
        });
        if (editor) editor.commands.setContent(pet.longDescription || "");
      } catch (error) {
        toast.error("Records inaccessible.");
        navigate(-1);
      }
    };
    if (id) fetchPet();
  }, [id, axiosSecure, editor, navigate]);

  const handleUpdatePet = async (values, helpers) => {
    try {
      setUploading(true);
      let imageUrl = currentImage;

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
          formData,
        );
        imageUrl = response.data.data.url;
      }

      const updatedPet = {
        name: values.name,
        age: values.age,
        category: values.category.value,
        location: values.location,
        shortDescription: values.shortDescription,
        longDescription: editor?.getHTML(),
        image: imageUrl,
      };

      await axiosSecure.put(`/pets/${id}`, updatedPet);
      toast.success("Registry Refined.");
      navigate(-1);
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUploading(false);
      helpers.setSubmitting(false);
    }
  };

  if (!initialValues) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* 1. EDITORIAL HEADER */}
      <header className="border-b-2 border-foreground pb-16 mb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:-translate-x-2 transition-transform cursor-pointer"
        >
          <FiArrowLeft /> Back to Registry
        </button>
        <div className="space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-400">
            Registry Modification
          </span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
            Update <br /> <span className="text-primary italic">Profile.</span>
          </h1>
        </div>
      </header>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdatePet}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting, values, errors, touched }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* LEFT: VISUAL PROFILE */}
            <div className="lg:col-span-4 space-y-8">
              <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                Current Portrait
              </p>
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-stone-100 border-2 border-stone-800 group transition-all cursor-pointer"
              >
                <img
                  src={
                    values.image
                      ? URL.createObjectURL(values.image)
                      : currentImage
                  }
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  alt="Companion"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <FiImage size={40} className="mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Replace Image
                  </span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) =>
                  setFieldValue("image", e.currentTarget.files[0])
                }
              />
            </div>

            {/* RIGHT: REGISTRY FIELDS */}
            <div className="lg:col-span-8 space-y-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                <BoutiqueInput
                  label="Companion Name"
                  name="name"
                  error={errors.name}
                  touched={touched.name}
                />
                <BoutiqueInput
                  label="Estimated Age"
                  name="age"
                  error={errors.age}
                  touched={touched.age}
                />

                <div className="space-y-4">
                  <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                    Species Category
                  </p>
                  <Select
                    options={categoryOptions}
                    value={values.category}
                    onChange={(option) => setFieldValue("category", option)}
                    styles={customSelectStyles}
                  />
                </div>

                <BoutiqueInput
                  label="Current Location"
                  name="location"
                  error={errors.location}
                  touched={touched.location}
                />
              </div>

              <BoutiqueInput
                label="The Hook (Short Description)"
                name="shortDescription"
                placeholder="A brief sentence about their personality..."
                error={errors.shortDescription}
                touched={touched.shortDescription}
                fullWidth
              />

              {/* TIPTAP SECTION */}
              <div className="space-y-8">
                <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                  Detailed Biography
                </p>
                <div className="border-b-2 border-stone-800 pb-10">
                  <EditorContent editor={editor} />
                </div>
              </div>

              {/* ACTION */}
              <div className="pt-12">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="group flex items-center justify-between w-full border-b-4 border-foreground pb-6 hover:border-primary transition-all disabled:opacity-20 cursor-pointer"
                >
                  <span className="text-5xl md:text-7xl font-serif italic tracking-tighter text-foreground">
                    {uploading ? "Updating..." : "Refine Entry."}
                  </span>
                  <FiArrowRight
                    className="text-primary group-hover:translate-x-6 transition-transform"
                    size={60}
                  />
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Toaster position="bottom-center" />
    </div>
  );
};

const BoutiqueInput = ({
  label,
  name,
  error,
  touched,
  fullWidth = false,
  ...props
}) => (
  <div className={`space-y-4 group ${fullWidth ? "md:col-span-2" : ""}`}>
    <p className="text-[12px] font-black uppercase tracking-widest text-foreground group-focus-within:text-primary transition-colors">
      {label}
    </p>
    <Field
      {...props}
      name={name}
      className={`w-full bg-transparent border-b-2 py-4 text-2xl font-serif italic text-black outline-none transition placeholder:text-stone-200 ${error && touched ? "border-red-500" : "border-stone-800 focus:border-primary"}`}
    />
  </div>
);

const customSelectStyles = {
  control: (base) => ({
    ...base,
    border: "none",
    borderBottom: "2px solid #1c1917",
    borderRadius: "0",
    backgroundColor: "transparent",
    padding: "0.5rem 0",
    fontSize: "1.5rem",
    fontFamily: "serif",
    fontStyle: "italic",
    boxShadow: "none",
    "&:hover": { borderBottomColor: "var(--primary)" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0" }),
  indicatorSeparator: () => ({ display: "none" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#1c1917" : "white",
    color: state.isFocused ? "white" : "#1c1917",
    fontFamily: "serif",
    fontStyle: "italic",
  }),
};

export default UpdatePet;
