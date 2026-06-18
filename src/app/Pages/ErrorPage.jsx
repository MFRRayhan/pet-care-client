import React from "react";
import { motion } from "framer-motion";
import {
  FiRefreshCw,
  FiHome,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import { PawPrint } from "lucide-react";

const ErrorPage = ({
  errorCode = "500",
  title = "System Interruption",
  message = "We've encountered an unexpected break in the sanctuary protocol. Our team of guardians is looking into it.",
  showRetry = true,
  showHome = true,
  showBack = false,
  onRetry = () => window.location.reload(),
  onHome = () => (window.location.href = "/"),
  onBack = () => window.history.back(),
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <PawPrint className="absolute top-20 left-10 w-64 h-64 -rotate-12 text-foreground" />
        <PawPrint className="absolute bottom-10 right-10 w-40 h-40 rotate-12 text-foreground" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Error Code Branding */}
        <div className="mb-6 flex justify-center items-center gap-4">
          <div className="w-12 h-[1px] bg-primary/30" />
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.6em]">
            Protocol Error
          </span>
          <div className="w-12 h-[1px] bg-primary/30" />
        </div>

        {/* Large Visual Error Code */}
        <h1 className="text-[12rem] md:text-[16rem] font-serif italic text-surface-alt leading-none tracking-tighter select-none">
          {errorCode}
        </h1>

        <div className="relative -mt-20 md:-mt-28">
          {/* Error Title */}
          <h2 className="text-4xl md:text-6xl font-serif italic text-foreground tracking-tighter mb-6">
            {title}.
          </h2>

          {/* Error Message */}
          <p className="text-muted-foreground text-lg font-light leading-relaxed mb-12 max-w-md mx-auto italic">
            "{message}"
          </p>

          {/* Boutique Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {showRetry && (
              <button
                onClick={onRetry}
                className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <FiRefreshCw
                  className="group-hover:rotate-180 transition-transform duration-700"
                  size={14}
                />
                Try Again
              </button>
            )}

            {showHome && (
              <button
                onClick={onHome}
                className="w-full sm:w-auto px-10 py-5 bg-surface-alt text-foreground rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 border border-border cursor-pointer"
              >
                <FiHome size={14} />
                Return to Sanctuary
              </button>
            )}

            {showBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-3 cursor-pointer"
              >
                <FiArrowLeft size={14} />
                Go Back
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* --- Specialized Error Variants --- */

export const Error404 = () => (
  <ErrorPage
    errorCode="404"
    title="Lost in the Woods"
    message="The path you're looking for doesn't exist in our sanctuary. Perhaps it was moved to a new home."
    showRetry={false}
    showBack={true}
  />
);

export const Error403 = () => (
  <ErrorPage
    errorCode="403"
    title="Area Restricted"
    message="This portion of the sanctuary is reserved for specific guardians. Please check your credentials."
    showRetry={false}
    showBack={true}
  />
);

export const Error500 = () => (
  <ErrorPage
    errorCode="500"
    title="Protocol Break"
    message="Our internal systems are taking a short nap. We are working to restore order as quickly as possible."
  />
);

export const NetworkError = () => (
  <ErrorPage
    errorCode="!!"
    title="Connection Faded"
    message="We've lost the digital scent. Please check your connection and try to rejoin us."
    showBack={true}
  />
);

export default ErrorPage;
