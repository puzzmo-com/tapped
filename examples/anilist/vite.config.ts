import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import relay from "vite-plugin-relay"
import { cjsInterop } from "vite-plugin-cjs-interop"
import StylexRsPlugin from "@stylexswc/unplugin/vite"

export default defineConfig({
  plugins: [
    react(),
    relay,
    cjsInterop({
      dependencies: ["react-relay", "relay-runtime"],
    }),
    StylexRsPlugin({}),
  ],
  optimizeDeps: {
    include: ["relay-runtime", "relay-runtime/experimental", "react-relay"],
    exclude: ["@puzzmo/tapped/src/server"],
  },
  build: {
    rollupOptions: {
      external: [/packages\/tapped\/src\/server/],

      output: {
        manualChunks: undefined,
      },
    },
  },
})
