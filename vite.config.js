import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: true,
    port: 5174,
  },
  build: {
    outDir: "docs",
  },
});
