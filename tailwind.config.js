/** @type {import('tailwindcss').Config} */

function range(start, end, increment = 1) {
  const count = Math.floor((end - start + increment) / increment);
  return Array(count).fill(0).map((_, idx) => start + idx * increment);
}

function range1(start, end, increment = 10) {
  const count = Math.floor((end - start + 1 / increment) * increment);
  return Array(count).fill(0).map((_, idx) => start + idx / increment);
}

const minFont = 5;
const maxFont = 80;

const minPixel = 0;
const maxPixel = 1500;

const vhs = [
  '10vh',
  '20vh',
  '30vh',
  '40vh',
  '50vh',
  '60vh',
  '70vh',
  '80vh',
  '90vh',
  '100vh',
]

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    screens: {
      sx: '350px',
      sm: '640px',
      md: '768px',
      mm: '992px',
      lg: '1024px',
      xl: '1280px',
      xl2: '1536px',

      mobile: '992px',
      laptop: '1024px',
      desktop: '1280px',
    },

    extend: {
      colors: {
        unset: '#00000000',

        black: '#000000',
        white: '#ffffff',

        bgBase: '#252028',
        bgLight: '#353038',
        bgBright: '#49444c',

        bgActive: '#1d4ed833',
        borderActive: '#93c5fd',

        colorUnActive: '#cccad3bf',
      },
    },

    fontSize: {
      ...range(minFont, maxFont).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {}),

      ...range1(0.5, 5, 10).reduce((merged, f) => (
        { ...merged, [f + 'r']: `${f}rem !important` }
      ), {})
    },

    spacing: {
      ...range(minPixel, maxPixel).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {})
    },

    maxWidth: {
      ...range(minPixel, maxPixel).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {})
    },

    minWidth: {
      ...range(minPixel, maxPixel).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {}),
    },

    maxHeight: {
      ...range(minPixel, maxPixel).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {}),

      ...vhs.reduce((merged, vh) => (
        { ...merged, [vh]: vh }
      ), {}),
    },

    minHeight: {
      ...range(minPixel, maxPixel).reduce((merged, f) => (
        { ...merged, [f]: `${f}px !important` }
      ), {}),

      ...vhs.reduce((merged, vh) => (
        { ...merged, [vh]: vh }
      ), {}),
    },
  },

  plugins: [],
};
