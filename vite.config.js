import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // IMPORTANT: allows deep routes like /student/login to work
    historyApiFallback: true,
  },
});
