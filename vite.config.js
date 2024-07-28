// vite.config.js

import { defineConfig } from 'vite';

// Load environment variables from a .env file if necessary
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  plugins: [],
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
      VITE_ANOTHER_VAR: JSON.stringify(process.env.VITE_ANOTHER_VAR)
    }
  }
});
