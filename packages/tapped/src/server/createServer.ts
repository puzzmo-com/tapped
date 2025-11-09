import Fastify, { FastifyInstance } from "fastify"
import fs from "node:fs/promises"
import path from "node:path"
import { Transform } from "node:stream"

import { debugLog } from "../index.js"
import { ServerConfig } from "./types.js"

type ViteDevServer = any

export interface SetupServerOptions {
  config: ServerConfig
  __dirname: string
  serverModulePath?: string
}

/**
 * Sets up a Fastify server with Vite integration for SSR support
 */
export const setupServer = async (options: SetupServerOptions) => {
  const { config, __dirname, serverModulePath = "/src/tappedServerModule.tsx" } = options
  const { isProduction, base } = config

  const templateHtml = isProduction
    ? await fs.readFile(path.resolve(__dirname, "./dist/client/index.html"), "utf-8")
    : ""

  let manifest: Record<string, any> = {}
  if (isProduction) {
    try {
      const manifestPath = path.resolve(__dirname, "./dist/client/.vite/manifest.json")
      manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"))
    } catch (e) {
      console.warn("Could not load Vite manifest for production CSS injection")
    }
  }

  const fastify = Fastify({})
  let vite: ViteDevServer | null = null

  if (!isProduction) {
    const { createServer } = await import("vite")
    vite = await createServer({ server: { middlewareMode: true }, appType: "custom", base })
    await fastify.register(import("@fastify/middie"))

    fastify.use((req, res, next) => {
      if (!req.url) return next()

      if (req.url.startsWith("/@") || req.url.startsWith("/__inspect") || req.url.includes(".")) {
        vite!.middlewares(req, res, next)
        return
      }
      next()
    })
  } else {
    await fastify.register(import("@fastify/compress"))
    await fastify.register(import("@fastify/static"), {
      root: path.resolve(__dirname, "./dist/client"),
      prefix: base,
      wildcard: false,
      index: false,
    })
  }

  return { fastify, vite, templateHtml, serverModulePath, manifest }
}

export interface RegisterSSRHandlerOptions {
  fastify: FastifyInstance
  vite: ViteDevServer | null
  templateHtml: string
  serverModulePath: string
  config: ServerConfig
  productionServerModulePath: string
  manifest?: Record<string, any>
}

/**
 * Registers the SSR route handler for server-side rendering of React components
 */
export const registerSSRHandler = (options: RegisterSSRHandlerOptions) => {
  const { fastify, vite, templateHtml, serverModulePath, config, productionServerModulePath, manifest = {} } = options
  const { isProduction, base, graphQLURL, abortDelay = 10000, isDev, globalCSS } = config

  fastify.get("*", async (request, reply) => {
    debugLog("Route handler called for:", request.url)
    const url = request.url.replace(base, "")

    let template: string
    let serverModule: any

    try {
      if (!isProduction && vite) {
        template = await fs.readFile("./index.html", "utf-8")
        template = await vite.transformIndexHtml(url, template)
        serverModule = await vite.ssrLoadModule(serverModulePath)
      } else {
        template = templateHtml
        serverModule = await import(/* @vite-ignore */ productionServerModulePath)
      }

      const { createTappedContext, renderWouterApp } = serverModule
      if (!createTappedContext || !renderWouterApp) {
        throw new Error("Bridging server module does not export renderWouter or createWouterContext")
      }

      const [htmlStart, restHtml] = template.split(`<!--app-head-->`)
      const [bodyStart, htmlEnd] = restHtml.split(`<!--app-html-->`)

      const context = await createTappedContext(graphQLURL, request, reply)
      debugLog("Context created, rendering app for URL:", url)

      let didError = false

      const { pipe, abort } = renderWouterApp(context, {
        onShellError(error: any) {
          debugLog("onShellError called")
          if (!reply.sent) {
            reply.code(500)
            reply.header("Content-Type", "text/html")
            reply.send("<h1>Something went wrong: " + error.message + "</h1>")
          }
        },
        onAllReady() {
          debugLog("onAllReady called - starting to stream")
          reply.hijack()
          const response = reply.raw

          response.statusCode = didError ? 500 : 200
          response.setHeader("Content-Type", "text/html")

          response.write(htmlStart)

          const { helmet } = context.helmetContext
          if (helmet) {
            response.write(helmet.title.toString())
            response.write(helmet.priority.toString())
            response.write(helmet.meta.toString())
            response.write(helmet.link.toString())
            response.write(helmet.script.toString())
          }

          // Inject global CSS if configured
          if (globalCSS) {
            if (isDev) {
              // In dev mode, link directly to the source CSS file (Vite will handle it)
              response.write(`<link rel="stylesheet" href="${globalCSS}">`)
            } else {
              // In production, look up the hashed CSS filename from the manifest
              const globalCssKey = globalCSS.startsWith("/") ? globalCSS.slice(1) : globalCSS
              const manifestEntry = manifest[globalCssKey]
              if (manifestEntry?.css) {
                for (const cssFile of manifestEntry.css) {
                  response.write(`<link rel="stylesheet" href="${base}${cssFile}">`)
                }
              }
            }
          }

          const { styleXSheet } = context
          const css = styleXSheet.getCSS()
          if (css && isDev) {
            response.write(`<style data-stylex="true">${css}</style>`)
          } else {
            response.write(`<!-- No StyleX CSS to inject in non-dev env -->`)
          }

          response.write(bodyStart)

          debugLog("About to serialize record source and loader data...")
          const { environment, loaderData } = context

          const recordSource = environment.getStore().getSource()
          const recordData = recordSource.toJSON()
          debugLog("Record source keys:", Object.keys(recordData).slice(0, 20) + "...")
          debugLog("Record source sample:", JSON.stringify(recordData).substring(0, 200) + "...")
          debugLog("Loader data:", JSON.stringify(loaderData).substring(0, 200) + "...")

          const transformStream = new Transform({
            transform(chunk, encoding, callback) {
              response.write(chunk, encoding)
              callback()
            },
            final(callback) {
              response.write(`<script>window.__RECORD_SOURCE = ${JSON.stringify(recordData)}</script>`)

              const serializableLoaderData = loaderData
                ? {
                    graphql: loaderData.graphql,
                    variables: loaderData.variables,
                  }
                : null

              response.write(`<script>window.__LOADER_DATA = ${JSON.stringify(serializableLoaderData)}</script>`)
              response.end(htmlEnd)
              callback()
            },
          })

          pipe(transformStream)
        },
        onError(error: any) {
          didError = true
          console.error("Render error:", error)
        },
      })

      setTimeout(() => {
        abort()
      }, abortDelay)
    } catch (e: any) {
      console.error("Route handler error:", e)
      vite?.ssrFixStacktrace(e)
      console.error(e.stack)
      if (!reply.sent) {
        reply.code(500).send(e.stack)
      }
    }
  })
}

/**
 * Starts the Fastify server and listens on the specified port
 */
export const startServer = (fastify: FastifyInstance, port: number) => {
  fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err
    console.log(`🚀 Server started at ${address}`)
  })
}
