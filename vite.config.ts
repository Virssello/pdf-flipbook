import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), viteSingleFile()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: './dev.html',
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
