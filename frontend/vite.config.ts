import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Use relative paths for assets
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Extension scripts only
        background: path.resolve(__dirname, "src/extension/background/background.ts"),
        content: path.resolve(__dirname, "src/extension/content/content.tsx"),
        popup: path.resolve(__dirname, "public/popup.html"),
        dashboard: path.resolve(__dirname, "public/dashboard.html"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep extension files with specific names
          if (['background', 'content'].includes(chunkInfo.name || '')) {
            return `${chunkInfo.name}.js`;
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
