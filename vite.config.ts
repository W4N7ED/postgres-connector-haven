
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Conditionally import the tagger to avoid installation issues
let componentTagger;
try {
  const lovableTagger = require("lovable-tagger");
  componentTagger = lovableTagger.componentTagger;
} catch (error) {
  // If the tagger can't be loaded, use a dummy function
  componentTagger = () => null;
  console.warn("lovable-tagger not available, skipping component tagging");
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
