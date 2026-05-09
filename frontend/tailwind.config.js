/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        serif:   ["Lora", "Georgia", "ui-serif", "serif"],
        mono:    ["JetBrains Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
