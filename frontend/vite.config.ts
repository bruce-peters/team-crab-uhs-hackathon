import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Main app (kept for compatibility)
        main: path.resolve(__dirname, "index.html"),
        // Extension scripts
        background: path.resolve(__dirname, "src/extension/background/background.ts"),
        content: path.resolve(__dirname, "src/extension/content/content.ts"),
        popup: path.resolve(__dirname, "src/extension/popup/popup.tsx"),
        dashboard: path.resolve(__dirname, "src/extension/dashboard/dashboard.tsx"),
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
        assetFileNames: (assetInfo) => {
          // Handle CSS files for content script
          if (assetInfo.name?.includes('content')) return 'content.css';
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
});
