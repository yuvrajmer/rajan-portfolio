/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        surface2: token("surface2"),
        ink: token("ink"),
        muted: token("muted"),
        faint: token("faint"),
        lav: token("lav"),
        "lav-strong": token("lav-strong"),
        ember: token("ember"),
      },
      fontFamily: {
        display: ["NeueMachina", "Manrope", "system-ui", "sans-serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "18px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.16,1,.3,1)",
        back: "cubic-bezier(.34,1.56,.64,1)",
      },
      maxWidth: {
        page: "1280px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [
    // light:<utility> applies only in the light theme (dark is the default, tokens do the rest)
    ({ addVariant }) => addVariant("light", '[data-theme="light"] &'),
  ],
};