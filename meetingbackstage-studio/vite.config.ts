import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative Pfade, damit der Build auch aus einem Unterordner oder lokal geöffnet werden kann.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  // Die lokal eingebundene Weltkarte macht das Bundle bewusst etwas größer.
  build: { chunkSizeWarningLimit: 900 },
});
