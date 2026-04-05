/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E352B",
          soft: "#2D4239",
          ink: "#1A1A1A",
          paper: "#FAF9F6",
          line: "#E5E3DF"
        }
      },
      fontFamily: {
        sans: ["PingFang SC", "Microsoft YaHei", "Segoe UI", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
        luxurySans: ["Helvetica Neue", "Arial Nova", "PingFang TC", "Microsoft JhengHei", "sans-serif"],
        luxurySerif: ["Iowan Old Style", "Baskerville", "Palatino Linotype", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.06)"
      }
    }
  },
  plugins: []
};
