import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { registerSSRHandler, setupServer, startServer } from "tapped/src/server"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  port: 8082,
  base: "/",
  isProduction: process.env.NODE_ENV === "production",
  isDev: !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  abortDelay: 10000,
  graphQLURL: "https://graphql.anilist.co",
  debugLog: (...args: unknown[]) => console.log(...args),
  globalCSS: "/src/app/global.css",
}

const { fastify, vite, templateHtml, serverModulePath, manifest } = await setupServer({
  config,
  __dirname,
})

// Register GraphQL proxy
const httpProxy = await import("@fastify/http-proxy")
await fastify.register(httpProxy.default, {
  upstream: "https://graphql.anilist.co",
  prefix: "/graphql",
  rewritePrefix: "/",
})

registerSSRHandler({
  fastify,
  vite,
  templateHtml,
  serverModulePath,
  config,
  productionServerModulePath: pathToFileURL(
    path.resolve(__dirname, "./dist/server/tappedServerModule.mjs")
  ).href,
  manifest,
})

startServer(fastify, config.port)
