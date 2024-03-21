/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "result-container": "calc(100/16*1rem)",
      },
      boxShadow: {
        "container-shadow": "0px 0px 1px 0px rgba(0, 0, 0, 0.1)",
      },

      backgroundImage: {
        "root-sfeer-afbeelding": "url(/assets/sfeer-afbeelding.jpg)",
        // 'bg-logo': 'linear-gradient(to right,var(--tw-gradient-stops)) '
      },
      gridTemplateColumns: {
        24: "repeat(24, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridTemplateRows: {
        layout: "max-content 1fr",
        index: "minmax(0, 1fr)",
      },
    },
  },
  plugins: [],
};
