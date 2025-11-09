# @puzzmo/tapped

Tapped is a server-side rendering (SSR) framework for React applications built on Fastify, Vite, Relay, and Wouter. It provides a complete infrastructure for building type-safe, server-rendered React applications with GraphQL data fetching.

## Features

- **Fastify server setup** with Vite middleware for development and static file serving for production
- **React SSR streaming** with `renderToPipeableStream`
- **Wouter routing** with type-safe route matching and data preloading
- **Relay GraphQL** integration with server-side data hydration
- **React Helmet** for managing document head tags
- **Loader pattern** for route-based data preloading

## Installation

```bash
yarn add @puzzmo/tapped
```

## Usage

### Server Setup

Create a `server.mts` file:

```typescript
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { registerSSRHandler, setupServer, startServer } from "@puzzmo/tapped/server"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = {
  port: 8912,
  base: "/",
  isProduction: process.env.NODE_ENV === "production",
  isDev: !process.env.NODE_ENV,
  abortDelay: 10000,
  graphQLURL: "https://api.example.com/graphql",
  debugLog: (...args) => console.log(...args),
}

const { fastify, vite, templateHtml, serverModulePath } = await setupServer({
  config,
  __dirname,
})

registerSSRHandler({
  fastify,
  vite,
  templateHtml,
  serverModulePath,
  config,
  productionServerModulePath: pathToFileURL(path.resolve(__dirname, "./dist/server/tappedServerModule.mjs")).href,
})

startServer(fastify, config.port)
```

### SSR Entry Point

Create a `tappedServerModule.ts` file that exports functions matching the expected interface:

```typescript
import { FastifyReply, FastifyRequest } from "fastify"
import { type RenderToPipeableStreamOptions } from "react-dom/server"
import { RecordSource } from "relay-runtime"

import { createWouterSSRContext, renderWouterReactApp } from "@puzzmo/tapped/src/server"

import { App } from "./app/App"
import { createWouterRoutes } from "./app/routes"
import { createEnvironment } from "./environment"
import { loadRootQuery } from "./queries/RootQuery"

// Create a single Relay environment that will be shared across all loaders
export const createTappedContext = async (graphqlUrl: string, req: FastifyRequest, res: FastifyReply) => {
  const recordSource = new RecordSource()
  const cookieHeader = req.headers.cookie
  const environment = createEnvironment(graphqlUrl, recordSource, cookieHeader)

  return createWouterSSRContext({
    graphqlUrl,
    request: req,
    reply: res,
    routes: createWouterRoutes(environment),
    rootBootstrappingLoader: loadRootQuery(environment), // Optional root data loader
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
```

**Important:** The function names must be `createTappedContext` and `renderWouterApp` as expected by the SSR handler, or it will throw,

### Route Definitions

Define routes with loaders. **Important:** Routes need to be created with an environment instance:

```typescript
import { lazy } from "react"
import { Environment } from "react-relay"

import { preload } from "@puzzmo/tapped/src/relay"
import { WouterRoute } from "@puzzmo/tapped/src/routing"

const HomePage = lazy(() => import("../pages/HomePage"))
const AboutPage = lazy(() => import("../pages/AboutPage"))

// Loader functions receive the environment
const loadHomePageQuery = (environment: Environment) => {
  return async ({ request, params }: LoaderArgs) => {
    return preload(environment, HomePageQuery, { id: params.id })
  }
}

export const createWouterRoutes = (environment: Environment): WouterRoute[] => [
  {
    path: "/",
    component: HomePage,
    loader: loadHomePageQuery(environment),
  },
  {
    path: "/about",
    component: AboutPage,
  },
]
```

**Key point:** All loaders must use the same Relay environment instance to ensure data loaded on the server is available during rendering.

### Client-Side Hydration

In your client entry point:

```typescript
import ReactDOM from "react-dom/client"
import { RecordSource } from "relay-runtime"

const recordSource = new RecordSource(window.__RECORD_SOURCE)
const loaderData = window.__LOADER_DATA

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <App loaderData={loaderData} />
)
```

### Using Loader Data in Components

With `useLazyLoadQuery` and shared environment:

```typescript
import { graphql } from "react-relay"
import { useGetMainPageQuery } from "./queries/utils"

const Query = graphql`
  query MyPageQuery {
    title
  }
`

// Helper hook that uses the query
export const useMyPageQuery = () => useGetMainPageQuery<MyPageQueryType>(Query)

const MyPage = () => {
  const { query } = useMyPageQuery()
  return <div>{query.title}</div>
}
```

**How it works:** When data is preloaded during SSR using the same environment instance, `useLazyLoadQuery` with `fetchPolicy: "store-or-network"` will read from the cache without suspending. On client-side navigation, it will fetch as needed.

## API Reference

### Server (`@puzzmo/tapped/src/server`)

- `setupServer(options)` - Sets up Fastify server with Vite middleware
- `registerSSRHandler(options)` - Registers the catch-all SSR route handler
  - `productionServerModulePath` - Absolute file URL to built server module
  - Expects your server module to export `createTappedContext` and `renderWouterApp` functions
- `startServer(fastify, port)` - Starts the Fastify server
- `createWouterSSRContext(options)` - Creates SSR context with route matching and data loading
  - `environment` - Relay environment instance (shared across loaders)
  - `recordSource` - RecordSource for data serialization
  - `rootBootstrappingLoader` (optional) - Loader for app-wide data
- `renderWouterReactApp(options)` - Renders React app to a pipeable stream

### Routing (`@puzzmo/tapped/src/routing`)

- `matchRoute(pathname, routes)` - Matches a pathname against route definitions
- `loadRouteData(match, request)` - Executes the loader for a matched route
- `createRouteElements(routes)` - Generates Wouter Route components

### Relay (`@puzzmo/tapped/src/relay`)

- `preload(environment, query, variables)` - Preloads GraphQL data during SSR
  - Returns `PreloadedData<TQuery>` with `query`, `variables`, and `graphql` fields
  - Data is loaded into the environment's store for reuse during rendering
- `useGetMainPageQuery(query, variables)` - Hook using `useLazyLoadQuery` with `store-or-network` policy
  - Reads from cache if data exists (SSR), otherwise fetches (CSR)

### Client (`@puzzmo/tapped/src/client`)

- `WouterLoaderProvider` - Context provider for loader data
- `useSSRData()` - Hook to access SSR loader data from context or `window.__LOADER_DATA`

## Thanks

This project builds on my [Relay Vite SSR Example](https://github.com/orta/relay-vite-ssr-example?tab=readme-ov-file#relay-vite-ssr-example) which builds on [Aqora's excellent Implementing Streaming SSR with React Relay and Vite](https://aqora.io/blog/implementing-streaming-ssr-with-react-relay-and-vite-899908).

## License

MIT
