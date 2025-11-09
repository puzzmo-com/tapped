import { FastifyReply, FastifyRequest } from "fastify"
import React, { Suspense } from "react"
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server"
import { RecordSource } from "relay-runtime"

import { styleSheet } from "@stylexjs/stylex/lib/StyleXSheet"

import { debugLog } from "../index.js"
import { createEnvironment } from "../relay/environment.js"
import { loadRouteData, matchRoute } from "../routing/routes.js"
import { CreateContextOptions, WouterContext } from "./types.js"

const createFetchRequest = (req: FastifyRequest, res: FastifyReply) => {
  const origin = `${req.protocol}://${req.headers.host}`
  const url = new URL(req.url, origin)
  debugLog("SSR: Fetching URL", url.href)

  const controller = new AbortController()
  res.raw.on("close", () => controller.abort())

  const headers = new Headers()
  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else if (typeof values === "string") {
        headers.set(key, values)
      }
    }
  }

  const init = {
    method: req.method,
    headers,
    signal: controller.signal,
    body: req.method !== "GET" && req.method !== "HEAD" ? (req.body as BodyInit) : undefined,
  }

  debugLog("SSR: Fetch request", req.method, url.href)
  return new Request(url.href, init)
}

/**
 * Creates a Wouter routing context for server-side rendering with Relay environment and route matching.
 * In this case a loader represents the data for the route, and a potential root route
 */
export const createWouterSSRContext = async (options: CreateContextOptions): Promise<WouterContext> => {
  const { graphqlURL: graphqlUrl, request: req, reply: res, routes, rootBootstrappingLoader } = options

  let recordSource = options.recordSource
  let environment = options.environment

  if (!environment || !recordSource) {
    recordSource = new RecordSource()
    const cookieHeader = req.headers.cookie
    debugLog("SSR: Forwarding cookie header:", cookieHeader)
    environment = createEnvironment(graphqlUrl, recordSource, cookieHeader)
  }

  const url = new URL(req.url, `${req.protocol}://${req.headers.host}`)
  const pathname = url.pathname

  const routeMatch = matchRoute(pathname, routes)

  const fetchRequest = createFetchRequest(req, res)

  const loadPromises: Promise<any>[] = []

  if (rootBootstrappingLoader) {
    loadPromises.push(rootBootstrappingLoader({ params: {}, request: fetchRequest }))
  }

  let loaderData = null
  if (routeMatch && routeMatch.route.loader) {
    loadPromises.push(loadRouteData(routeMatch, fetchRequest))
  }

  try {
    const results = await Promise.all(loadPromises)
    if (routeMatch && routeMatch.route.loader) {
      loaderData = results[rootBootstrappingLoader ? 1 : 0]
    }
    debugLog("SSR: Loaded layout and route data for", pathname)
    debugLog("SSR: Route:", routeMatch?.route?.path)
    debugLog("SSR: Loader data:", loaderData)
  } catch (error) {
    console.error("SSR: Failed to load data", error)
    throw error
  }

  return {
    environment,
    helmetContext: {},
    recordSource,
    routeMatch,
    loaderData,
    pathname,
    styleXSheet: styleSheet,
  }
}

type RenderWouterOptions = {
  context: WouterContext
  App: React.ComponentType<any>
  appProps?: Record<string, any>
  fallback?: React.ReactNode
  options: RenderToPipeableStreamOptions
}

/**
 * Renders a Wouter application to a pipeable stream for server-side rendering
 */
export const renderWouterReactApp = (renderOptions: RenderWouterOptions) => {
  const { context, App, appProps = {}, fallback = <div>Loading...</div>, options } = renderOptions
  const { environment, helmetContext, pathname, loaderData, styleXSheet } = context

  styleXSheet.inject()

  return renderToPipeableStream(
    <React.StrictMode>
      <Suspense fallback={fallback}>
        <App
          environment={environment}
          helmetContext={helmetContext}
          ssrPath={pathname}
          loaderData={loaderData}
          {...appProps}
        />
      </Suspense>
    </React.StrictMode>,
    options,
  )
}
