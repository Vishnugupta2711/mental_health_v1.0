/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%": {
            top: "60px",
            height: "5px",
            "border-radius": "50px 50px 25px 25px",
            transform: "scaleX(1.7)",
          },
          "40%": {
            height: "20px",
            "border-radius": "50%",
            transform: "scaleX(1)",
          },
          "100%": {
            top: "0%",
          },
        },
        shadow: {
          "0%": {
            transform: "scaleX(1.5)",
          },
          "40%": {
            transform: "scaleX(1)",
            opacity: ".7",
          },
          "100%": {
            transform: "scaleX(.2)",
            opacity: ".4",
          },
        },
      },
      animation: {
        bounce: "bounce 0.5s ease infinite alternate",
        shadow: "shadow 0.5s ease infinite alternate",
      },
    },
  },
  plugins: [],
};

