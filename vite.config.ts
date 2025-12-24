import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Path alias configuration: @/* maps to src/*
    // Usage: import { Component } from "@/components/Component"
    // This enables clean imports without relative path navigation
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})