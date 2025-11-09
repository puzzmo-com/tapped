import { type FastifyReply, type FastifyRequest } from "fastify"
import { RecordSource } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

import { styleSheet } from "@stylexjs/stylex/lib/StyleXSheet"

import { RouteMatch, WouterRoute } from "../routing/types.js"

export interface WouterContext {
  environment: RelayModernEnvironment
  helmetContext: { helmet?: any }
  recordSource: RecordSource
  routeMatch: RouteMatch | null
  loaderData: any
  pathname: string
  styleXSheet: typeof styleSheet
}

export interface ServerConfig {
  port: number
  base: string
  isProduction: boolean
  isDev: boolean
  abortDelay?: number
  graphQLURL: string
  /** Optional path to a global CSS file to inject during SSR (e.g., "/src/app/global.css") */
  globalCSS?: string
}

export interface CreateContextOptions {
  /** Where should we be fetching data from? */
  graphqlURL: string
  /** The incoming request object */
  request: FastifyRequest
  /** The outgoing reply object for us to handle SSR on*/
  reply: FastifyReply
  /** So that the SSR renderer can find the correct route */
  routes: WouterRoute[]
  /** Adds support for a root request for app bootrstrapping */
  rootBootstrappingLoader?: (args: { params: {}; request: Request }) => Promise<any>
  /** You pass in a relay environment which is used for data fetching */
  environment: RelayModernEnvironment
  /** You pass in a record source which is used and filled up during SSR */
  recordSource?: RecordSource
}
