// tailwind.config.mjs
import scrollbarHide from "tailwind-scrollbar-hide";
// or if you want styled scrollbar:
// import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [scrollbarHide],
};
