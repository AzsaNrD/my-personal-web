import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        'light-shape': '#E8E8E8',
        'light-text': '#4F4F4F',
        'light-heading': '#333333',
        'light-border': '#CCCCCC',
        'light-background': '#FAFAFA',

        // Dark Mode Colors
        'dark-shape': '#252525',
        'dark-text': '#BABABA',
        'dark-heading': '#DDDDDD',
        'dark-border': '#3C3C3C',
        'dark-background': '#08090A',
      },
    },
  },
  plugins: [],
};
export default config;
