import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      colors: {
        'zinc-75': 'rgba(247,247,247,1)',
      },
    },
    darkMode: "class",
  },
  plugins: [nextui()],
};

export default config;