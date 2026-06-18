import React, { useState, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, PawPrint, Sparkles } from "lucide-react";
import Loading from "@/components/SharedComponent/Loading";
import PetCard from "@/components/SharedComponent/PetCard";

const url = import.meta.env.VITE_API;

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["unadoptedPets"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(`${url}/available-pets`, {
        params: { page: pageParam, limit: 12 },
      });
      return data;
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allPets = useMemo(
    () => data?.pages.flatMap((page) => page.pets || page) || [],
    [data],
  );

  const categories = useMemo(() => {
    const unique = [...new Set(allPets.map((pet) => pet.category || pet.type))];
    return unique.filter(Boolean).sort();
  }, [allPets]);

  const filteredPets = useMemo(() => {
    let filtered = allPets;
    if (searchTerm.trim()) {
      filtered = filtered.filter((pet) =>
        pet.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (pet) => (pet.category || pet.type) === selectedCategory,
      );
    }
    return filtered;
  }, [allPets, searchTerm, selectedCategory]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-primary p-20 font-serif italic text-2xl">
        Oops! {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* --- PAGE HEADER --- */}
      <div className="bg-surface-alt pt-32 pb-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-12"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[1px] bg-primary" />
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                  Meet The Gang
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-serif text-foreground leading-[0.8] tracking-tighter">
                Our Best <br />
                <span className="text-primary italic font-normal">
                  Friends.
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground text-xl font-light italic max-w-[280px] border-r-2 border-primary/20 pr-8 text-right hidden lg:block">
              Looking for a partner in crime? Find the perfect soul to share
              your magic.
            </p>
          </motion.div>

          {/* --- SEARCH & FILTER BAR --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 flex flex-col md:flex-row items-center gap-4 bg-background p-3 rounded-[2.5rem] shadow-xl border border-border"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Find a bestie by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-transparent outline-none text-foreground font-medium placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="h-10 w-[1px] bg-border hidden md:block" />

            <div className="relative w-full md:w-auto">
              <SlidersHorizontal className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-4 h-4 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-64 pl-14 pr-10 py-4 bg-transparent outline-none appearance-none cursor-pointer text-foreground font-bold text-[11px] uppercase tracking-widest"
              >
                <option value="">All The Cuties</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}s
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="p-4 bg-primary text-white rounded-full hover:bg-foreground transition-colors group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-16">
            <AnimatePresence mode="popLayout">
              {filteredPets.map((pet, idx) => (
                <motion.div
                  layout
                  key={pet._id || idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (idx % 12) * 0.05 }}
                >
                  <PetCard pet={pet} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-8">
              <PawPrint className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-4xl font-serif text-foreground mb-4 italic">
              No buddies found
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Try a different search to find your perfect match!
            </p>
          </div>
        )}

        {/* INFINITE SCROLL SENTINEL */}
        {!searchTerm && !selectedCategory && (
          <div ref={ref} className="mt-32 flex flex-col items-center gap-6">
            {isFetchingNextPage ? (
              <Loading />
            ) : hasNextPage ? (
              <>
                <div className="w-px h-20 bg-gradient-to-b from-primary to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground">
                  Scroll for more cuteness
                </span>
              </>
            ) : (
              <div className="flex items-center gap-4 text-muted-foreground/40">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em]">
                  You've seen all our current besties
                </span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
