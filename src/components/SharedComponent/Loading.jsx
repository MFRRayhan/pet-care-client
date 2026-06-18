import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 px-4">
      {/* Editorial Header Skeleton */}
      <div className="border-b border-border pb-8 space-y-4">
        <Skeleton width={120} height={10} />
        <Skeleton width={300} height={40} borderRadius={4} />
      </div>

      {/* Sanctuary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Visual Profile Skeleton */}
            <div className="w-full md:w-32 h-32 shrink-0">
              <Skeleton height="100%" borderRadius={24} />
              
            </div>

            {/* Content Section */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton height={24} width="40%" />
                  <Skeleton height={10} width="20%" />
                  
                </div>
                {/* Progress Metric Skeleton */}
                <div className="hidden md:block w-48 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton width={60} height={8} />
                    <Skeleton width={300} height={8} />
                  </div>
                  <Skeleton height={6} borderRadius={10} />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 pt-2">
                <Skeleton width={40} height={40} borderRadius={12} />
                <Skeleton width={40} height={40} borderRadius={12} />
                <Skeleton width={100} height={40} borderRadius={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
