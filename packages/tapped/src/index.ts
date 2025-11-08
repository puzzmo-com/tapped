const verboseSSRLogging = false

/**
 * Centralized debug logging function for tapped package
 */
export const debugLog = (...args: any[]) => {
  if (verboseSSRLogging) console.log("[tapped]", ...args)
}

export * from "./client/index.js"

export { matchRoute, loadRouteData, createRouteElements } from "./routing/index.js"
export type { WouterRoute, RouteMatch } from "./routing/index.js"

export { createEnvironment, preload, useGetMainPageQuery } from "./relay/index.js"
export type { PreloadedData, LoaderFn, LoaderArgs, Params } from "./relay/index.js"
