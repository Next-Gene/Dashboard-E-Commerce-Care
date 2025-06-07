/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
        quaternary: "var(--quaternary-color)",
        price: "var(--price-color)",
        'out-of-stock': "var(--out-of-stock-color)",
        'hot-product': "var(--hot-product-color)",
        'light-text': "var(--light-text-color)",
        'rating-star': "var(--rating-star-color)",
        'light-background': "var(--light-background)",
        'button-bg': "var(--button-bg-color)",
        'footer-bg': "var(--footer-bg-color)",
        black: "var(--black-color)"
      },
      fontSize: {
        '80': "var(--text-80)",
        '64': "var(--text-64)",
        '51': "var(--text-51)",
        '41': "var(--text-41)",
        '33': "var(--text-33)",
        '26': "var(--text-26)",
        '21': "var(--text-21)",
        '17': "var(--text-17)",
        '13': "var(--text-13)"
      },
      borderRadius: {
        '20': "20px",
        '40': "40px"
      },
      padding: {
        '80': "80px"
      },
      opacity: {
        'card-hover': "var(--card-hover-opacity)"
      },
      aspectRatio: {
        '4-5': "4/5"
      },
      backgroundImage: {
        'section-highlight': "var(--light-background)"
      }
    }
  },
  plugins: [
    require("flowbite/plugin")
  ]
};