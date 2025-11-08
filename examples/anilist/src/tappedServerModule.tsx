import { FastifyReply, FastifyRequest } from "fastify"
import { type RenderToPipeableStreamOptions } from "react-dom/server"
import { RecordSource } from "relay-runtime"

import { createWouterSSRContext, renderWouterReactApp } from "tapped/src/server"

import { App } from "./app/App"
import { createWouterRoutes } from "./app/routes"
import { createEnvironment } from "./environment"

export const createTappedContext = async (graphqlURL: string, req: FastifyRequest, res: FastifyReply) => {
  const recordSource = new RecordSource()
  const environment = createEnvironment(graphqlURL, recordSource)

  return createWouterSSRContext({
    graphqlURL,
    request: req,
    reply: res,
    routes: createWouterRoutes(environment),
    environment,
    recordSource,
  })
}

export const renderWouterApp = (context: any, options: RenderToPipeableStreamOptions) => {
  return renderWouterReactApp({
    context,
    App,
    options,
  })
}
