import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 🔥 Remove the css.preprocessorOptions section entirely
  optimizeDeps: {
    include: ['@excalidraw/excalidraw'],
  },
})
