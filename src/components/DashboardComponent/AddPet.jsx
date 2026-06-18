import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { LuImagePlus, LuArrowRight } from "react-icons/lu";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { AuthContext } from "@/context/AuthContext";

const imgbbAPI = import.meta.env.VITE_IMGBB_API_KEY;

const categoryOptions = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Bird", label: "Bird" },
  { value: "Rabbit", label: "Rabbit" },
  { value: "Other", label: "Other Species" },
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  age: Yup.string().required("Age is required"),
  category: Yup.object().required("Please select a category"),
  location: Yup.string().required("Location is required"),
  shortDescription: Yup.string().required("A short intro is required"),
  image: Yup.mixed().required("A photo is required"),
});

const AddPet = () => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[180px] p-0 font-serif italic text-2xl text-foreground",
      },
    },
  });

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: state.isFocused
        ? "2px solid var(--primary)"
        : "2px solid #2d2d2d",
      borderRadius: "0",
      padding: "12px 0",
      boxShadow: "none",
      "&:hover": { borderBottom: "2px solid var(--primary)" },
    }),
    valueContainer: (provided) => ({ ...provided, padding: "0" }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000000",
      fontSize: "1.5rem",
      fontFamily: "serif",
      fontStyle: "italic",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000000",
      opacity: 0.2,
      fontSize: "1.5rem",
      fontFamily: "serif",
      fontStyle: "italic",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "1rem",
      zIndex: 50,
    }),
  };

  const handleAddPet = async (values, resetForm, setSubmitting) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", values.image);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPI}`,
        formData,
      );

      const newPet = {
        name: values.name,
        age: values.age,
        category: values.category.value,
        location: values.location,
        shortDescription: values.shortDescription,
        longDescription: editor?.getText() || "",
        image: response.data.data.url,
        adopted: false,
        owner: user?.email,
        ownerName: user?.displayName,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/pet", newPet);
      toast.success("Listing created successfully");
      resetForm();
      editor?.commands.setContent("");
    } catch (err) {
      toast.error("Error creating listing.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto py-12 px-4"
    >
      <header className="border-b-2 border-foreground pb-16 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
              New Listing
            </span>
            <h1 className="text-7xl md:text-8xl font-serif italic tracking-tighter text-foreground leading-[0.8]">
              Add a <span className="text-primary italic">Companion.</span>
            </h1>
          </div>
        </div>
      </header>

      <Formik
        initialValues={{
          name: "",
          age: "",
          category: null,
          location: "",
          shortDescription: "",
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setSubmitting }) =>
          handleAddPet(values, resetForm, setSubmitting)
        }
      >
        {({ setFieldValue, isSubmitting, values }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* PORTRAIT SECTION */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                  Upload Portrait
                </p>
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 group hover:border-primary transition-colors">
                  {values.image ? (
                    <img
                      src={URL.createObjectURL(values.image)}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center cursor-pointer">
                      <LuImagePlus className="text-stone-400 mb-4" size={48} />
                      <p className="text-lg font-serif italic text-stone-500">
                        Select a clear photo
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue("image", e.currentTarget.files[0])
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-primary text-[10px] font-bold uppercase"
                />
              </div>
            </div>

            {/* FORM FIELDS SECTION */}
            <div className="lg:col-span-8 space-y-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                <BoutiqueField
                  label="Pet's Name"
                  name="name"
                  placeholder="Enter name"
                />
                <BoutiqueField
                  label="Pet's Age"
                  name="age"
                  placeholder="e.g. 2 Years / 4 Months"
                />

                <div className="space-y-4">
                  <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                    Category
                  </p>
                  <Select
                    options={categoryOptions}
                    styles={selectStyles}
                    placeholder="Choose species"
                    onChange={(opt) => setFieldValue("category", opt)}
                  />
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-primary text-[10px] font-bold uppercase"
                  />
                </div>

                <BoutiqueField
                  label="Location"
                  name="location"
                  placeholder="City, State"
                />
              </div>

              <BoutiqueField
                label="One-Line Description"
                name="shortDescription"
                placeholder="A catchy intro for the listing..."
                fullWidth
              />

              <div className="space-y-8">
                <p className="text-[12px] font-black uppercase tracking-widest text-foreground">
                  Detailed Story & Personality
                </p>
                <div className="border-b-2 border-stone-800 ">
                  <EditorContent editor={editor} />
                </div>
              </div>

              {/* ACTION */}
              <div className="pt-12">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="group flex items-center justify-between w-full border-b-4 border-foreground pb-6 hover:border-primary transition-all disabled:opacity-20 hover:cursor-pointer"
                >
                  <span className="text-5xl md:text-6xl font-serif italic tracking-tighter text-foreground">
                    {uploading ? "Publishing..." : "Finalize Listing."}
                  </span>
                  <LuArrowRight
                    className="text-primary group-hover:translate-x-6 transition-transform"
                    size={50}
                  />
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Toaster position="bottom-center" />
    </motion.div>
  );
};

// --- Boutique Field Atom ---
const BoutiqueField = ({ label, name, placeholder, fullWidth = false }) => (
  <div className={`space-y-4 group ${fullWidth ? "md:col-span-2" : ""}`}>
    <p className="text-[12px] font-black uppercase tracking-widest text-foreground group-focus-within:text-primary transition-colors">
      {label}
    </p>
    <Field
      name={name}
      placeholder={placeholder}
      className="w-full bg-transparent border-b-2 border-stone-800 py-4 text-2xl font-serif italic text-black outline-none focus:border-primary transition placeholder:text-stone-300"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-primary text-[10px] font-bold uppercase mt-2"
    />
  </div>
);

export default AddPet;
