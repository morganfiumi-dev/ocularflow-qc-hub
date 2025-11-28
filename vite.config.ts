import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Force single React instance
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', '@tanstack/react-query', '@trpc/react-query'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@trpc/react-query', '@tanstack/react-query'],
    esbuildOptions: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    force: true, // Force re-optimization on every start to clear cache
  },
  define: {
    // Ensure React is treated as a singleton
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Force React into a single chunk
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
}));
