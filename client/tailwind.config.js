/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "header-logo": "url('/src/images/MorrisFed-logo-official.png')",
        "spinner-logo": "url('/src/images/MorrisFed-logo-square.png')",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
