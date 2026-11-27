import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import relay from "vite-plugin-relay"
import { cjsInterop } from "vite-plugin-cjs-interop"
import StylexRsPlugin from "@stylexswc/unplugin/vite"

import { tapped } from "@puzzmo/tapped/vite"

export default defineConfig({
  plugins: [
    // Keeps the SSR-only server module out of the client bundle, and splits pages/queries into their own chunks
    tapped(),
    react(),
    relay,
    cjsInterop({
      dependencies: ["react-relay", "relay-runtime"],
    }),
    StylexRsPlugin({}),
  ],
  optimizeDeps: {
    include: ["relay-runtime", "relay-runtime/experimental", "react-relay"],
  },
})
