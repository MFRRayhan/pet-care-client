import React, { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import {
  MoveUpRight,
  Heart,
  Calendar,
  Target,
  Plus,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router";

import { motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/components/SharedComponent/Loading";

const DonationCampaigns = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  const axiosSecure = useAxiosSecure();

  const fetchCampaigns = async ({ pageParam = 1 }) => {
    const res = await axiosSecure.get(
      `/donation-campaigns?page=${pageParam}&limit=9&sort=createdAt&order=desc`,
    );
    return res.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["donation-campaigns"],
    queryFn: fetchCampaigns,
    getNextPageParam: (lastPage, pages) => {
      const hasMore = lastPage.hasMore || lastPage.pagination?.hasMore;
      return hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const campaigns = data?.pages.flatMap((page) => page.campaigns) || [];

  const calculateProgress = (donated, max) =>
    Math.min((donated / max) * 100, 100);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- PAGE HEADER --- */}
      <header className="bg-surface-alt pt-32 pb-20 border-b border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-12"
          >
            {/* LEFT SIDE: Heading Section */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[1px] bg-primary" />
                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.5em]">
                  Helping Besties
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-serif text-foreground leading-[0.8] tracking-tighter">
                Giving <br />
                <span className="text-primary italic font-normal">Love.</span>
              </h1>
            </div>

            {/* RIGHT SIDE: Paragraph - Hidden on mobile, styled with border-right on desktop */}
            <p className="text-muted-foreground text-xl font-light italic max-w-[320px] border-r-2 border-primary/20 pr-8 text-right hidden lg:block">
              Every contribution creates a sanctuary for those who cannot speak
              for themselves. Find the perfect soul to share your magic.
            </p>
          </motion.div>
        </div>

        {/* Optional: Background Ambient Glow for consistency */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_var(--tw-primary)/5,_transparent_70%)] -z-0" />
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10">
        {/* --- CAMPAIGN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence>
            {campaigns.map((campaign, index) => {
              const {
                _id,
                petName,
                image,
                donatedAmount,
                maxDonation,
                shortDescription,
              } = campaign;
              const progress = calculateProgress(donatedAmount, maxDonation);

              return (
                <motion.div
                  key={_id || index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: (index % 3) * 0.1,
                  }}
                  className="group relative w-full mb-12"
                >
                  <Link to={`/donations-details/${_id}`} className="block">
                    {/* THE MAIN IMAGE */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4rem] transition-all duration-1000 group-hover:rounded-[2rem]">
                      <img
                        src={image}
                        alt={petName}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-[1.5s]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {/* FLOATING DATA */}
                      <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">
                            Sweet Friend No. {index + 1}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                          <Sparkles
                            size={16}
                            className="text-white fill-current"
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-10 left-10 right-10">
                        <h3 className="text-5xl font-serif text-white tracking-tighter leading-none mb-4 italic">
                          {petName}
                          <span className="text-primary not-italic">.</span>
                        </h3>
                        <p className="text-white/60 text-sm font-light line-clamp-2 max-w-[80%] mb-8">
                          {shortDescription}
                        </p>

                        {/* THE PROGRESS INDICATOR */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-end text-white">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 text-primary">
                              Loved by
                            </span>
                            <span className="text-2xl font-serif">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-[2px] w-full bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progress}%` }}
                              transition={{ duration: 2, ease: "circOut" }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EXTERNAL FOOTER */}
                    <div className="mt-8 flex justify-between items-center px-4">
                      <div className="flex gap-12">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Current Love
                          </span>
                          <span className="text-xl font-serif text-foreground">
                            ${donatedAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                            Goal
                          </span>
                          <span className="text-xl font-serif text-muted-foreground opacity-50">
                            ${maxDonation.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group/link">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          Support Now
                        </span>
                        <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                          <MoveUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* --- INFINITE LOADING STATE --- */}
        <div
          ref={ref}
          className="py-20 flex flex-col items-center justify-center gap-4"
        >
          {hasNextPage ? (
            <>
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                More friends to meet
              </span>
            </>
          ) : (
            campaigns.length > 0 && (
              <div className="flex flex-col items-center text-center opacity-40">
                <Heart size={24} className="mb-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                  You've met all our friends!
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCampaigns;
