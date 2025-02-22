
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
    build: {
      // Production-specific build options
      ...(mode === 'production' && {
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1000,
      }),
      // Development-specific build options
      ...(mode === 'development' && {
        sourcemap: 'inline',
        minify: false,
      }),
    },
    // Define environment variables
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    }
  };
});

