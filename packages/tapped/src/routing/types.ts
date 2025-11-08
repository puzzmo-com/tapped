import React from "react"

import type { LoaderFn } from "../relay/types.js"

export type { Params, LoaderArgs, PreloadedData, LoaderFn } from "../relay/types.js"

export interface WouterRoute {
  path: string
  component: React.ComponentType<any>
  loader?: LoaderFn
  children?: WouterRoute[]
}

export interface RouteMatch {
  route: WouterRoute
  params: Record<string, string>
  pathname: string
}
