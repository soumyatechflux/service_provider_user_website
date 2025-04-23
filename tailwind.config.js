var require = createRequire(import.meta.url);
var module = { exports: {} };

/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
