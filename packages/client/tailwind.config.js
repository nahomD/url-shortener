const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    "../../node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
      extend: {
      }
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
  darkMode: "class"
}

