import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import relay from "vite-plugin-relay"
import cjsInterop from "vite-plugin-cjs-interop"

export default defineConfig({
  plugins: [
    react(),
    relay,
    cjsInterop({
      dependencies: ["react-relay", "relay-runtime"],
    }),
  ],
  ssr: {
    noExternal: ["react-relay", "relay-runtime"],
  },
  optimizeDeps: {
    include: ["react-relay", "relay-runtime"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
